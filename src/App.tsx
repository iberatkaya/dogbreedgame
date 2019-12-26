import React, { Component } from 'react';
import './App.css';
import AppNav from './AppNav';
import {store} from './Reducers';
import { Provider } from 'react-redux'

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <AppNav/>
      </Provider>
    );
  }
}

export default App;
