import * as React from "react";
import { Card, Rail, Segment, Feed, Icon, Button, Image, Item } from "semantic-ui-react";
import { OutgoingCallModal } from "./outgoing-call-modal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";
import * as _ from "lodash";

interface IncomingCallContainerViewProps {
    login?: WaspUser;
}

interface IncomingCallContainerViewState {
    callDeclined?: boolean;
    callAccepted?: boolean;
}

const mapStateToProps = (state: ApplicationState, ownProps: IncomingCallContainerViewProps) => {
    return _.assign({}, ownProps, { login: state.login.user });
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            _.assign({}, { push }), dispatch),
        dispatch
    }
}

class IncomingCallContainerView extends React.Component<IncomingCallContainerViewProps, IncomingCallContainerViewState> {
    audioEl: HTMLAudioElement;
    constructor(props) {
        super(props);
        this.state = {
            callDeclined: false,
            callAccepted: false
        }
    }

    componentDidMount () {
        this.setupOutgoingCallSound();
    }

    componentWillUnmount () {
        this.stopAudio();
    }

    stopAudio = () => {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
    }

    setupOutgoingCallSound = () => {
        if (this.audioEl) {
            this.audioEl.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
            this.audioEl.play();
        }
    }

    declineCall = (e?) => {
        this.stopAudio();
        this.setState({
            callDeclined: true
        });
    }

    acceptCall = (e?) => {
        this.stopAudio();
        this.setState({
            callAccepted: true
        })
    }

    onEndCall = () => {
        this.setState({
            callAccepted: false,
            callDeclined: true
        })
    }

    render() {
        const extra = (
            <span />
        );
        const { login: { email, name } } = this.props;
        const { callDeclined, callAccepted } = this.state;
        const defaultImage = '/img/avatar.png';
        const classNames = (callDeclined || callAccepted) ? "bounceOutRight" : "bounce incoming-call";
        const contact: { name: string, id: string, date: string, image?: string } = {
            name: 'Polycarp Masika', id: 'xx-ssd-fd-i', date: '1 day ago'
        };
        return (
            <section>
                {callAccepted && <OutgoingCallModal callConnected={true} contact={contact} open={true} onEndCall={this.onEndCall} />}
                <Rail internal position='right' className='p-10 m-r-0' size='large' style={{
                    zIndex: 9999,
                    width: 390
                }}>
                    <Segment raised className={"animated " + classNames}>
                        <Feed className="m-b-10">
                            <Feed.Event className="m-t-10">
                                <Feed.Label>
                                    <Image size='medium' src={defaultImage} />
                                </Feed.Label>
                                <Feed.Content>
                                    <a>{_.startCase(_.toLower(name))}</a> is calling...
                                </Feed.Content>
                                <Feed.Extra>
                                    <Button color='green' circular size='small' onClick={this.acceptCall}>
                                        <Icon name='phone' />
                                    </Button>
                                    <Button color='red' circular basic size='small' onClick={this.declineCall}>
                                        <Icon name='phone' />
                                    </Button>
                                </Feed.Extra>
                            </Feed.Event>
                        </Feed>
                        <audio style={{ display: "none" }} src="/sounds/incoming.mp3" ref={me => this.audioEl = me}></audio>
                    </Segment>
                </Rail>
            </section>
        )
    }
}

export const IncomingCallContainer = connect(mapStateToProps, mapDispatchToProps)(IncomingCallContainerView);