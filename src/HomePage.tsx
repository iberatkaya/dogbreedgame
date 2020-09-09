import React, { Component } from "react";

class HomePage extends Component<{}, {}> {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="cover-container d-flex h-100 mx-auto flex-column">
          <main role="main" className="inner cover">
            <h2 className="cover-heading">Welcome to The Dog Breed Game!</h2>
            <p className="lead">
              The Dog Breed Game is a guessing game where you guess the image of
              the dog brand.
            </p>
            <p className="lead">
              <a href="#/play" className="btn btn-lg btn-outline-success">
                Click to start playing!
              </a>
            </p>
          </main>
        </div>
      </div>
    );
  }
}

export default HomePage;
