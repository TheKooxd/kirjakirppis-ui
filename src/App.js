import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Navbar, Nav, Spinner } from "react-bootstrap";
import Login from "./components/Login";
import BookList from "./components/BookList";
import NewListing from "./components/NewListing";
import MyListings from "./components/MyListings";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      email: undefined,
      id: "loading",
      phone: undefined,
      snapchat: undefined
    };
    this.setInfo = this.setInfo.bind(this);
  }

  setInfo(info) {
    this.setState({
      ...info
    });
  }

  componentDidMount() {
    fetch(`http://localhost:3000/me`, {
      credentials: "include"
    })
      .then(response => response.json())
      .then(resJson => this.setState({ ...resJson }))
      .catch(() => this.setState({ id: "error" }));
  }

  render() {
    return (
      <div>
        {this.state.id !== "loading" ? (
          <div className="App">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
              <Navbar.Brand href="/">KirjaKirppis</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="/">Listaus</Nav.Link>
                  <Nav.Link href="/new">Uusi listaus</Nav.Link>
                  <Nav.Link href="/mylistings">Omat listaukset</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link href="koira">Kirjaudu ulos</Nav.Link>
                  <Nav.Link
                    style={{ color: "white" }}
                    eventKey={2}
                    href="#user"
                  >
                    {this.state.name}
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <div className="container">
              {this.state.name ? (
                <Router>
                  <Route exact path="/" component={BookList} />
                  <Route exact path="/new" component={NewListing} />
                  <Route exact path="/mylistings" component={MyListings} />
                </Router>
              ) : (
                <Login show={true} setInfo={this.setInfo} />
              )}
            </div>
          </div>
        ) : (
          <Spinner animation="grow" variant="info" />
        )}
      </div>
    );
  }
}

export default App;
