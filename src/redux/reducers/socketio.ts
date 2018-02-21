import * as _ from "lodash";

interface SocketIOState {
    connected?: boolean;
    userId?: string;
    outGoingCallRequest?: Contacts.Contact;
    incomingCallRequest?: WaspUser;
}

const initialState: SocketIOState = {
    connected: false,
    userId: null,
    outGoingCallRequest: null,
    incomingCallRequest: null
}

interface SocketIOAction extends Action {
    userId?: string;
    connected?: boolean;
    contact?: Contacts.Contact;
}

export const SocketIOReducer = (state = initialState, action: SocketIOAction) => {
    switch (action.type) {
        case 'ESTABLISH_CONNECTION_ACTION':
            const oldState: SocketIOState = {
                connected: action.connected,
                userId: action.userId,
                outGoingCallRequest: null,
                incomingCallRequest: null
            };
            return _.assign({}, state, oldState);
            break;
        case 'CALL_ACTION':
            return _.assign({}, state, {
                outGoingCallRequest: action.contact
            });
            break;
        case 'DESTROY_CONNECTION_ACTION':
            return _.assign({}, state, {
                connected: false,
                userId: null
            });
        case 'INCOMING_CALL_ACTIONS':
            return _.assign({}, state, {
                incomingCallRequest: action.contact
            });
        default:
            return state;
    }
}