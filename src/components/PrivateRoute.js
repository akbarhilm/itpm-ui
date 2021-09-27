import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { UserContext } from '../utils/UserContext';
import { CircularProgress } from '@material-ui/core';


export default function PrivateRoute(props) {
  const { user, isLoading } = useContext(UserContext);

  const {
    component: Component,
    ...rest
  } = props;

  if (isLoading) {
    return <CircularProgress />;
  }

  if (user) {
    // return (<Route {...rest} render={(props) => (<Component {...props} />)} />);
    return (<Route {...rest} />);
  } else {
    return <Redirect to='/401' />;
  }

}
