import * as React from "react";
import { connect } from "react-redux";
import * as _ from "lodash";
import { Menu } from "semantic-ui-react";
import * as H from 'history';
import exampleAction from "../../redux/actions/index";

interface HeaderViewProps extends React.Props<HeaderView> {
    data?: any;
    onItemClick?: (text: any) => void;
    currentRoute?: string;
    location: H.Location;
}

interface HeaderViewState {
    activeItem?: string;
}

const mapStateToProps = (state: any, ownProps: HeaderViewProps) => {
    const data = state.example.data;
    const currentRoute = ownProps.location.pathname;
    return _.assign({}, ownProps, {data, currentRoute});
}

const mapDispatchToProps = dispatch => {
    return {
        onItemClick: (text: any) => {
            dispatch(exampleAction(text));
        }
    }
}

class HeaderView extends React.Component<HeaderViewProps, HeaderViewState> {
    constructor (props) {
        super(props);
        this.state = {
            activeItem: 'home'
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
    
    render () {
        const { activeItem } = this.state;
        const { currentRoute } = this.props;
        const onLoginPage = _.startsWith(currentRoute, "/login");
        return (
            <Menu stackable>
                <Menu.Item>
                    <img src='/logo.png' />
                </Menu.Item>

                <Menu.Item
                    name='home'
                    active={activeItem === 'home'}
                    onClick={this.handleItemClick}
                >
                    Home
                </Menu.Item>

                {!onLoginPage &&
                <Menu.Item
                    name='features'
                    active={activeItem === 'features'}
                    onClick={this.handleItemClick}
                >
                    Features
                </Menu.Item>
                }

                {!onLoginPage &&
                <Menu.Item
                    name='testimonials'
                    active={activeItem === 'testimonials'}
                    onClick={this.handleItemClick}
                >
                    Testimonials
                </Menu.Item>
                }

                {!onLoginPage &&
                <Menu.Item
                    name='sign-in'
                    active={activeItem === 'sign-in'}
                    onClick={this.handleItemClick}
                >
                    Sign-in
                </Menu.Item>
                }
            </Menu>
        )
    }
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderView);