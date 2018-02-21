import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";
import * as _ from "lodash";
import { Grid } from "semantic-ui-react";
import { Sidebar } from "../main/sidebar";
import { Contacts } from "../../containers/contacts/contacts";
import { IncomingCallContainer } from "../../containers/contacts/incoming-call-container";
import { logUtils } from "../../components/utility/log";
import { socketIOActionCreators } from "../../redux/actions/socketio";

interface MasterAppActions {
    onEstablishConnection?: (userId: string) => void;
    onDisconnect?: () => void;
    onIncomingCall?: (whoIsCalling?: WaspUser) => any;
}
interface MasterAppProps {
    user?: WaspUser;
    actions?: MasterAppActions;
    socketIO?: SocketIO;
}
interface MasterAppState {

}
const mapStateToProps = (state: ApplicationState, ownProps: MasterAppProps) => {
    const { login: {user}, socketIO } = state;
    return _.assign({}, ownProps, { user, socketIO });
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            _.assign({}, { push }, socketIOActionCreators), dispatch),
        dispatch
    }
}
export class MasterAppView extends React.Component<MasterAppProps, MasterAppState> {
    private io: SocketIO.Socket = (window as any).IOAudioClient;
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.io.on("connect", this.ioConnectionEstablished);
    }

    componentWillReceiveProps (nextProps: MasterAppProps) {
        if (nextProps.socketIO.connected) {
            logUtils.logMessage('[SocketIO] Connection established with server', 'blue');
        }
    }

    ioConnectionEstablished = () => {
        const { actions, user, socketIO} = this.props;
        actions.onEstablishConnection(user.email);
        this.setUpEvents();
    }

    setUpEvents = () => {
        const { actions } = this.props;
        this.io.on('call-request', (contact: WaspUser) => {
            actions.onIncomingCall(contact);
            logUtils.logMessage('[SocketIO] Someone is calling :' + JSON.stringify(contact), 'green');
        });
    }

    render() {
        const { socketIO } = this.props;
        return (
            <section className="p-10">
                <Grid stackable>
                    <Grid.Row>
                        <div>
                            {socketIO.incomingCallRequest &&
                                <IncomingCallContainer contact={socketIO.incomingCallRequest} />
                            }
                        </div>
                        <Grid.Column width={3}>
                            {/* sidebar */}
                            <Sidebar />
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <Contacts />
                        </Grid.Column>
                        <Grid.Column width={4}>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </section>
        )
    }
}

export const MasterApp = connect(mapStateToProps, mapDispatchToProps)(MasterAppView);