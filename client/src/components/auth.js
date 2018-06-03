/* eslint class-methods-use-this: 0 */
import decode from 'jwt-decode';
import axios from 'axios';

class Auth {
  login = user => axios.post('/login', {
    email: user.email,
    password: user.password,
  })
    .then((res) => {
      this.setToken(res.data.token);
    })
    .catch((err) => {
      console.log(err.response);
    })

  loggedIn = () => {
    const token = this.getToken();
    return !!token;
  }

  setToken = token => localStorage.setItem('audit_token', token);

  getToken = () => localStorage.getItem('audit_token');

  logout = () => localStorage.removeItem('audit_token');

  getTokenInfo = () => decode(this.getToken());
}

export default Auth;
