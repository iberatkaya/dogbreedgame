import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { HighScore } from './Actions';


interface Props{
    highscore: {score: number}
}

class NavBar extends Component<Props, {}> {

    render() {
        return (
            <Navbar style={{ backgroundColor: 'rgb(240, 240, 255)' }} className="justify-content-between pl-4 pr-4" fixed="top">
                <Nav>
                    <Link to="/">
                        <h5 style={{ color: '#666' }}>Dog Breed Game</h5>
                    </Link>
                </Nav>
                <Nav className="">
                    <Navbar.Text>
                        High Score: {this.props.highscore.score}
                    </Navbar.Text>
                </Nav>
            </Navbar>
        );
    }
}


interface StateRedux {
    highscore: HighScore
}

const mapStateToProps = (state: StateRedux) => {
    const { highscore } = state;
    return { highscore };
};

const mapDispatchToProps = (dispatch: any) => (
    bindActionCreators({

    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);