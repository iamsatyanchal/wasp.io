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
    login?: WaspUser;
    history?: History;
}

interface MasterRouterViewState {

}

const mapStateToProps = (state: ApplicationState, ownProps: MasterRouterViewProps) => {
    const login = state.login;
    return _.assign({}, ownProps, { login });
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
        const { history, login: {loggedIn}} = this.props;
        const routes = !loggedIn ? (
                <main>
                    {/* not having a path means it always loads */}
                    <Route component={Header} />
                    <Switch>
                        <Route component={Login} path='/login' />
                        <Route component={MasterApp} path="/dashboard" render={() => (
                            !loggedIn ? <Redirect to="/login" /> : null
                        )} />
                    </Switch>
                </main>
            )
            :
            <Redirect to="/login" />;
        //
        return (
            <Router history={history}>
                {routes}
            </Router>
        )
    }
}

export const MasterRouter = connect(mapStateToProps, mapDispatchToProps)(MasterRouterView);
