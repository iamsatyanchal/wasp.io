import * as React from "react";
import { Modal, Button, Header, Icon, Image, Statistic } from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";
import * as _ from "lodash";
import * as uuid from "uuid/v1";
import { logUtils } from "../../components/utility/log";
import { socketIOActionCreators } from "../../redux/actions/socketio";
import { isEdge, captureMicrophone } from "../../components/utility/index";

interface OutgoingCallModalActions {
    onCallAccepted?: () => void;
    onCallEnded?: (contact: WaspUser) => any;
    onSendAudioStream?: (contact: WaspUser, blob: Blob) => any;
}
interface OutgoingCallModalViewProps {
    login?: WaspUser;
    open: boolean;
    onEndCall: () => void;
    contact: WaspUser;
    callConnected?: boolean;
    soundDiv?: HTMLAudioElement;
    actions?: OutgoingCallModalActions;

}

interface OutgoingCallModalViewState {
    open?: boolean;
    callConnected?: boolean;
    callDuration?: number;
    rejectedPermissions?: boolean;
    rejectedError?: any;
    audioBuffers?: ArrayBuffer[];
    nextTime?: number;
}

const mapStateToProps = (state: ApplicationState, ownProps: OutgoingCallModalViewProps) => {
    return _.assign({}, ownProps, { login: state.login.user });
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            _.assign({}, socketIOActionCreators, { push }), dispatch),
        dispatch
    }
}

class OutgoingCallModalView extends React.Component<OutgoingCallModalViewProps, OutgoingCallModalViewState> {
    /**
     * Stores reference to call duration counting function. This makes it easy to stop counting by clearing
     * this interval
     */
    private callInterval: NodeJS.Timer;
    /**
     * Socket.IO client object
     */
    private io: SocketIO.Socket = (window as any).IOAudioClient;
    /**
     * Initialized RecordRTC window object
     */
    private recorder: RecordRTC;
    /**
     * Reference to the microphone returned by requesting getUserMedia
     */
    private microphone: any;
    /**
     * Stores refrence to audio streaming loop function. Destroy this when call ends.
     */
    private streamInterval: NodeJS.Timer;
    /**
     * How long (in milliseconds) to wait before sending streams
     */
    private sendStreamAfter: number = 250;
    private audioContext: AudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
    constructor(props) {
        super(props);
        this.state = {
            open: props.open || false,
            callConnected: props.callConnected || false,
            callDuration: 0,
            rejectedError: null,
            rejectedPermissions: false,
            audioBuffers: [],
            nextTime: 0
        }
    }

    componentDidMount() {
        // socket io events
        this.setUpEvents();
        // If we receive a callConnected prop, this means that this is from the callee (one being called),
        // start the call & start counting & streaming audio to them
        if (this.props.callConnected && !this.callInterval) {
            if (this.microphone) {
                this.startCounting();
                this.setupMediaStreamer();
            } else {
                captureMicrophone().then((mic) => {
                    this.microphone = mic;
                    this.startCounting();
                    this.setupMediaStreamer();
                }).catch((error) => {
                    this.setState({
                        rejectedError: error,
                        rejectedPermissions: true
                    });
                    console.error(error);
                });
            }
        }
    }

    setupMediaStreamer = (contact?: WaspUser) => {
        const options = {
            type: 'audio',
            // recorderType: StereoAudioRecorder,
            numberOfAudioChannels: isEdge ? 1 : 2,
            checkForInactiveTracks: true,
            bufferSize: 16384,
            timeSlice: this.sendStreamAfter // send this in 250ms chunks
        } as any;
        
        if (navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
            options.sampleRate = 48000; // or 44100 or remove this line for default
        }

        this.recorder = (window as any).RecordRTC(this.microphone, options);
        this.recorder.startRecording();
        this.startStreaming();
    }

    startStreaming = (target?: WaspUser) => {
        const { actions, contact } = this.props;
        const user = target || contact;
        const streamInterval = setInterval(() => {
            var internal = this.recorder.getInternalRecorder();
            if (internal && typeof internal.getArrayOfBlobs === "function") {
                var recorded = internal.getArrayOfBlobs();
                var blob = new Blob(recorded, {
                    type: 'audio/webm'
                });
                actions.onSendAudioStream(user, blob);
                // recorder.clearRecordedData();
            }
        }, this.sendStreamAfter);

        this.streamInterval = streamInterval;
    }
    // goes to this.state.audioBuffers and plays the most recent audio-clip
    audioPlayerScraper = _.debounce(() => {
        let { audioBuffers, nextTime } = this.state;
        while (audioBuffers.length > 0) {
            const buffer = audioBuffers.shift();
            const source = this.audioContext.createBufferSource();
            this.audioContext.decodeAudioData(buffer)
                .then((audioBuff) => {
                    source.buffer = audioBuff;
                    source.connect(this.audioContext.destination);
                    source.start(nextTime);
                    nextTime = source.buffer.duration; // make the next buffer wait for the length of the previous buffer being
                    this.setState({
                        nextTime
                    })
                });
        }
    }, 250);

