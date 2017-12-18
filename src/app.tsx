import * as React from "react";
import * as Redux from "redux";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { WaspApp } from "./redux/reducers/index";
import { HashRouter, Route } from "react-router-dom";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware, routerReducer } from "react-router-redux";
import { MasterRouter } from "./components/routes/master-routes";
import { createBrowserHistory } from "history";
import { stateLoader } from "./components/utility/localstore";
import * as _ from "lodash";

const state: ApplicationState = {
    login: {}
}
export function configureStore(history, initialState = {}) {

    const enhancer = compose(
        // Middleware you want to use in development:
        applyMiddleware(
            thunk,
            routerMiddleware(history)
        ),
        // Required! Enable Redux DevTools with the monitors you chose
        (window as any).devToolsExtension ? (window as any).devToolsExtension() : f => f
    );

    // Sync dispatched route actions to the history

    const store = createStore(WaspApp, initialState, enhancer);
    return store;
}
const history = createBrowserHistory();
const savedState = stateLoader.load();
const store = configureStore(history, savedState);

store.subscribe(() => {
    stateLoader.save(store.getState());
});

render(
    <Provider store={store}>
        <MasterRouter history={history} />
    </Provider>,
    document.getElementById("page-container"),
);