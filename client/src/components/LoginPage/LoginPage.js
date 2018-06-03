import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Grid, Button, LinearProgress } from '@material-ui/core/';
import Auth from '../auth';

const auth = new Auth();

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    background: '#e6e6e6',
  },
  button: {
    marginTop: theme.spacing.unit * 2,
  },
  form: {
    padding: theme.spacing.unit * 3,
    background: 'white',
    borderRadius: '2px',
  },
  boxHeight: {
    height: '80vh',
  },
});

class LoginPage extends Component {
  state = {
    email: '',
    password: '',
    loading: false,
    emailError: false,
    passwordError: false,
  };

  componentDidMount = () => {
    if (auth.loggedIn()) {
      this.props.history.replace('/dashboard');
    }
  }

  handleFormChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    // TODO: validate fields before submitting
    if (!user.email || !user.password) {
      return this.setState({
        emailError: !user.email,
        passwordError: !user.password,
      });
    }

    this.setState({ loading: true });

    return auth.login(user)
      .then(res => this.props.history.replace('/dashboard'))
      .catch(err => console.log(err));
    // reset form state
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container justify="center" alignItems="center" className={classes.boxHeight}>
          <Grid item xs={8} sm={6} md={3}>
            <LinearProgress style={{ visibility: this.state.loading ? 'visible' : 'hidden' }} />
            <form name="login" className={classes.form}>
              <TextField
                autoFocus
                id="email"
                label="Email"
                type="email"
                error={this.state.emailError}
                value={this.state.email}
                onChange={this.handleFormChange}
                margin="normal"
                fullWidth
              />
              <br />
              <TextField
                id="password"
                label="Password"
                type="password"
                error={this.state.passwordError}
                value={this.state.password}
                onChange={this.handleFormChange}
                margin="normal"
                fullWidth
              />
              <br />
              <Button className={classes.button} fullWidth variant="raised" color="primary" type="submit" onClick={e => this.handleSubmit(e)}>
                Login
              </Button>
            </form>
          </Grid>
        </Grid>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default withStyles(styles)(LoginPage);
