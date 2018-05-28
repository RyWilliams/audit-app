import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 25,
  },
  textField: {
    width: 300,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    width: 300,
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
      <form className={classes.container} name="login">
        <TextField
          autoFocus
          id="email"
          label="Email"
          type="email"
          error={this.state.formErrors.email}
          className={classes.textField}
          value={this.state.email}
          onChange={this.handleFormChange}
          margin="normal"
        />
        <br />
        <TextField
          id="password"
          label="Password"
          type="password"
          error={this.state.formErrors.password}
          className={classes.textField}
          value={this.state.password}
          onChange={this.handleFormChange}
          margin="normal"
        />
        <br />
        <Button className={classes.button} variant="raised" color="primary" type="submit" onClick={e => this.handleSubmit(e)}>
          Login
        </Button>
      </form>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(LoginPage);
