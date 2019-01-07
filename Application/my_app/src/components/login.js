import React, { Component } from 'react';
import { Router } from 'react-router-dom';

import history from '../utils/history';
import Helper from "../utils/Helper";

import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        Helper.http
            .formPost("api/authnz", {
                username: this.state.username,
                password: this.state.password
            })
            .then(response => {
                if (response.success) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    //this.props.history.push('/main/apps');
                    console.log("---success---", response, JSON.parse(localStorage.getItem('user')));

                } else {
                    console.log("---res data---", response);
                }
            })
            .catch(exception => {
                this.setState({
                    error: "Username or password incorrect"
                });
            });
        console.log('this is submit', this.state.username);
    };

    render() {
        const { classes } = this.props;

        return (
            <Router history={history}>
                <main className={classes.main}>
                    <CssBaseline />
                    <Paper className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
        </Typography>
                        <form
                            className={classes.form}
                            onSubmit={this.handleSubmit}
                        >
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Email Address</InputLabel>
                                <Input id="email" name="email" autoComplete="email" autoFocus
                                    onChange={(event) => this.setState({ username: event.target.value })} />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input name="password" type="password" id="password" autoComplete="current-password"
                                    onChange={(event) => this.setState({ password: event.target.value })} />
                            </FormControl>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                //type="submit"
                                onClick={this.handleSubmit}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign in
          </Button>
                        </form>
                    </Paper>
                </main>
            </Router>
        );
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(login);