import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Grid, Button } from '@material-ui/core/';

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
    formErrors: {
      email: false,
      password: false,
    },
  };

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

    // submit to /login
    axios.post('/login', { user })
      .then(res => console.log(res.data))
      // errors from api will appear here in err.response
      .catch(err => console.log(err.response));
    // reset form state
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container justify="center" alignItems="center" className={classes.boxHeight}>
          <Grid item xs={8} sm={6} md={3}>
            <form name="login" className={classes.form}>
              <TextField
                autoFocus
                id="email"
                label="Email"
                type="email"
                error={this.state.formErrors.email}
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
                error={this.state.formErrors.password}
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
};

export default withStyles(styles)(LoginPage);
