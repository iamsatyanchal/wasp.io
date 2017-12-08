import * as React from "react";
import { connect } from "react-redux";
import * as _ from "lodash";
import exampleAction from "../../redux/actions/index";

interface FooterViewProps extends React.Props<FooterView> {
    data?: any;
    onItemClick?: (text: any) => void;
}

interface FooterViewState {

}

const mapStateToProps = (state: any, ownProps: FooterViewProps) => {
    const data = state.example.data;
    return _.assign({}, ownProps, { data });
}

const mapDispatchToProps = dispatch => {
    return {
        onItemClick: (text: any) => {
            dispatch(exampleAction(text));
        }
    }
}

class FooterView extends React.Component<FooterViewProps, FooterViewState> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <nav onClick={(e) => this.props.onItemClick('test:' + Math.random())}>
                This the Footer
            </nav>
        )
    }
}

export const Footer = connect(mapStateToProps, mapDispatchToProps)(FooterView);