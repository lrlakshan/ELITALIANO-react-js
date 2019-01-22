import React from "react";
import PropTypes from "prop-types";
import LoadingOverlay from 'react-loading-overlay';

import Helper from "../utils/Helper";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

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

//images
import bgImage from "../assets/img/register.jpeg";

import loginPageStyle from "../assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

class login extends React.Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            cardAnimaton: "cardHidden",
            username: '',
            password: '',
            loading: false
        };
    }

    handleSubmit = e => {
        this.setState({ loading: true });
        e.preventDefault();
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
                    console.log("---success---", response, JSON.parse(localStorage.getItem('user')));

                } else {
                    console.log("---res data---", response);
                }
            })
            .catch(exception => {
            });
        console.log('this is submit', this.state.username);
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
    render() {
        const { classes } = this.props;
        return (
            <div>
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
                                                        {[
                                                            "fab fa-facebook-square",
                                                            "fab fa-twitter",
                                                            "fab fa-google-plus"
                                                        ].map((prop, key) => {
                                                            return (
                                                                <Button
                                                                    color="transparent"
                                                                    justIcon
                                                                    key={key}
                                                                    className={classes.customButtonClass}
                                                                >
                                                                    <i className={prop} />
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>
                                                </CardHeader>
                                                <CardBody>
                                                    <CustomInput
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
                                                            )
                                                        }}
                                                        onChange={(event) => this.setState({ username: event.target.value })} />
                                                    <CustomInput
                                                        labelText="Password"
                                                        id="password"
                                                        type="password"
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <LockOutline className={classes.inputAdornmentIcon} />
                                                                </InputAdornment>
                                                            )
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