    setUpEvents = () => {
        const { actions } = this.props;
        // These events are triggered by the person being called
        this.io.on('call-accepted', (contact: WaspUser) => {
            //
            this.setState({
                callConnected: true
            });
            // end call sound
            this.stopCallSound();
            // start counting
            if (this.microphone) {
                this.startCounting();
                this.setupMediaStreamer(contact);
            } else {
                captureMicrophone().then((mic) => {
                    this.microphone = mic;
                    this.startCounting();
                    this.setupMediaStreamer(contact);
                    logUtils.logMessage('[SocketIO] Call has been accepted :' + JSON.stringify(contact), 'green');
                }).catch((error) => {
                    this.setState({
                        rejectedError: error,
                        rejectedPermissions: true
                    });
                    console.error(error);
                });
            }
        });
        //
        this.io.on('call-ended', (contact) => {
            this.setState({
                callConnected: false,
                open: false
            });
            logUtils.logMessage('[SocketIO] Call has been ended :' + JSON.stringify(contact), 'red');
        });
        //
        this.io.on('audio-message', (blob: ArrayBuffer) => {
            if (blob) {
                const oldBuffers: ArrayBuffer[] = this.state.audioBuffers;
                oldBuffers.push(blob);
                this.setState({
                    audioBuffers: oldBuffers
                });
                this.audioPlayerScraper();
                logUtils.logMessage('[SocketIO] New audio stream :' + JSON.stringify(blob));
            }
        })
    }

    stopCallSound = () => {
        const { soundDiv } = this.props;
        if (soundDiv) {
            soundDiv.pause();
            soundDiv.currentTime = 0;
        }
    }

    shouldComponentUpdate(nextProps: OutgoingCallModalViewProps, nextState: OutgoingCallModalViewState) {
        const {
            open: stateOpen,
            callConnected: stateConnected,
            callDuration,
            rejectedError,
            rejectedPermissions
        } = this.state;
        const { login, open, contact, callConnected, soundDiv } = this.props;

        return login !== nextProps.login ||
            open !== nextProps.open ||
            contact !== nextProps.contact ||
            callConnected !== nextProps.callConnected ||
            soundDiv !== nextProps.soundDiv ||
            stateOpen !== nextState.open ||
            stateConnected !== nextState.callConnected ||
            callDuration !== nextState.callDuration ||
            rejectedError !== nextState.rejectedError ||
            rejectedPermissions !== nextState.rejectedPermissions
    }

    componentWillReceiveProps(nextProps: OutgoingCallModalViewProps, nextState: OutgoingCallModalViewState) {
        console.table(nextState);
    }

    componentWillUnmount() {
       this.callInterval = null;
       this.streamInterval = null;
    }

    startCounting = () => {
        let duration = 0;
        this.callInterval = setInterval(() => {
            this.setState({
                callDuration: ++duration
            })
        }, 1000);
    }

    open = () => this.setState({ open: true })

    close = () => this.setState({ open: false })

    endCall = () => {
        const { actions, contact, onEndCall} = this.props;
        onEndCall();
        this.setState({
            open: false
        });
        this.streamInterval = null;
        this.callInterval = null;
        actions.onCallEnded(contact);
    }

    pad = (num) => {
        return ("0" + num).slice(-2);
    }

    toHHMMSS = (seconds: number) => {
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        let hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        return {
            hours,
            minutes,
            seconds
        };
    }

    render() {
        const { open, callConnected, callDuration } = this.state;
        const { contact } = this.props;
        const name = _.startCase(_.toLower(contact.name));
        const firstName = _.startCase(contact.name.split(' ')[0]);
        const defaultImage = '/img/avatar.png';
        const duration = this.toHHMMSS(callDuration);
        return (
            <Modal
                open={open}
                onOpen={this.open}
                onClose={this.close}
                size='mini'
                style={{
                    width: 400
                }}
                closeOnDimmerClick={false}
                closeOnDocumentClick={false}
                basic
            >
            <Image
                style={{
                    borderRadius: "50%"
                }}
                centered
                circular
                size='small'
                src={defaultImage}
                />
                <Header as='h2' textAlign='center'>
                    <Header.Content>
                        {(callConnected ? ' Connected with ' : ' Calling ') + firstName}
                        <div>
                            <Statistic color='red' inverted>
                                <Statistic.Value>
                                    {duration.hours > 0
                                        ?
                                        <span>{this.pad(duration.hours)}<span className="f-20">h</span></span>
                                        : null
                                    }
                                    {duration.minutes > 0
                                        ?
                                        <span> {this.pad(duration.minutes)}<span className="f-20">m</span></span>
                                        : null
                                    }
                                    {duration.seconds > 0
                                        ?
                                        <span> {this.pad(duration.seconds)}<span className="f-20">s</span></span>
                                        : null
                                    }
                                </Statistic.Value>
                            </Statistic>
                        </div>
                    </Header.Content>
                </Header>
                <Modal.Content>
                    {!callConnected &&
                        <p>
                            We are trying to contact {firstName}. We will connect you as soon as the call goes through.
                        </p>
                    }
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color='red' onClick={e => this.endCall()} inverted>
                        <Icon name='phone' /> End Call
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export const OutgoingCallModal = connect(mapStateToProps, mapDispatchToProps)(OutgoingCallModalView);