interface WaspUser {
    name?: string;
    email?: string;
    loggedIn?: boolean;
}

interface Action {
    type?: string
}
interface ApplicationState {
    login?: {
        user?: WaspUser
    }
}
