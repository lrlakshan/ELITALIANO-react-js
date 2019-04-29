import React from "react";
import PropTypes from "prop-types";
import LoadingOverlay from 'react-loading-overlay';

import Helper from "../utils/Helper";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import Face from "@material-ui/icons/AccountCircle";
import LockOutline from "@material-ui/icons/Lock";

// core components
import GridContainer from "../components/Grid/GridContainer.jsx";
import GridItem from "../components/Grid/GridItem.jsx";
import CustomInput from "../components/CustomInput/CustomInput.jsx";
import Button from "../components/CustomButtons/Button.jsx";
import Card from "../components/Card/Card.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";
import CardFooter from "../components/Card/CardFooter.jsx";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

//images
import bgImage from "../assets/img/register.jpeg";
import logo from "../assets/img/logo.png";

import loginPageStyle from "../assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

class login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardAnimaton: "cardHidden",
            username: '',
            password: '',
            usernameState: '',
            passwordState: '',
            loading: false,
            alertOpen: false,
        };
    }

    handleSubmit = e => {
        
        e.preventDefault();
        if (this.state.username === "") {
            this.setState({ usernameState: "error" });
        }
        if (this.state.password === "") {
            this.setState({ passwordState: "error" });
        }
        if (this.state.username !== "" && this.state.password !== "") {
            this.setState({ loading: true });
            Helper.http
                .jsonPost("userLogin", {
                    username: this.state.username,
                    password: this.state.password
                })
                .then(response => {
                    if (response.success) {
                        localStorage.setItem('user', JSON.stringify(response.data));
                        this.setState({ loading: false });
                        this.props.history.push('/main/dashboard');
                    }
                })
                .catch(exception => {
                    if(exception === 2002){
                        this.setState({
                            alertOpen: true,
                            alertDiscription: "Please Check your connection",
                        });
                        this.setState({ loading: false });
                    }
                    if (exception === 'unauthorized') {
                        this.setState({
                            alertOpen: true,
                            alertDiscription: "Entered username and password is incorrect. Please check and try again",
                        });
                        this.setState({ loading: false });
                    }
                });
        } 
        
    };

    componentDidMount() {
        this.timeOutFunction = setTimeout(
            function () {
                this.setState({ cardAnimaton: "" });
            }.bind(this),
            700
        );
    }
    componentWillUnmount() {
        clearTimeout(this.timeOutFunction);
        this.timeOutFunction = null;
    }

    //alert dialog box close
    handleClose = () => {
        this.setState({ alertOpen: false });
    };

    // function that verifies if a string has a given length or not
    verifyLength(value, length) {
        if (value.length >= length) {
            return true;
        }
        return false;
    }
    // function that verifies if value contains only numbers
    verifyNumber(value) {
        var numberRex = new RegExp("^[0-9]+$");
        if (numberRex.test(value)) {
            return true;
        }
        return false;
    }

    change(event, stateName, type, stateNameEqualTo, maxValue) {
        switch (type) {
            case "number":
                if (this.verifyNumber(event.target.value)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "usernameLength":
                if (this.verifyLength(event.target.value, stateNameEqualTo)) {
                    this.setState({
                        [stateName + "State"]: "success",
                        username: event.target.value
                    });
                } else {
                    this.setState({
                        [stateName + "State"]: "error",
                        username: event.target.value
                    });
                }
                break;
            case "passwordLength":
                if (this.verifyLength(event.target.value, stateNameEqualTo)) {
                    this.setState({
                        [stateName + "State"]: "success",
                        password: event.target.value
                    });
                } else {
                    this.setState({
                        [stateName + "State"]: "error",
                        password: event.target.value
                    });
                }
                break;
            default:
                break;
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                {/* alert dialog box */}
                <Dialog
                    open={this.state.alertOpen}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Alert"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.state.alertDiscription}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="info" autoFocus simple> Got it! </Button>
                    </DialogActions>
                </Dialog>


                <LoadingOverlay
                    active={this.state.loading}
                    spinner
                    text='Loading...'
                >
                    <div className={classes.wrapper} ref="wrapper">
                        <div
                            className={classes.fullPage}
                            style={{ backgroundImage: "url(" + bgImage + ")" }}
                        >

                            <div className={classes.container}>

                                <GridContainer justify="center">
                                    <GridItem xs={12} sm={6} md={4}>
                                        <form>
                                            <Card login className={classes[this.state.cardAnimaton]}>
                                                <CardHeader
                                                    className={`${classes.cardHeader} ${classes.textCenter}`}
                                                    color="rose"
                                                >
                                                    <h4 className={classes.cardTitle}>Log in</h4>
                                                    <div className={classes.socialLine}>
                                                        <img src={logo} alt = "logo" width="100px"></img>
                                                    </div>
                                                </CardHeader>
                                                <CardBody>
                                                    <CustomInput
                                                        success={this.state.usernameState === "success"}
                                                        error={this.state.usernameState === "error"}
                                                        labelText="Username"
                                                        id="username"
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Face className={classes.inputAdornmentIcon} />
                                                                </InputAdornment>
                                                            ),
                                                            onChange: event =>
                                                                this.change(event, "username", "usernameLength", 1),
                                                            type: "text"
                                                        }}
                                                        onChange={(event) => this.setState({ username: event.target.value })} />
                                                    <CustomInput
                                                        success={this.state.passwordState === "success"}
                                                        error={this.state.passwordState === "error"}
                                                        labelText="Password"
                                                        id="password"
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <LockOutline className={classes.inputAdornmentIcon} />
                                                                </InputAdornment>
                                                            ),
                                                            onChange: event =>
                                                                this.change(event, "password", "passwordLength", 1),
                                                            type: "password"
                                                        }}
                                                        onChange={(event) => this.setState({ password: event.target.value })} />
                                                </CardBody>
                                                <CardFooter className={classes.justifyContentCenter}>
                                                    <Button color="rose" simple size="lg" onClick={this.handleSubmit} >
                                                        Sign In
                                                </Button>
                                                </CardFooter>
                                            </Card>
                                        </form>
                                    </GridItem>
                                </GridContainer>
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>
            </div>
        );
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(loginPageStyle)(login);
