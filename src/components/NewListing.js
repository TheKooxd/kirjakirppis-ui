import React, { Component } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import fi from "date-fns/locale/fi";
import { Form, Button, Col } from "react-bootstrap";
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";

class NewListing extends Component {
  constructor(props) {
    super(props);
    registerLocale("fi", fi);
    this.state = {
      books: [],
      book: "",
      price: undefined,
      allowoffers: false,
      closes: null,
      markings: false,
      condition: "FN",
      error: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    fetch(`http://localhost:3000/book`, {
      credentials: "include"
    })
      .then(response => response.json())
      .then(resJson => this.setState({ books: resJson, book: resJson[0].id }))
      .catch(() => this.setState({ id: "error" }));
  }

  save() {
    const temp = this.state;
    fetch(`http://localhost:3000/sellNotice`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        price: temp.price,
        closes: moment(this.state.closes).unix(),
        book: temp.book,
        allowOffers: temp.allowoffers,
        condition: temp.condition,
        markings: temp.markings
      })
    })
      .then(() => (window.location = window.location.origin))
      .catch(() => this.setState({ error: true }));
  }

  handleChange(e) {
    if(e.persist) {
        e.persist();
        this.setState(val => {
        if (e.target.id === "allowoffers") {
            val.allowoffers = !val.allowoffers;
        }
        if (e.target.id === "markings") {
            val.markings = !val.markings;
        }
        if (e.target.id !== "markings" && e.target.id !== "allowoffers") {
            val[e.target.id] = e.target.value;
        }
        return val;
        });
    } else {
        this.setState({closes: e})
    }
  }

  render() {
    return (
      <div className="newNoticeContainer">
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Kirja</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                value={this.state.book}
                as="select"
                id="book"
              >
                {this.state.books.map(val => (
                  <option value={val.id} key={val.id}>
                    {val.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Hinta (x.xx)</Form.Label>
              <Form.Control
                type="number"
                onChange={this.handleChange}
                value={this.state.price}
                placeholder="Hinta"
                id="price"
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Kunto</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                value={this.state.condition}
                as="select"
                id="condition"
              >
                <option value="FN">Uusi</option>
                <option value="MW">Uudenveroinen</option>
                <option value="FT">Sisäänajettu</option>
                <option value="BS">Elämää nähnyt</option>
                <option value="WW">Viimeisiä vetelee</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Ilmoituksen sulkemisajankohta</Form.Label>
              <br />
              <DatePicker
                locale='fi'
                selected={this.state.closes}
                onChange={this.handleChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="d.MM.yyyy HH:mm"
                timeCaption="time"
                id='closes'
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Check
                id="markings"
                onChange={this.handleChange}
                checked={this.state.markings}
                label="Kirjassani on merkintöjä"
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Check
                id="allowoffers"
                onChange={this.handleChange}
                checked={this.state.allowoffers}
                label="Mahdollista huutokauppaus"
              />
            </Form.Group>
          </Form.Row>

          <Button variant="outline-primary" onClick={this.save}>
            Laita myyntiin
          </Button>
        </Form>
      </div>
    );
  }
}

export default NewListing;
