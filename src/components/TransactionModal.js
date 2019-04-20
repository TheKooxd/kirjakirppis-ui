import React, { Component } from "react";
import { Alert, Modal, InputGroup, Button, FormControl } from "react-bootstrap";

class TransactionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      price: undefined,
    };
    this.buy = this.buy.bind(this);
    this.bid = this.bid.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
      this.setState({bid: e.target.value})
  }

  buy(e) {
    fetch(`http://localhost:3000/sellNotice/${this.props.data.id}/buy`, {
      credentials: "include",
      method: "POST"
    })
      .then(() => this.props.updateList())
      .catch(() => this.setState({ error: true }));
  }

  bid() {
    const bid = this.state.bid
    fetch(`http://localhost:3000/sellNotice/${this.props.data.id}/bid`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ bid })
    })
      .then(() => null)
      .catch(() => this.setState({ error: true }));
  }

  render() {
    return (
      <Modal
        {...this.props}
        onHide={this.props.switchModal}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {this.props.mode === "buy"
              ? "Osta hintaan " +
                this.props.data.price.toString().replace(".", ",") +
                "€"
              : "Tarjoa kirjasta"}{" "}
            {this.props.data.book.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.error && (
            <Alert variant={"danger"}>Virhe tallentaessa!</Alert>
          )}
          {this.props.mode === "buy" ? (
            <Button onClick={this.buy} size="lg" variant="success">
              OSTA
            </Button>
          ) : (
            <div>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Tarjoamasi summa (0.00)"
                  type="number"
                  value={this.state.bid}
                  onChange={this.handleChange}
                />
                <InputGroup.Append>
                  <InputGroup.Text>€</InputGroup.Text>
                  <Button variant="danger" onClick={this.bid}>TARJOA</Button>
                </InputGroup.Append>
              </InputGroup>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <small>
            Klikkaamalla yllä olevaa nappia sitoudut ostamaan tai maksamaan
            tarjoamasi summan kirjan/kirjasta {this.props.data.book.name}. Sinun
            yhteystietosi luovutetaan myyjälle ({this.props.data.seller.name}),
            jotta voitte keskenänne hoitaa myynnin loppuun. Ohjelmiston
            kehittäjät tahi ylläpitäjät eivät ota vastuuta tästä eteenpäin.
          </small>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default TransactionModal;
