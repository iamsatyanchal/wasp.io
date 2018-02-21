interface WaspUser {
    id?: string;
    name?: string;
    email?: string;
    loggedIn?: boolean;
}

interface Action {
    type?: string
}

interface SocketIO {
    connected?: boolean;
    userId?: string;
    incomingCallRequest?: WaspUser;
    outgoingCallRequest?: Contacts.Contact;
}

declare namespace Contacts {
    interface Contact {
        name: string,
        id?: string,
        date?: string,
        email?: string,
        image?: string
    }
}
interface ApplicationState {
    login?: {
        user?: WaspUser
    };
    socketIO?: SocketIO;
}
