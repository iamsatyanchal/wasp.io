import * as _ from "lodash";

interface LoginState {
    user?: WaspUser;
}

const initialState: LoginState = {
    user: null
}

interface UserAction extends Action {
    user?: WaspUser
}

const LoginReducer = (state = initialState, action: UserAction) => {
    switch (action.type) {
        case 'LOG_IN':
            const oldState = {
                user: action.user
            }
            return _.assign({}, state, oldState);
            break;    
        default:
            return state;
    }
}

export default LoginReducer;