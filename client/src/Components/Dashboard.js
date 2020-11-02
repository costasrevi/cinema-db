import React, { Component } from "react";
import { Container, Button, Col, Row, Table } from "react-bootstrap";
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
    };
    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    axios.get(url + "/dbmaster/getmovies").then((response) => {
      const movie_list = response.data.movies;
      console.log("movie_list fetched");
      this.setState({ movie_list });
    });
  }

  renderAdmin() {
    if (this.state.user_role === "admin" && this.state.confirmed===true) {
      return (
        <Col md="auto">
          <Button className="dashboard" href="./admin">
            Admin Panel
          </Button>
        </Col>
      );
    }
    if (this.state.user_role === "cinema_owner" && this.state.confirmed===true) {
      return (
        <Col md="auto">
          <Button className="dashboard" href="./addMovie">
            Add Movie
          </Button>
        </Col>
      );
    }

  }

  // rendercinemaowner() {
  //   if (this.state.user_role === "admin" || this.state.user_role === "cinemaowner") {
  //     return (
  //       <Col md="auto">
  //         <Button className="dashboard" href="./addMovie">
  //           Add Movie
  //         </Button>
  //       </Col>
  //     );
  //   }
  // }
  // handleClick(movies) {
  //   axios.get(url + "/dbmaster/changeFav").then((response) => {
  //     const movie_list = response.data.movies;
  //     console.log("movie changed fav");
  //     this.setState({ movie_list });
  //   });
  //   axios.get(url + "/dbmaster/getmovies").then((response) => {
  //     const movie_list = response.data.movies;
  //     console.log("movie_list fetched");
  //     this.setState({ movie_list });
  //   });
  // }

  render() {
    return (
      <Container bsPrefix="my-container">
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
        <Row className="justify-content-md-center">
          <Table responsive>
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
        <Row className="justify-content-md-center">
          {this.renderAdmin()}
          <Col md="auto">
            <Button className="dashboard" href="./logout">
              Logout
            </Button>
          </Col>
          <Col md="auto">
            <Button className="dashboard" href="./editmovies">
              Logout
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DashboardPage;
