import React, { Component, useState ,handleShow} from "react";
import {
  Container,
  Button,
  Col,
  Row,
  Table,
  Modal,
  Form,
} from "react-bootstrap";
import { checkCookie, checkUser,checkConfirmed } from "../Authentication/cookies";
import axios from "axios";

const url = process.env.REACT_APP_SERVICE_URL;


function Movies(props) {
  const [show, setShow] = useState(false);
  const [fav, setFav] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  console.log(props.movies);
  
  const handleChange=async() => {
    this.setState({ handleChange: temp });
  };

  const handleClick=async() =>  {
    if (role === 'confirm'){
      axios
      .post(url + "/auth/confirm_role", {
        username: user.username,
      })
      .then((response) => {
        console.log("User confirmed");
      });
    }
    this.fetchMovieList();
  }


  return (
    <tr><td><Button variant="light" onClick={handleShow}>
        {props.movies.title}
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Title</Modal.Title>
        </Modal.Header>
        <Modal.Body><Form.Control
            type="text"
            name={props.movies.title}
            placeholder={props.movies.title}
            onChange={handleChange}
          /></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleClick}onClick={handleClose}>
              add
          </Button>
        </Modal.Footer>
      </Modal></td>
      <td><Button variant="light" onClick={handleShow}>
      {props.movies.startDate}
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Starting dates</Modal.Title>
        </Modal.Header>
        <Modal.Body><Form.Control
            type="text"
            name={props.movies.startDate}
            placeholder={props.movies.startDate}
          /></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleClick}onClick={handleClose}>
              add
          </Button>
        </Modal.Footer>
      </Modal></td>
      <td><Button variant="light" onClick={handleShow}>
      {props.movies.endDate}
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Ending dates</Modal.Title>
        </Modal.Header>
        <Modal.Body><Form.Control
            type="text"
            name={props.movies.endDate}
            placeholder={props.movies.endDate}
          /></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleClick}onClick={handleClose}>
              add
          </Button>
        </Modal.Footer>
      </Modal></td>
      <td><Button variant="light" onClick={handleShow}>
        {props.movies.category}
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change category</Modal.Title>
        </Modal.Header>
        <Modal.Body><Form.Control
            type="text"
            name={props.movies.category}
            placeholder={props.movies.category}
            onChange={handleChange}
          /></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleClick}onClick={handleClose}>
            Change
          </Button>
        </Modal.Footer>
      </Modal></td>
    </tr>
  );
}

class EditMovies extends Component {
  constructor() {
    super();
    this.state = {
      username: checkCookie(),
      user_role: checkUser(),
      confirmed: checkConfirmed(),
      handleChange:"",
      movie_list: [],
      movie_fetched: false,
      temporary:"",
    };
    this.setState = this.setState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  fetchMovieList() {
    axios.post(url + "/dbmaster/getownermovies",{
      username: this.state.username,
    }).then((response) => {
      const movie_list = response.data.movies;
      console.log("movie_list fetched");
      this.setState({ movie_list: movie_list, movie_fetched: true });
    });
  }

  // handleChange(temp) {
  //   this.setState({ handleChange: temp });
  // }

  // handleClick(user) {
  //   if (role === 'confirm'){
  //     axios
  //     .post(url + "/auth/confirm_role", {
  //       username: user.username,
  //     })
  //     .then((response) => {
  //       console.log("User confirmed");
  //     });
  //   }
  //   this.fetchMovieList();
  // }

  render() {
    return (
      <Container bsPrefix="my-container">
        {this.state.movie_fetched ? null : this.fetchMovieList()}
        <Row className="justify-content-md-center">
          <h4>
            Here you can edit the movies by clicking on them !
          </h4>
        </Row>
        <Row>
          <Table responsive striped bordered hover>
            <tbody>
              {this.state.movie_list.map((movies, index) => (
                <Movies
                  key={index}
                  movies={movies}
                  onClickSubmit={() => this.handleClick()}
                  handleChange={() => this.handleChange()}
                />
              ))}
            </tbody>
          </Table>
        </Row>
        <Row className="justify-content-md-right">
          <Col md="auto">
            <Button className="dashboard" href="./dashboard">
              Go Back
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default EditMovies;
