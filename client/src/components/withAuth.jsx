import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Auth from './auth';

function withAuth(AuthComponent) {
  const auth = new Auth();

  class AuthWrapped extends Component {
    state = {
      user: null,
    };

    componentDidMount() {
      if (!auth.loggedIn()) {
        this.props.history.replace('/');
      } else {
        try {
          const user = auth.getTokenInfo();
          this.setState({ user });
        } catch (err) {
          auth.logout();
          this.props.history.replace('/');
        }
      }
    }

    render() {
      if (this.state.user) {
        return (
          <AuthComponent history={this.props.history} {...this.state.user} />
        );
      }
      return null;
    }
  }

  AuthWrapped.propTypes = {
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  return AuthWrapped;
}

export default withAuth;
