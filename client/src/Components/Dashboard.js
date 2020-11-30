import React, { Component} from "react";
import { Container,ToggleButton,Navbar,Nav,Form,FormControl, Col, Row, Table } from "react-bootstrap";
import { getCookie } from "../Authentication/cookies";
import { Redirect } from "react-router-dom";
import axios from "axios";

const url = process.env.REACT_APP_SERVICE_URL;

function Movies(props) {
  
  const handleCheck = (check) => {
    if (!check){
      props.movies.favorite=true;
      // console.log("props.movies.movie_id",props.movies.movie_id,check,checkCookie());
      axios.post(url + "/dbmaster/addtoFav",{
        movie_id:props.movies.movie_id,
        username:this.state.username,
      }).then((response) => {
        console.log("added to fav  success");
      },(error) => {console.log("added to fav fail");});
    }else{

      props.movies.favorite=false;
      console.log("props.movies.movie_id",props.movies.movie_id);
      axios.post(url + "/dbmaster/removeFav",{
        movie_id:props.movies.movie_id,
        username:this.state.username,
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
      <td>
        <ToggleButton
          type="checkbox"
          variant="secondary"
          checked={props.movies.favorite}
          value="1"
          onChange={(e) => handleCheck(props.movies.favorite)}>
        </ToggleButton></td>
    </tr>
  );


}


class DashboardPage extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      auth: true,
      user_role: "",
      startDate:"",
      endDate:"",
      movie_list: [],
      button1:true,
      moviesfetch:false,
      search:"",
      checked2:false,
      button2:true,
    };
    this.setState = this.setState.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleChange4 = this.handleChange4.bind(this);
    this.handleChecked =this.handleChecked.bind(this);
  }

  handleChange2(event) {
    this.setState({endDate: event.target.value});
    setTimeout(() => {
      this.handleChange4();
    }, 20);
  }
  handleChange3(event) {
    this.setState({search: event.target.value});
    setTimeout(() => {
      this.handleChange4();
    }, 20);
  }


  handleChange4() {
    if (this.state.checked2){
      axios.post(url + "/dbmaster/getspecmovies", {endDate:this.state.endDate,search:this.state.search,favorite:"True",username:this.state.username}).then((response) => {
      const movie_list = response.data.movies;
      console.log("movie_list fetched");
      this.setState({ movie_list });
    }, (error) => {
      console.log("Gamemaster/GetScores - Axios Error.");
    });
    }else{
      axios.post(url + "/dbmaster/getspecmovies", {endDate:this.state.endDate,search:this.state.search,favorite:"False",username:this.state.username}).then((response) => {
        const movie_list = response.data.movies;
        console.log("movie_list fetched");
        this.setState({ movie_list });
      }, (error) => {
        console.log("Gamemaster/GetScores - Axios Error.");
      });
    }
  }

  componentDidMount() {
    if (this.state.username===""){
      let token = getCookie("token");
      const axios = require('axios');
      axios.get("http://localhost/idm/user?access_token="+token, token).then(
        (response) => {
        console.log("response.data.username",response.data.username);
        this.setState({ username :response.data.username});
        this.setState({ user_role :response.data.organizations['0'].name});
        console.log("this.state.user_role ",this.state.user_role );
        if (this.state.user_role === "Cinemaowner" ) {
          this.setState({ button1:false });
        }
        if (this.state.user_role === "Admin" ) {
          this.setState({ button2:false });
        }
        },
        (error) => {
          console.log("this is create user error:",JSON.stringify(error));
          this.setState({ auth :false});
        }
      );
    }
    if (!this.state.moviesfetch){
      axios.post(url + "/dbmaster/getmovies",{username:this.state.username}).then((response) => {
        const movie_list = response.data.movies;
        console.log("movie_list fetched");
        this.setState({ movie_list ,moviesfetch:true});
      });
    }
  }

  handleChecked(){
    if (this.state.checked2===true && this.state.username){
      console.log("this.state.username",this.state.username)
      this.setState({ checked2:false });
      axios.post(url + "/dbmaster/getmovies",{username:this.state.username}).then((response) => {
        const movie_list = response.data.movies;
        console.log("movie_list fetched");
        this.setState({ movie_list });
      });
    }else {
      this.setState({ checked2:true});
      axios.post(url + "/dbmaster/getFav",{username:this.state.username}).then((response) => {
        const movie_list = response.data.movies;
        console.log("movie_list fetched");
        this.setState({ movie_list});
      }, (error) => {
        alert("No favorites movies yet");
      });
    }
  }

  render() {
    if (!this.state.auth){
      alert("access denied");
      return(<Redirect to="/login"/>)}
    else{
      return (
            <Container >      
            <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="./dashboard">Upcoming Movies</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="./dashboard">Home</Nav.Link>
                <Nav.Link disabled={this.state.button1} href="./editmovies">Edit Movies</Nav.Link>
                <Nav.Link disabled={this.state.button2} href="http://localhost:3001/idm">Admin Panel</Nav.Link>
              </Nav>
              <Form inline>
                <input type="date" value={this.state.endDate} onChange={this.handleChange2}></input>
                <FormControl type="text" placeholder="Search" value={this.state.search} className="mr-sm-2" onChange={this.handleChange3} />
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
                      checked={this.state.checked2}
                      value="1"
                      onChange={(e) => this.handleChecked()}>
                      Favorites
                      </ToggleButton></th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.movie_list.map((movies, index) => (
                      <Movies
                        key={index}
                        movies={movies}
                      />
                    )
                    )}
                  </tbody>
                </Table>
              </Row>
            </Container>
          );
    }
    
  }
}

export default DashboardPage;
