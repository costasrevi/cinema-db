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
        username:getCookie("username"),
      }).then((response) => {
        console.log("added to fav  success");
      },(error) => {console.log("added to fav fail");});
    }else{

      props.movies.favorite=false;
      console.log("props.movies.movie_id",props.movies.movie_id);
      axios.post(url + "/dbmaster/removeFav",{
        movie_id:props.movies.movie_id,
        username:getCookie("username"),
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
      username: getCookie("username"),
      // auth: true,
      user_role: getCookie("role"),
      startDate:"",
      endDate:"",
      movie_list: [],
      data_info:"",
      button1:true,
      moviesfetch:false,
      temp:false,
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

  // handleSocket(event) {

  //   console.log("socket connect and joinned room");
  //   var that = this;
  //   socket.on('message', function(data_info) {
  //     alert(this.state.data_info);
  //     console.log("socket on emsasas");
  //     // that.setState({trash:true,data_info:data_info})
  //   });
  //   // setTimeout(() => {
  //   // if (this.state.trash===true){
  //     // alert(this.state.data_info);
  //   //   this.setState({trash:false})
  //   // }
  // // }, 20);
  // } 

  componentDidMount() {
      // t
    if (getCookie("username")!==null){
      this.setState({username:getCookie("username"),user_role:getCookie("role")})
      console.log("movie_list fetcheasdggvcarsdcd",getCookie("username"),getCookie("role"));
      if (!this.state.moviesfetch){
        axios.post(url + "/dbmaster/getmovies",{username:getCookie("username")}).then((response) => {
          const movie_list = response.data.movies;
          console.log("movie_list fetched");
          this.setState({ movie_list ,moviesfetch:true});
        });
      }
      if (getCookie("role")=== "Cinemaowner" ) {
        this.setState({ button1:false });
      }
      if (getCookie("role") === "Admin" ) {
        this.setState({ button2:false });
      }
    }
  }

  handleChecked(){
    if (this.state.checked2===true && this.state.username){
      console.log("this.state.username",this.state.username)
      this.setState({ checked2:false });
      axios.post(url + "/dbmaster/getmovies",{username:getCookie("username")}).then((response) => {
        const movie_list = response.data.movies;
        console.log("movie_list fetched");
        this.setState({ movie_list });
      });
    }else {
      this.setState({ checked2:true});
      axios.post(url + "/dbmaster/getFav",{username:getCookie("username")}).then((response) => {
        const movie_list = response.data.movies;
        console.log("movie_list fetched");
        this.setState({ movie_list});
      }, (error) => {
        alert("No favorites movies yet");
      });
    }
  }

  render() {
    console.log("getCookie(token)11", getCookie("token"));
    // this.handleSocket();
    if (getCookie("role").length<5){
      alert("access denied");
      console.log("getCookie(token222)", getCookie("token"));
      return(<Redirect to="/login"/>)}
    else{
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
