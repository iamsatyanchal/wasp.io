import * as React from "react";
import { Modal, Button, Header, Icon, Image, Statistic } from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";
import * as _ from "lodash";
import * as uuid from "uuid/v1";

interface OutgoingCallModalViewProps {
    login?: WaspUser;
    open: boolean;
    onEndCall: () => void;
    contact: { name: string, id: string, date: string, image ?: string }
    callConnected?: boolean;
    soundDiv?: HTMLAudioElement;
}

interface OutgoingCallModalViewState {
    open?: boolean;
    callConnected?: boolean;
    callDuration?: number;
}

const mapStateToProps = (state: ApplicationState, ownProps: OutgoingCallModalViewProps) => {
    return _.assign({}, ownProps, { login: state.login.user });
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            _.assign({}, { push }), dispatch),
        dispatch
    }
}

class OutgoingCallModalView extends React.Component<OutgoingCallModalViewProps, OutgoingCallModalViewState> {
    private callInterval: NodeJS.Timer;
    constructor(props) {
        super(props);
        this.state = {
            open: props.open || false,
            callConnected: props.callConnected || false,
            callDuration: 0
        }
    }

    componentDidMount() {
        // send socket request
        setTimeout(() => {
            this.setState({
                callConnected: true,
            });
        }, 5000);
    }

    componentDidUpdate(nextProps: OutgoingCallModalViewProps, nextState: OutgoingCallModalViewState) {
        if (this.state.callConnected && !this.callInterval) {
            // end call sound
            this.stopCallSound();
            // start counting
            console.log('starting call');
            this.startCounting();
        }
    }

    stopCallSound = () => {
        const { soundDiv } = this.props;
        if (soundDiv) {
            soundDiv.pause();
            soundDiv.currentTime = 0;
        }
    }

    componentWillUnmount() {
        clearInterval(this.callInterval);
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
        this.props.onEndCall();
        this.setState({
            open: false
        });
        
        clearInterval(this.callInterval);
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
                src={contact.image || defaultImage}
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