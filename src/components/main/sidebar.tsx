import * as React from "react";
import { Card } from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";
import * as _ from "lodash";

interface SidebarViewProps {
    login?: WaspUser;
}

interface SidebarViewState {

}

const mapStateToProps = (state: ApplicationState, ownProps: SidebarViewProps) => {
    return _.assign({}, ownProps, { login: state.login.user });
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            _.assign({}, { push }), dispatch),
        dispatch
    }
}

class SidebarView extends React.Component<SidebarViewProps, SidebarViewState> {
    constructor(props) {
        super(props);
    }
    render () {
        const extra = (
            <span/>
        );
        const {login: {email, name}} = this.props;
        return (
            <div className="p-10">
                <Card
                    image='/img/avatar.png'
                    meta={email}
                    header={name}
                    fluid
                />
            </div>
        )
    }
}

export const Sidebar = connect(mapStateToProps, mapDispatchToProps)(SidebarView);