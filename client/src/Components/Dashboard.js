import React, { Component } from "react";
import { Container, Button,Navbar,Nav,Form,FormControl, Col, Row, Table } from "react-bootstrap";
import { checkCookie, checkUser ,checkConfirmed} from "../Authentication/cookies";
import axios from "axios";

const url = process.env.REACT_APP_SERVICE_URL;

function Movies(props) {
  console.log(props.movies);
  return (
    <tr>
      <td>{props.movies.title}</td>
      <td>{props.movies.startDate}</td>
      <td>{props.movies.endDate}</td>
      <td>{props.movies.cinema}</td>
      <td>{props.movies.category}</td>
      {/* <td><Button onClick={props.onClickcFav}>add Favorite</Button></td> */}
    </tr>
  );
}


class DashboardPage extends Component {
  constructor() {
    super();
    this.state = {
      username: checkCookie(),
      user_role: checkUser(),
      confirmed: checkConfirmed(),
      movie_list: [],
      button1:true,
      button2:true,
    };
    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    axios.get(url + "/dbmaster/getmovies").then((response) => {
      const movie_list = response.data.movies;
      console.log("movie_list fetched");
      this.setState({ movie_list });
    });
    if (this.state.user_role === "cinema_owner" && this.state.confirmed===true) {
      this.setState({ button1:false });
    }
    if (this.state.user_role === "admin" && this.state.confirmed===true) {
      this.setState({ button2:false });
    }
  }

  render() {
    return (
      <Container >      
      <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Upcoming Movies</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="./dashboard">Home</Nav.Link>
          <Nav.Link disabled={this.state.button1} href="./editmovies">Edit Movies</Nav.Link>
          <Nav.Link disabled={this.state.button2} href="./admin">Admin Panel</Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-info">Search</Button>
          <Nav.Link href="./logout">Log out</Nav.Link>
        </Form>
        </Navbar>
   
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h4>
              Welcome {this.state.username}! Your role is {this.state.user_role}{" "}
            </h4>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h4>
              Upcoming movies!
            </h4>
          </Col>
        </Row>
        {/* <div class="table-wrapper-scroll-y my-custom-scrollbar"> */}
        <Row className="justify-content-md-center">
          <Table class="my-custom-scrollbar" responsive striped bordered hover>
            <thead>
              <tr>
                <th>Movie</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Cinema</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
            {this.state.movie_list.map((movies, index) => (
                 <Movies
                  key={index}
                  // onClickFav={() => this.handleClick(movies)}
                  movies={movies}
                 />
              )
              )}
            </tbody>
          </Table>
        </Row>
        {/* </div> */}
      </Container>
    );
  }
}

export default DashboardPage;
