import { MasterApp } from "../main/master";
import { Header } from "../../components/main/header";
import { Footer } from "../../components/main/footer";
import  { Login } from "../../containers/login/login";
import * as React from "react";
import * as _ from "lodash";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { History } from "history";

interface MasterRouterViewProps {
    user?: WaspUser;
    history?: History;
}

interface MasterRouterViewState {

}

const mapStateToProps = (state: ApplicationState, ownProps: MasterRouterViewProps) => {
    const user = state.login.user;
    return _.assign({}, ownProps, { user });
}

const mapDispatchToProps = dispatch => {
    return {
        
    }
}

class MasterRouterView extends React.Component<MasterRouterViewProps, MasterRouterViewState> {
    constructor (props) {
        super(props);
    }
    render () {
        const { history, user } = this.props;
        const routes = (user && user.loggedIn) ? (
                <main>
                    {/* not having a path means it always loads */}
                    <Route component={Header} />
                    <Switch>
                        <Route component={MasterApp} path='/dashboard' />
                    </Switch>
                </main>
            )
            :
            <Route component={Login} />
        //
        return (
            <Router history={history}>
                {routes}
            </Router>
        )
    }
}

export const MasterRouter = connect(mapStateToProps, mapDispatchToProps)(MasterRouterView);
