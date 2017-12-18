import * as React from "react";
import { Card, Feed, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";
import * as _ from "lodash";
import * as uuid from "uuid/v1";
import { OutgoingCallModal } from "./outgoing-call-modal";

interface ContactsViewProps {
    login?: WaspUser;
}

interface ContactsViewState {
    calling?: boolean;
    callingWho?: { name: string, id: string, date: string, image?: string };
}

const mapStateToProps = (state: ApplicationState, ownProps: ContactsViewProps) => {
    return _.assign({}, ownProps, { login: state.login.user });
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            _.assign({}, { push }), dispatch),
        dispatch
    }
}

class ContactsView extends React.Component<ContactsViewProps, ContactsViewState> {
    audioEl: HTMLAudioElement;
    constructor(props) {
        super(props);
        this.state = {
            calling: false,
            callingWho: null
        }
    }

    initiateCall = (contact: { name: string, id: string, date: string, image?: string }) => (e?: any) => {
        this.setState({
            calling: true,
            callingWho: contact
        });
        this.setupOutgoingCallSound();
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

    endCall = () => {
        this.setState({
            calling: false
        });
        // stop the outgoing call sound
        if (this.audioEl) {
            this.audioEl.pause();
            this.audioEl.currentTime = 0;
        }
    }

    render() {
        const { login: { email, name } } = this.props;
        const { calling, callingWho } = this.state;
        const contacts: { name: string, id: string, date: string, image?: string }[] = [
            { name: 'Polycarp Masika', id: uuid(), date: '1 day ago' },
            { name: "John Lennon", id: uuid(), date: '2 days ago' },
            { name: "Chris Martin", id: uuid(), date: '3 days ago' },
            { name: "Sarah lee", id: uuid(), date: '4 days ago' },
            { name: "Jullie Hyman", id: uuid(), date: '5 days ago' }
        ]
        //
        const contactList: JSX.Element[] = [];
        _.map(contacts, (contact, index) => {
            contactList.push(
                <Feed.Event key={contact.id}>
                    <Feed.Label image={contact.image || '/img/avatar.png'} />
                    <Feed.Content>
                        <Feed.Date content={contact.date} />
                        <Feed.Summary>
                            {contact.name}
                        </Feed.Summary>
                    </Feed.Content>
                    <Feed.Meta>
                        <div className='ui two buttons'>
                            <Button icon='video camera' primary className='m-r-0'></Button>
                            <Button basic icon='microphone' color='green' className='m-l-0' onClick={this.initiateCall(contact)}></Button>
                        </div>
                    </Feed.Meta>
                </Feed.Event>
            );
        });

        return (
            <div className="p-10">
                { calling &&
                    <OutgoingCallModal
                        soundDiv={this.audioEl}
                        contact={callingWho}
                        open={calling}
                        onEndCall={this.endCall}
                        />
                }
                <Card fluid>
                    <Card.Content>
                        <Card.Header> Your contact list </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <Feed>
                            {contactList}
                        </Feed>
                    </Card.Content>
                </Card>
                <audio style={{ display: "none" }} src="/sounds/outgoing.mp3" ref={me => this.audioEl = me}></audio>
            </div>
        )
    }
}

export const Contacts = connect(mapStateToProps, mapDispatchToProps)(ContactsView);