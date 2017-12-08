import { MasterApp } from "../main/master";
import { Header } from "../../components/main/header";
import { Footer } from "../../components/main/footer";
import * as React from "react";
import { HashRouter, Route } from "react-router-dom";

export class MasterRouterView extends React.Component<any, any> {
    onEnterMaster  = (props) => {
        //
    }

    render () {
        return (
            <HashRouter>
                <main>
                    {/* not having a path means it always loads */}
                    <Route component={Header} />
                    <Route component={Footer} />
                </main>
            </HashRouter>
        )
    }
}

export const MasterRouter = MasterRouterView;
