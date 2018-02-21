import * as React from "react";
import { Button, Icon, Form, Checkbox } from "semantic-ui-react";
import loginAction from "../../redux/actions/login";
import * as $ from "jquery";
import * as _ from "lodash";
import { FormEvent, MouseEvent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loginActionCreators } from "../../redux/actions/login";
import { socketIOActionCreators } from "../../redux/actions/socketio";
import { push } from "react-router-redux";
import * as H from 'history';

interface LoginActions {
    onLogin?: (user: WaspUser) => void;
    onEstablishConnection?: (userId: string) => void;
    push?: (to?: string) => any;
}

interface LoginViewProps extends React.Props<LoginView> {
    actions?: LoginActions;
    push?: (to?: string) => any;
    history?: H.History;
    login?: WaspUser;
}

interface LoginViewState {
    loggedIn?: boolean;
    withEmail?: boolean;
}

const mapStateToProps = (state: any, ownProps: LoginViewProps) => {
    const login = state.login;
    return _.assign({}, ownProps, { login });
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            _.assign({}, { push }, loginActionCreators, socketIOActionCreators),
            dispatch
        ),
        dispatch,
    }
}

class LoginView extends React.Component<LoginViewProps, LoginViewState> {
    constructor (props) {
        super(props);
        this.state = {
            loggedIn: props.login.loggedIn || false,
            withEmail: true
        }
    }

    onLoginClick = (e: MouseEvent<HTMLButtonElement>) => {
        this.setState({ loggedIn: true});
    }

    toogleLoginState = () => {
        this.setState({ withEmail: !this.state.withEmail });
    }

    onFormSubmit = (e: FormEvent<HTMLDivElement>) => {
        let details = $(e.target).serializeArray();
        // temporary login test
        let email = _.find(details, { name: "email" }).value;
        const user: WaspUser = {
            name: "Example User",
            email: email,
            loggedIn: true
        }
        this.props.actions.onLogin(user);
        this.props.actions.onEstablishConnection(user.email);
        //
        this.props.actions.push('/dashboard');
        return false;
    }

    render () {
        const { withEmail } = this.state;
        const loginForm: JSX.Element = (
            <div
                className="signin-form m-b-10"
                style={{
                    border: "1px #d1d1d1 solid",
                    padding: "10px"
                }}
                onSubmit={this.onFormSubmit}>
                <Form>
                    <Form.Field>
                        <label>Username / Email</label>
                        <input placeholder='Username / Email' name='email' type='email' autoComplete="username" />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input placeholder='Password' name='password' type='password' autoComplete="current-password" />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox name='remember-me' label='Remember Me' />
                    </Form.Field>
                    <Button type='submit' color='green'>Submit</Button>
                </Form>
            </div>
        );
        return (
            <div className="login-screen">
                <div className="login-container">
                    { withEmail ?
                        loginForm
                        :
                        <Button
                            className="m-b-10"
                            style={{ marginTop: "200px" }}
                            color="google plus"
                            fluid
                            onClick={this.onLoginClick}
                            >
                            <Icon name="google plus" /> Signin with Google
                        </Button>
                    }
                    <span
                        className="clickable c-blue"
                        onClick={this.toogleLoginState}>
                        {withEmail ? 
                            "Have a Google account? Login with Google+"
                            :
                            "Login with email"
                        }
                    </span>
                </div>
            </div>
        )
    }
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginView);