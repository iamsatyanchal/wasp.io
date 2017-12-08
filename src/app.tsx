import * as React from "react";
import * as Redux from "redux";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { WaspApp } from "./redux/reducers/index";
import { HashRouter, Route } from "react-router-dom";
import { createStore } from "redux";
import { MasterRouter } from "./components/routes/master-routes";

const store = createStore(WaspApp);

render(
    <Provider store={store}>
        <MasterRouter />
    </Provider>,
    document.getElementById("page-container"),
);