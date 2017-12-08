import * as React from "react";
import { connect } from "react-redux";
import exampleAction from "../../redux/actions/index";

interface LinkViewprops extends React.Props<LinkView> {
    onClick: (e: any) => void;
    to: string;
}

interface LinkViewState {

}

const mapStateToProps = (state, ownProps) => {
    console.log('state:', state);
    return state;
}

const mapDispatchToProps = (dispatch) => {
    return {
        onItemClick: (text) => {
            dispatch(exampleAction(text))
        }
    }
}

class LinkView extends React.Component<LinkViewprops, LinkViewState> {
    constructor (props: LinkViewprops) {
        super(props);
    }

    render () {
        const { onClick, to }  = this.props;
        return (
            <a
                href={to}
                onClick={onClick}
            >
                {this.props.children}
            </a>
        )
    }
}

export const Link = connect(mapStateToProps, mapDispatchToProps)(LinkView);