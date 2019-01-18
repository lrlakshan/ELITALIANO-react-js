import React, { Component } from 'react';
import { Router } from 'react-router-dom';

import history from '../utils/history';
import { connect } from 'react-redux';

class testFunction extends Component {

    render() {
        return (
            <div>
                <div>Age: <span>{this.props.age}</span></div>
                <button onClick={this.props.onAgeUP}>Age Up</button>
                <button onClick={this.props.onAgeDown}>Age Down</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        age: state.age
    }
};

const mapDispachToProps = (dispach) => {
    return {
        onAgeUP: () => dispach({ type: 'AGE_UP' }),
        onAgeDown: () => dispach({ type: 'AGE_DOWN' })
    }
};

export default connect(mapStateToProps, mapDispachToProps)(testFunction);

