import React, { Component } from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import HomePage from './HomePage';
import PlayPage from './PlayPage';


//Navigator page where the routes are set
class AppNav extends Component {

   render() {
      return (
         <BrowserRouter >
            <Switch>
               <Route exact path="/" component={HomePage} />
               <Route path='/play' component={PlayPage} />
            </Switch>
         </BrowserRouter>
      )
   }
}


export default AppNav;