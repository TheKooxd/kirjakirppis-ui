import React, { Component } from "react";
import {
  Modal,
  Row,
  Container,
  Button,
  Col,
  InputGroup,
  FormControl,
  Alert,
  Spinner
} from "react-bootstrap";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: false,
      loading: false
    };
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  login(e) {
    this.setState({ loading: true });
    fetch(
      `http://localhost:3000/login?username=${this.state.username}&password=${
        this.state.password
      }`,
      {
        credentials: "include"
      }
    )
      .then(response => response.json())
      .then(resJson => this.props.setInfo(resJson))
      .catch(() => this.setState({ error: true, loading: false }));
  }

  handleChange(e) {
    e.persist();
    this.setState(state => {
      state[e.target.id] = e.target.value;
      return state;
    });
  }

  render() {
    return (
      <Modal {...this.props} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Kirjaudu sisään o365-tunnuksilla
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {this.state.error && (
              <Alert variant={"danger"}>Virhe kirjautuessa sisään!</Alert>
            )}
            <Row className="show-grid">
              <Col xs={12} md={12}>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Sähköposti"
                    aria-label="Sähköposti"
                    aria-describedby="basic-addon2"
                    value={this.state.username}
                    id="username"
                    onChange={this.handleChange}
                  />
                  <InputGroup.Append />
                </InputGroup>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Salasana"
                    aria-label="Salasana"
                    aria-describedby="basic-addon2"
                    type="password"
                    value={this.state.password}
                    id="password"
                    onChange={this.handleChange}
                  />
                  <InputGroup.Append />
                </InputGroup>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {!this.state.loading ? (
            <Button onClick={this.login}>Login</Button>
          ) : (
            <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Login
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Login;
