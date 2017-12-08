import * as React from "react";

export class MasterAppView extends React.Component<{}, {}> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('componentDidMount');
    }

    render() {
        return (
            <div>
                This is it!
            </div>
        )
    }
}

export const MasterApp = MasterAppView;