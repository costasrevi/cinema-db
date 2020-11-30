import React, { Component } from "react";
import {
  Container,Button,Row,Table,Dropdown,Navbar,Nav,Form,FormControl,DropdownButton,ButtonGroup,
} from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { checkCookie, checkUser,checkadmin } from "../Authentication/cookies";
import axios from "axios";

const url = process.env.REACT_APP_SERVICE_URL;


function User(props) {

  console.log(props.users);
  return (
    <tr>
      <td>{props.users.username}</td>
      <td>{props.users.email}</td>
      <td>{props.users.surname}</td>
      <td>{props.users.name}</td>
      {/* <td>{props.users.confirmed}</td> */}
      {/* <td><Button onClick={props.onClickconfirm}>confirmed</Button></td> */}
      <td>{props.users.user_role}</td>
      <td>
        <DropdownButton
          as={ButtonGroup}
          title="Change Role"
          id="bg-nested-dropdown"
        > <Dropdown.Item onClick={props.onClickUser}>Make User</Dropdown.Item>
          <Dropdown.Item onClick={props.onClickcinema_owner}>Make Cinema owner</Dropdown.Item>
          <Dropdown.Item onClick={props.onClickAdmin}>Make Admin</Dropdown.Item>
        </DropdownButton>
      </td>
      <td><Button onClick={props.onClickDelete}>Delete user</Button></td>
    </tr>
  );
}

class AdminPanel extends Component {
  constructor() {
    super();
    this.state = {
      username: checkCookie(),
      user_role: checkUser(),
      // confirmed: checkConfirmed(),
      users_list: [],
      button1:true,
      button2:true,
      users_fetched: false,
    };
    this.setState = this.setState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.value===""){
    axios.get(url + "/auth/get_users").then((response) => {
      const users_list = response.data.users_list;
      console.log("users_list fetched");
      this.setState({ users_list });
    }, (error) => {
      console.log("users_listError.");
    });
    }else{
      axios.post(url + "/auth/getspecusers", {search:event.target.value}).then((response) => {
      const users_list = response.data.users_list;
      console.log("users_list fetched");
      this.setState({ users_list });
    }, (error) => {
      console.log("users_listError.");
    });
    }

  }
  componentDidMount() {    
  if (this.state.user_role === "cinema_owner" ) {
    this.setState({ button1:false });
  }
  if (this.state.user_role === "admin" ) {
    this.setState({ button2:false });
  }
}
  fetchUsersList() {
    axios.get(url + "/auth/get_users").then((response) => {
      const users_list = response.data.users_list;
      console.log("users fetched");
      this.setState({ users_list: users_list, users_fetched: true });
    });
  }

  handleDelete(user) {
    axios
    .post(url + "/auth/DeleteUser", {
      username: user.username,
    })
    .then((response) => {
      console.log("User Deleted");
    }, (error) => {
      console.log("Delete failled.");
    });
    this.fetchUsersList();
  }


  handleClick(user, role) {
    if (user.username === this.state.username) {
      alert("You cannot change your own role!");
    } else {
      if (role === 'confirm'){
        axios
        .post(url + "/auth/confirm_role", {
          username: user.username,
        })
        .then((response) => {
          console.log("User confirmed");
        });
      }else{
        axios
          .post(url + "/auth/change_role", {
            username: user.username,
            user_role: role,
          })
          .then((response) => {
            console.log("User Role Changed");
          });
      }
    }
    this.fetchUsersList();
  }

  render() {
    if (checkadmin()===null){
      alert("access denied");
      return(<Redirect to="/dashboard" />)}
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
            <Nav.Link href="./logout">Log out</Nav.Link>
          </Form>
          </Navbar>
          {this.state.users_fetched ? null : this.fetchUsersList()}
          <Row className="justify-content-md-center" >
            <h4 className="admin-panel">
              Good to have you back {this.state.username}! This is your admin
              panel. You can promote users to cinemaowners or Admins!
            </h4>
          </Row>
          <Row className="justify-content-md-center">
            <Table  responsive="lg" striped bordered hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>email</th>
                  <th>Surname</th>
                  <th>Name</th>
                  <th>Confirmed</th>
                  <th></th>
                  <th>Role</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.users_list.map((user, index) => (
                  <User
                    key={index}
                    users={user}
                    onClickconfirm={() => this.handleClick(user, "confirm")}
                    onClickAdmin={() => this.handleClick(user, "admin")}
                    onClickcinema_owner={() => this.handleClick(user, "cinema_owner")}
                    onClickUser={() => this.handleClick(user, "user")}
                    onClickDelete={() => this.handleDelete(user)}
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

export default AdminPanel;
