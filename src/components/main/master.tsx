import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";
import * as _ from "lodash";
import { Grid } from "semantic-ui-react";
import { Sidebar } from "../main/sidebar";
import { Contacts } from "../../containers/contacts/contacts";
import { IncomingCallContainer } from "../../containers/contacts/incoming-call-container";

interface MasterAppProps {
    login?: WaspUser;
}
interface MasterAppState {

}
const mapStateToProps = (state: ApplicationState, ownProps: MasterAppProps) => {
    return _.assign({}, ownProps, {login: state.login});
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            _.assign({}, { push }), dispatch),
        dispatch
    }
}
export class MasterAppView extends React.Component<MasterAppProps, MasterAppState> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //
    }

    render() {
        return (
            <section className="p-10">
                <Grid stackable>
                    <Grid.Row>
                        <div>
                            <IncomingCallContainer />
                        </div>
                        <Grid.Column width={3}>
                            {/* sidebar */}
                            <Sidebar />
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <Contacts />
                        </Grid.Column>
                        <Grid.Column width={4}>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </section>
        )
    }
}

export const MasterApp = connect(mapStateToProps, mapDispatchToProps)(MasterAppView);