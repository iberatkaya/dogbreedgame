import React, { Component } from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import HomePage from './HomePage';
import PlayPage from './PlayPage';
import NavBar from './NavBar';

//Navigator page where the routes are set
class AppNav extends Component {

   render() {
      return (
         <BrowserRouter>
            <div style={{ paddingBottom: '4.5rem' }}>
               <NavBar />
            </div>
            <Switch>
               <Route exact path="/" component={HomePage} />
               <Route path='/play' component={PlayPage} />
            </Switch>
         </BrowserRouter>
      )
   }
}


export default AppNav;