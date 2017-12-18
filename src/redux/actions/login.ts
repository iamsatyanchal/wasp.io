const loginAction = user => {
    return {
        type: "LOG_IN",
        user
    }
}
// action creators
export const loginActionCreators = {
    onLogin: (user: WaspUser) => {
        return (dispatch, getState) => {
            dispatch(loginAction(user));
        }
    }
}