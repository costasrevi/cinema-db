import React, { Component ,useState} from "react";
import { Container,ToggleButton, Button,Navbar,Nav,Form,FormControl, Col, Row, Table } from "react-bootstrap";
import { checkCookie, checkUser ,checkConfirmed} from "../Authentication/cookies";
import axios from "axios";

const url = process.env.REACT_APP_SERVICE_URL;

function Movies(props) {
  const [checked, setChecked] = useState(false);
  const [check, setCheck] = useState();
  console.log(props.movies);
  
  const handleCheck = (check) => {
  if (check){
    setChecked(true);
    console.log("props.movies.movie_id",props.movies.movie_id);
    axios.post(url + "/dbmaster/addtoFav",{
      movie_id:props.movies.movie_id,
      username:checkCookie(),
    }).then((response) => {
      console.log("added to fav  success");
    },(error) => {console.log("added to fav fail");});
  }else{
    setChecked(false);
    console.log("props.movies.movie_id",props.movies.movie_id);
    axios.post(url + "/dbmaster/removeFav",{
      movie_id:props.movies.movie_id,
      username:checkCookie(),
    }).then((response) => {
      console.log("remove to fav  success");
    },(error) => {console.log("remove to fav  fail");});
  }
};
  return (
    <tr>
      <td>{props.movies.title}</td>
      <td>{props.movies.startDate}</td>
      <td>{props.movies.endDate}</td>
      <td>{props.movies.cinema}</td>
      <td>{props.movies.category}</td>
      <td><ToggleButton
          type="checkbox"
          variant="secondary"
          checked={props.movies.favorite}
          value="1"
          onChange={(e) => handleCheck(e.currentTarget.checked)}>
          {check}
        </ToggleButton></td>
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
      startDate:"",
      endDate:"",
      movie_list: [],
      button1:true,
      checked:false,
      button2:true,
    };
    this.setState = this.setState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.searchEndDate = this.searchEndDate.bind(this);
    this.searchStartDate = this.searchStartDate.bind(this);
    this.handleChecked =this.handleChecked.bind(this);
    // this.handleChange2 = this.handleChange2.bind(this);
  }

  handleChange(event) {
    axios.post(url + "/dbmaster/getspecmovies", {search:event.target.value}).then((response) => {
      const movie_list = response.data.movies;
      console.log("movie_list fetched");
      this.setState({ movie_list });
    }, (error) => {
      console.log("Gamemaster/GetScores - Axios Error.");
    });
  }

  searchEndDate(event) {
    axios.post(url + "/dbmaster/getspecmovies", {search:event.target.value}).then((response) => {
      const movie_list = response.data.movies;
      console.log("movie_list fetched");
      this.setState({ movie_list });
    }, (error) => {
      console.log("Gamemaster/GetScores - Axios Error.");
    });
  }

  searchStartDate(event) {
    axios.post(url + "/dbmaster/getspecmovies", {search:event.target.value}).then((response) => {
      const movie_list = response.data.movies;
      console.log("movie_list fetched");
      this.setState({ movie_list });
    }, (error) => {
      console.log("Gamemaster/GetScores - Axios Error.");
    });
  }

  componentDidMount() {
    axios.post(url + "/dbmaster/getmovies",{username:checkCookie()}).then((response) => {
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

  handleChecked(check){
    if (check){
      this.setState({ checked:false,check:"Not showing Favorites"});
      axios.get(url + "/dbmaster/getmovies",{username:checkCookie()}).then((response) => {
        const movie_list = response.data.movies;
        console.log("movie_list fetched");
        this.setState({ movie_list });
      });
    }else{
      this.setState({ checked:true,check:"Showing Favorites"});
      axios.get(url + "/dbmaster/getFav").then((response) => {
        const movie_list = response.data.movies;
        console.log("movie_list fetched");
        this.setState({ movie_list });
      });
    }
  }



  render() {
    return (
      <Container >      
      <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="./dashboard">Upcoming Movies</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="./dashboard">Home</Nav.Link>
          <Nav.Link disabled={this.state.button1} href="./editmovies">Edit Movies</Nav.Link>
          <Nav.Link disabled={this.state.button2} href="./admin">Admin Panel</Nav.Link>
        </Nav>
        <Form inline>
          <input type="date" ref={this.startDate} ></input>
          <input type="date" ref={this.endDate} ></input>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={this.handleChange} />
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
          <Table responsive="lg" striped bordered hover>
            <thead>
              <tr>
                <th>Movie</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Cinema</th>
                <th>Category</th>
                <th><ToggleButton
                type="checkbox"
                variant="secondary"
                checked={this.checked}
                value="1"
                onChange={(e) => this.handleChecked(e.currentTarget.checked)}>
                Favorites
                </ToggleButton></th>
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
