import * as React from "react";
import { connect } from "react-redux";
import * as _ from "lodash";
import exampleAction from "../../redux/actions/index";

interface HeaderViewProps extends React.Props<HeaderView> {
    data?: any;
    onItemClick?: (text: any) => void;
}

interface HeaderViewState {

}

const mapStateToProps = (state: any, ownProps: HeaderViewProps) => {
    const data = state.example.data;
    return _.assign({}, ownProps, {data});
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
    }
    render () {
        return (
            <nav onClick={(e) => this.props.onItemClick('test:' + Math.random())}>
                 This the header   
            </nav>
        )
    }
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderView);