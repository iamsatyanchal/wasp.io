export const STATE_LOGIN = "wasp.io:state";
export const stateLoader = {
    load: () => {
        try {
            let serializedState = localStorage.getItem(STATE_LOGIN);

            if (serializedState === null) {
                return stateLoader.initialize();
            }

            return JSON.parse(serializedState);
        }
        catch (err) {
            return stateLoader.initialize();
        }
    },
    save: (state) => {
        console.log(state);
        try {
            let serializedState = JSON.stringify(state);
            localStorage.setItem(STATE_LOGIN, serializedState);

        }
        catch (err) {
        }
    },
    initialize: () => {
        return {
            // empty state
        }
    }
}