import React, { Component, useState } from "react";
import {
  Container,
  Button,
  Dropdown,
  Row,
  Table,
  Modal,
  Form,Navbar,Nav,FormControl,
} from "react-bootstrap";
import { getCookie} from "../Authentication/cookies";
import axios from "axios";
import { Redirect } from "react-router-dom";

const url = process.env.REACT_APP_SERVICE_URL;


function Movies(props) {

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);

  const [title, settitle] = useState();
  const [endDate, setendDate] = useState();
  const [startDate, setstartDate] = useState();
  const [category, setcategory] = useState();


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => {setShow2(true)};

  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);
// here we have one handle submit for each modal tha calls editmovies to update the movies data
  const handleSubmit = () => {
    axios.post(url + "/dbmaster/editMovie",{
      movie_id:props.movies.movie_id,
      title: title.value,
    },{headers:{'Content-Type': 'application/json','X-Auth-Token':getCookie ('token')}}).then((response) => {
      console.log("editMovie title success");
    },(error) => {console.log("editMovie title fail");});
    props.onfetched();
    handleClose();
  };
  const handleSubmit2 = () => {
    axios.post(url + "/dbmaster/editMovie",{
      movie_id:props.movies.movie_id,
      startDate: startDate.value,
    },{headers:{'Content-Type': 'application/json','X-Auth-Token':getCookie ('token')}}).then((response) => {
      console.log("editMovie startDate success");
    },(error) => {console.log("startDate title fail");});
    props.onfetched();
    handleClose2();
  };
  const handleSubmit3 = () => {
    axios.post(url + "/dbmaster/editMovie",{
      movie_id:props.movies.movie_id,
      endDate: endDate.value,
    },{headers:{'Content-Type': 'application/json','X-Auth-Token':getCookie ('token')}}).then((response) => {
      console.log("editMovie endDate success");
    },(error) => {console.log("editMovie endDate fail");}
    );
    props.onfetched();
    handleClose3();
  };
  const handleSubmit4 = () => {
    axios.post(url + "/dbmaster/editMovie",{
      movie_id:props.movies.movie_id,
      category: category.value,
    },{headers:{'Content-Type': 'application/json','X-Auth-Token':getCookie ('token')}}).then((response) => {
      console.log("editMovie category success");
    });
    props.onfetched();
    handleClose4();
  };

  const DeleteMovie = () => {
    axios.post(url + "/dbmaster/DeleteMovie",{
      movie_id:props.movies.movie_id,
    },{headers:{'Content-Type': 'application/json','X-Auth-Token':getCookie ('token')}}).then((response) => {
      console.log("DeleteMovie category success");
    });
    props.onfetched();
  };
  

  return (
    <tr>
      {/* here we have the button that call the modals bellow */}
    <td><Button data-toggle="modal" data-target="title" onClick={handleShow}variant="outline-dark">
    {props.movies.title}
    </Button></td>
    <td><Button data-toggle="modal" data-target="startDate" onClick={handleShow2}variant="outline-dark">
    {props.movies.startDate}
    </Button></td>
    <td><Button data-toggle="modal" data-target="endDate" onClick={handleShow3}variant="outline-dark">
    {props.movies.endDate}
    </Button></td>
    <td><Button data-toggle="modal" data-target="category"  onClick={handleShow4}variant="outline-dark">
    {props.movies.category}
    </Button></td>
    <td><Button data-toggle="modal" data-target="category"  onClick={DeleteMovie}variant="outline-dark">
    Delete
    </Button></td>
  {/* here are the modal that each one of them handles the change of a category */}
    <Modal id="title" show={show} onHide={() => setShow(false)} aria-labelledby="title">
      <Modal.Header closeButton>
        <Modal.Title>Change title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input placeholder={props.movies.title} ref={title => (settitle(title))}type="text" ></input>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal id="startDate" show={show2} onHide={() => setShow2(false)} aria-labelledby="startDate">
      <Modal.Header closeButton>
        <Modal.Title>Change startDate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input placeholder={props.movies.startDate}type="date" ref={startDate => (setstartDate(startDate))} ></input>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose2}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit2}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal id="endDate"  show={show3} onHide={() => setShow3(false)} aria-labelledby="endDate" role="dialog" aria-hidden="true">
      <Modal.Header closeButton>
        <Modal.Title>Change endDate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input placeholder={props.movies.endDate}type="date" ref={endDate => (setendDate(endDate))} ></input>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow3(true)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit3}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal id="category" show={show4} onHide={() => setShow4(false)} aria-labelledby="category">
      <Modal.Header closeButton>
        <Modal.Title>Change category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input placeholder={props.movies.category} ref={category => (setcategory(category))}type="text" ></input>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow4(true)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit4}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>

    </tr>
  );
}

