import React from 'react';
import withAuth from '../withAuth';

const Dashboard = props => (
  <div>
    Welcome {props.name}
  </div>
);

export default withAuth(Dashboard);
