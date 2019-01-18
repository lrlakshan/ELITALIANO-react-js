import React from 'react';

class Dashboard extends React.Component {

    doLogout = e => {

        localStorage.clear();
        this.props.history.push('/');

    }

    render() {
        return (
            <div>
                This is Dashboard
                <button onClick={this.doLogout}>out</button>
            </div>
        );
    }
}

export default Dashboard;