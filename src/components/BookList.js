import React, { Component } from "react";
import BookCard from "./bookCard";
import {
  Spinner,
  Alert
} from "react-bootstrap";

class BookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      loading: true
    };
    this.updateList = this.updateList.bind(this);
  }

  componentDidMount() {
    fetch(`http://localhost:3000/sellNotice`, {
      credentials: "include"
    })
      .then(response => response.json())
      .then(resJson => this.setState({ books: resJson, loading: false }))
      .catch(() => this.setState({ error: true, loading: false }));
  }

  updateList(index) {
    this.setState(prevState => {
      return prevState.books.splice(index, 1);
    });
  }

  render() {
    if (this.state.loading) {
      return <Spinner animation="grow" variant="info" />;
    }
    if(this.state.books.length === 0) {
        return <Alert variant='info'> Markkinoilla ei ole yhtäkään kirjaa myynnissä! </Alert>
    }
    return (
      <div>
        <div className="bookCardContainer">
          {this.state.books.map((val, index) => {
            return (
              <BookCard
                key={index}
                updateList={this.updateList}
                data={val.sellnotice}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default BookList;
