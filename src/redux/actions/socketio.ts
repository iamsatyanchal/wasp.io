const establishConnectionAction = (userId: string, connected: boolean = false) => {
    return {
        type: 'ESTABLISH_CONNECTION_ACTION',
        userId,
        connected
    }
}

const callAction = (contact: Contacts.Contact) => {
    return {
        type: 'CALL_ACTION',
        contact
    }
}

const destroyConnectionAction = () => {
    return {
        type: 'DESTROY_CONNECTION_ACTION'
    }
}

const incomingCallAction = (contact: WaspUser) => {
    return {
        type: 'INCOMING_CALL_ACTIONS',
        contact
    }
};

const sendAudioStreamAction = (contact: WaspUser, blob: Blob) => {
    return {
        type: 'SEND_AUDIO_STREAM',
        contact,
        blob
    }
}

export const socketIOActionCreators = {
    onEstablishConnection: (userId: string) => {
        return (dispatch, getState) => {
            // establish connection here
            const io: SocketIO.Socket = (window as any).IOAudioClient;
            io.emit('open-call-channel', userId);
            dispatch(establishConnectionAction(userId, true));
        }
    },
    onCall: (from : WaspUser, to: Contacts.Contact) => {
        return (dispatch, getState) => {
            const io: SocketIO.Socket = (window as any).IOAudioClient;
            io.emit('call', {
                from,
                to
            });
            console.log('call', {
                from,
                to
            });
            dispatch(callAction(to));
        }
    },
    onAcceptCall: () => {
        return (dispatch, getState) => {
            const {socketIO: {userId, incomingCallRequest: {email}} }  = getState();
            const io: SocketIO.Socket = (window as any).IOAudioClient;
            io.emit('accept-call', {
                email,
                userId
            });
        }
    },
    onCallEnded: (contact?: WaspUser) => {
        return (dispatch, getState) => {
            const { socketIO: { userId } } = getState();
            const email = contact.id;
            const io: SocketIO.Socket = (window as any).IOAudioClient;
            io.emit('end-call', {
                email,
                userId
            });
        }
    },
    onDisconnect: () => {
        return (dispatch, getState) => {
            dispatch(destroyConnectionAction());
        }
    },
    onIncomingCall: (contact: WaspUser) => {
        return (dispatch, getState) => {
            dispatch(incomingCallAction(contact));
        }
    },
    onSendAudioStream: (contact: WaspUser, blob: Blob) => {
        return (dispatch, getState) => {
            const io: SocketIO.Socket = (window as any).IOAudioClient;
            io.emit('send-audio-stream', {
                email: contact.email,
                data: blob
            });
            console.log('Fuck niggas on yo\' payroll!, but you knew \'em for a month tho\'', {
                email: contact.email,
                data: blob
            })
            dispatch(sendAudioStreamAction(contact, blob));
        }
    }
}