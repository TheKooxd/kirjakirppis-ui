import React, { Component } from "react";
import moment from "moment";
import _ from "lodash";
import { Spinner, Tabs, Tab, Alert, Table, Button } from "react-bootstrap";

class MyListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: [],
      closedWithoutOffers: [],
      closedWithOffers: [],
      won: [],
      sold: [],
      loading: true
    };
    this.accept = this.accept.bind(this);
  }

  accept(e) {
    e.persist();
    fetch(`http://localhost:3000/sellNotice/${e.target.id}/accept`, {
      credentials: "include"
    })
      .then(() => (window.location = window.location))
      .catch(() => this.setState({ error: true }));
  }

  componentDidMount() {
    fetch(`http://localhost:3000/sellNotice/me`, {
      credentials: "include"
    })
      .then(response => response.json())
      .then(resJson => {
        const closedWithoutOffers = resJson.asSeller.filter(val => {
          return (val.sellnotice.closes < moment().unix() ||
            val.sellnotice.buyer !== null) &&
            !val.sellnotice.offers
            ? true
            : false;
        });
        const closedWithOffers = resJson.asSeller.filter(val => {
          return val.sellnotice.closes < moment().unix() &&
            val.sellnotice.buyer === null &&
            val.sellnotice.offers
            ? true
            : false;
        });
        const open = resJson.asSeller.filter(val => {
          return val.sellnotice.closes > moment().unix() &&
            (val.sellnotice.buyer === null ||
              val.sellnotice.buyer === null)
            ? true
            : false;
        });
        const sold = resJson.asSeller.filter(val => {
          return val.sellnotice.buyer !== null ? true : false;
        });
        this.setState({
          closedWithoutOffers,
          open,
          closedWithOffers,
          won: resJson.asBuyer,
          sold,
          loading: false
        });
      })
      .catch(() => this.setState({ error: true, loading: false }));
  }

  render() {
    if (this.state.loading) {
      return <Spinner animation="grow" variant="info" />;
    }
    return (
      <div>
        {this.state.error && (
          <Alert variant="danger"> Virhe tietoa haettaessa </Alert>
        )}
        <Tabs
          style={{ marginTop: "10px" }}
          defaultActiveKey="open"
          id="uncontrolled-tab-example"
        >
          <Tab
            eventKey="open"
            title={`Myynnissä olevat (${this.state.open.length})`}
          >
            <Table responsive>
              <thead>
                <tr>
                  <th>Kirja</th>
                  <th>Hinta</th>
                  <th>Huutokauppassa</th>
                  <th>Korkein tarjous</th>
                  <th>Avattu</th>
                  <th>Sulkeutuu</th>
                </tr>
              </thead>
              <tbody>
                {this.state.open.map(val => {
                  const row = val.sellnotice;
                  return (
                    <tr>
                      <td>{row.book.name}</td>
                      <td>{row.price}€</td>
                      <td>{row.allowoffers ? "Kyllä" : "Ei"}</td>
                      <td>
                        {row.offers
                          ? _.maxBy(row.offers, "offer").offer + "€"
                          : "-"}
                      </td>
                      <td>
                        {moment.unix(row.opened).format("HH:mm DD.MM.YYYY")}
                      </td>
                      <td>
                        {moment.unix(row.closes).format("HH:mm DD.MM.YYYY")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Tab>
          <Tab
            eventKey="closed"
            title={`Myynnistä poistuneet (${
              this.state.closedWithoutOffers.length
            })`}
          >
            <Table responsive>
              <thead>
                <tr>
                  <th>Kirja</th>
                  <th>Hinta</th>
                  <th>Huutokauppassa</th>
                  <th>Korkein tarjous</th>
                  <th>Avattu</th>
                  <th>Sulkeutunut</th>
                </tr>
              </thead>
              <tbody>
                {this.state.closedWithoutOffers.map(val => {
                  const row = val.sellnotice;
                  return (
                    <tr>
                      <td>{row.book.name}</td>
                      <td>{row.price}€</td>
                      <td>{row.allowoffers ? "Kyllä" : "Ei"}</td>
                      <td>
                        {row.offers
                          ? _.maxBy(row.offers, "offer").offer + "€"
                          : "-"}
                      </td>
                      <td>
                        {moment.unix(row.opened).format("HH:mm DD.MM.YYYY")}
                      </td>
                      <td>
                        {moment.unix(row.closes).format("HH:mm DD.MM.YYYY")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Tab>
          <Tab
            eventKey="unconfirmedOffers"
            title={`Odottavat hyväksyntää (${
              this.state.closedWithOffers.length
            })`}
          >
            <Table responsive>
              <thead>
                <tr>
                  <th>Kirja</th>
                  <th>Hinta</th>
                  <th>Huutokauppassa</th>
                  <th>Korkein tarjous</th>
                  <th>Avattu</th>
                  <th>Sulkeutunut</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.state.closedWithOffers.map(val => {
                  const row = val.sellnotice;
                  return (
                    <tr>
                      <td>{row.book.name}</td>
                      <td>{row.price}€</td>
                      <td>{row.allowoffers ? "Kyllä" : "Ei"}</td>
                      <td>
                        {row.offers
                          ? _.maxBy(row.offers, "offer").offer + "€"
                          : "-"}
                      </td>
                      <td>
                        {moment.unix(row.opened).format("HH:mm DD.MM.YYYY")}
                      </td>
                      <td>
                        {moment.unix(row.closes).format("HH:mm DD.MM.YYYY")}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          id={row.id}
                          variant="success"
                          onClick={this.accept}
                        >
                          Hyväksy
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="won" title={`Ostot/voitot (${this.state.won.length})`}>
            <Table responsive>
              <thead>
                <tr>
                  <th>Kirja</th>
                  <th>Lopullinen hinta</th>
                  <th>Avattu</th>
                  <th>Sulkeutunut</th>
                  <th>Myyjä</th>
                  <th>Myyjän pnumero</th>
                  <th>Myyjän snap</th>
                </tr>
              </thead>
              <tbody>
                {this.state.won.map(val => {
                  const row = val.sellnotice;
                  return (
                    <tr>
                      <td>{row.book.name}</td>
                      <td>{row.finalprice}€</td>
                      <td>
                        {moment.unix(row.opened).format("HH:mm DD.MM.YYYY")}
                      </td>
                      <td>
                        {moment.unix(row.closes).format("HH:mm DD.MM.YYYY")}
                      </td>
                      <td>{row.seller.name}</td>
                      <td>{row.seller.phone}</td>
                      <td>{row.seller.snapchat}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="sold" title={`Myydyt (${this.state.sold.length})`}>
            <Table responsive>
              <thead>
                <tr>
                  <th>Kirja</th>
                  <th>Lopullinen hinta</th>
                  <th>Avattu</th>
                  <th>Sulkeutunut</th>
                  <th>Ostaja</th>
                  <th>Ostajan pnumero</th>
                  <th>Ostajan snap</th>
                </tr>
              </thead>
              <tbody>
                {this.state.sold.map(val => {
                  const row = val.sellnotice;
                  return (
                    <tr>
                      <td>{row.book.name}</td>
                      <td>{row.finalprice}€</td>
                      <td>
                        {moment.unix(row.opened).format("HH:mm DD.MM.YYYY")}
                      </td>
                      <td>
                        {moment.unix(row.closes).format("HH:mm DD.MM.YYYY")}
                      </td>
                      <td>{row.buyer.name}</td>
                      <td>{row.buyer.phone}</td>
                      <td>{row.buyer.snapchat}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default MyListings;