class EditMovies extends Component {
  constructor() {
    super();
    this.state = {
      username: getCookie("username"),
      user_role: getCookie("role"),
      movie_list: [],
      movie_list2: [],
      button1:true,
      button2:true,
      movie_fetched:false,
    };
    this.setState = this.setState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }
  
  handleChange(event) {
    axios.post(url + "/dbmaster/getspecmoviesowner", {search:event.target.value,owner:this.state.username},{headers:{'Content-Type': 'application/json','X-Auth-Token':getCookie ('token')}}).then((response) => {
      const movie_list = response.data.movies;
      console.log("movie_list fetched");
      this.setState({ movie_list });
    }, (error) => {
      console.log("asdasd");
    });
  }

  handleChange2() {
    // var that = this;
    axios.post(url + "/dbmaster/getfeed", {username:getCookie("username")},{headers:{'Content-Type': 'application/json','X-Auth-Token':getCookie ('token')}}).then((response) => {
      const movie_list2 = response.data.movies;
      this.setState({ movie_list2});
      console.log("movie_list fetched",this.state.movie_list2);
    }, (error) => {
      console.log("get feed - Axios Error.");
    });
  }

  fetchMovieList(){
    axios.post(url + "/dbmaster/getownermovies",{
      username: this.state.username,
    },{headers:{'Content-Type': 'application/json','X-Auth-Token':getCookie ('token')}}).then((response) => {
      const movie_list = response.data.movies;
      this.setState({ movie_list: movie_list,movie_fetched:true});
    });
  }
  componentDidUpdate(){
    if (this.state.movie_fetched===false){
      this.fetchMovieList()
    }
  }

  componentDidMount(){
    if (this.state.user_role === "Cinemaowner" ) {
      this.setState({ button1:false });
    }
    if (this.state.user_role === "Admin" ) {
      this.setState({ button2:false });
    }
    this.fetchMovieList()
  }
  
  render() {
    console.log("getCookie(role)",getCookie("role"));
    //var role= getCookie("role");
    if (getCookie("role")!=="Cinemaowner"){
      alert("access denied");
      return (<Redirect to="/dashboard" />);}
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
            <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={this.handleChange} />
            <Dropdown onClick={()=>{this.handleChange2()}}>
                  <Dropdown.Toggle variant="success" id="dropdown-basic" >
                    Notifications
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                  {this.state.movie_list2.map((movies) => (
                    <Dropdown.Item > 
                    <tr>
                      This Movie is Updated : {movies.title}
                    </tr>
                  </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
            <Nav.Link href="./logout">Log out</Nav.Link>
          </Form>
          </Navbar>
          <Row className="justify-content-md-center">
            <h4>
              Here you can edit the movies by clicking on them !
            </h4>
          </Row>
          <Row className="justify-content-md-center">
          <Table responsive="lg" striped bordered hover>
            <thead>
              <tr><th>Title</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Category</th>
              <th><Button href="./addMovie">Add Movie</Button></th></tr>
            </thead>
              <tbody>
                {this.state.movie_list.map((movies, index) => (
                  <Movies
                    onfetched ={()=>(setTimeout(() => {this.setState({movie_fetched:false})}, 20))}
                    key={index}
                    movies={movies}
                  />
                ))}
              </tbody>
            </Table>
          </Row>
        </Container>
      );
    }
  }
}

export default EditMovies;
