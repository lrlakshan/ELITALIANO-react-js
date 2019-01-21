import React from 'react';
import Loading from "../../assets/img/loading.gif";


class CustomCircularProgress extends React.Component {
    render() {
        return (
            <div>
                <img style={{ opacity: 1 }} src={Loading} />
            </div>
        );
    }
}

export default (CustomCircularProgress);