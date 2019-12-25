import React, { Component } from 'react';

class HomePage extends Component<{}, {}> {


   render() {
      return (
         <div className="App">
            <h2>Welcome to The Dog Breed Game!</h2>
            <a href="/play">Click to start playing!</a>
         </div>
      );
   }
}

export default HomePage;
