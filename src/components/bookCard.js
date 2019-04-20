import React, { Component } from "react";
import moment from "moment";
import _ from "lodash";
import { Card, Badge, Button } from "react-bootstrap";
import TransactionModal from "./TransactionModal";

class BookCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      mode: undefined
    };
    this.switchModal = this.switchModal.bind(this);
    this.updateList = this.updateList.bind(this);
  }

  switchModal(mode) {
    this.setState({
      modalOpen: !this.state.modalOpen,
      mode
    });
  }

  updateList() {
    this.switchModal();
    this.props.updateList(this.props.index);
  }

  getHighestBid(props) {
    if (props.data.offers) {
      const offers = props.data.offers.map(val => val.offer);
      return (
        <Badge
          style={{ marginLeft: "10px" }}
          className="float-left"
          variant="danger"
        >
          {_.max(offers)
            .toString()
            .replace(".", ",")}
          €
        </Badge>
      );
    }
    return null;
  }

  render() {
    return (
      <Card className="card">
        <TransactionModal
          show={this.state.modalOpen}
          data={this.props.data}
          switchModal={this.switchModal}
          mode={this.state.mode}
          updateList={this.updateList}
        />
        <Card.Body>
          <Card.Title style={{ marginLeft: "20px" }} className="text-left">
            {" "}
            <br />
            <div
              className="float-right"
              style={{
                display: "inline-block",
                height: "100px",
                width: "100px"
              }}
            >
              <Button
                size="lg"
                width="500px"
                style={{ margin: "auto" }}
                variant="outline-success"
                onClick={() => this.switchModal("buy")}
              >
                Osta
              </Button>
              <br />
              {this.props.data.allowoffers && (
                <Button
                  size="lg"
                  style={{ margin: "10px auto" }}
                  variant="outline-danger"
                  onClick={() => this.switchModal("bid")}
                >
                  Tarjoa
                </Button>
              )}
            </div>
            <h3 style={{ marginBottom: "0" }}>{this.props.data.book.name}</h3>
            <small className="text-muted">
              {_.startCase(this.props.data.seller.name.replace(".", " "))}
            </small>
          </Card.Title>
          <h5>
            <Badge
              style={{ marginLeft: "20px" }}
              className="float-left"
              variant="success"
            >
              {" "}
              {this.props.data.price.toString().replace(".", ",")}€{" "}
            </Badge>{" "}
            <this.getHighestBid data={this.props.data} />
            <br />
          </h5>
          <p />
          <Card.Text>
            <small className="text-muted">
              {this.props.data.id} <br />
              {moment.unix(this.props.data.opened).format("HH:mm - DD/MM/YYYY")}
            </small>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default BookCard;
