import * as _ from "lodash";

interface ApplicationState {
    user?: any,
    primaryTheme?: any,
    data?: any[]
}

const initialState: ApplicationState = {
    user: null,
    primaryTheme: null,
    data: []
}

const example = (state: ApplicationState = initialState, action) => {
    switch (action.type) {
        case 'EXAMPLE_ACTION':
            console.log('EXAMPLE_ACTION invoked');
            const newState: ApplicationState = {
                data: [...state.data, {
                    id: action.id,
                    text: action.text
                }]
            }
            return _.assign({}, state, newState);
        default:
            return state;
    }
}

export default example;