import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';


class NavBar extends Component {

    render() {
        return (
                <Navbar style={{ backgroundColor: 'rgb(240, 240, 255)', justifyContent: 'center' }} fixed="top">
                    <Navbar.Brand>
                        <Link to="/">
                            <h5 style={{color: '#666'}}>Dog Breed Game</h5>
                        </Link>
                    </Navbar.Brand>
                </Navbar>
        );
    }
}


export default NavBar;