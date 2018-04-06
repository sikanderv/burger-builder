import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

// import Checkout from './containers/Checkout/Checkout';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
// import Orders from './containers/Orders/Orders';
// import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';

import { connect } from 'react-redux';
import * as actions from './store/actions/index';

import asyncComponent from '../src/hoc/asyncComponent/asyncComponent';

// Lazily load routes/components
const asyncOrderComponent = asyncComponent( () => {
  return import('./containers/Orders/Orders');
}) ;

const asyncCheckoutComponent = asyncComponent( () => {
  return import('./containers/Checkout/Checkout');
}) ;

const asyncAuthComponent = asyncComponent( () => {
  return import('./containers/Auth/Auth');
}) ;

class App extends Component {

  componentDidMount() {
    this.props.onRefreshApp();
  }

  render() {

    
    let routes = (
      <Switch>      
        <Route path="/" exact component={BurgerBuilder} />
        <Route path="/auth" component={asyncAuthComponent} />
        <Redirect to="/"/>        
      </Switch>
    );

    // Guarding routes
    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/checkout" component={asyncCheckoutComponent} />
          <Route path="/orders" component={asyncOrderComponent} />
          <Route path="/auth" component={asyncAuthComponent} />
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/"/>
        </Switch>
      )
    }
    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}


const mapDispatchToProps = dispatch => {
  return {
    onRefreshApp: () => dispatch(actions.setAuthState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
