import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import axios from "axios";

import { getCookie ,setCookie} from "../Authentication/cookies";

const url = process.env.REACT_APP_SERVICE_URL;

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      email: "",
      id: "",
      role:"User",
      trash:false,
      checkCookie: false,
      checkerror: false,
      xtoken: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChange2(event) {
    this.setState({role: event.target.value});
  }


  handleSubmit = async (event) => {
    event.preventDefault();
    var data = JSON.stringify({"name":"admin@test.com","password":"1234"});

    var config = {headers: 
      {"Content-Type": "application/json"}
    }
    await axios.post("http://localhost/idm/v1/auth/tokens", data,config).then(
      (response) => {
        // setCookie("token", response.data);
      console.log(JSON.stringify(response.data));
      this.setState({ xtoken:response.headers['x-subject-token']});
      console.log('x-subject-token',this.state.xtoken);
      },
      (error) => {
        this.setState({ checkerror:true});
        alert("Registration Unsuccesful. Please check your credentials.");
      }
    );
    if (this.state.checkerror===false){
      var config2 = {headers: 
        {"Content-Type": "application/json",
        "X-Auth-token":this.state.xtoken}
      }
      console.log(this.state.username,this.state.email,this.state.password)
      var data2 = JSON.stringify({"user":{"username":this.state.username,"email":this.state.email,"password":this.state.password}});
      await axios.post("http://localhost/idm/v1/users", data2,config2).then(
        (response) => {
        console.log(JSON.stringify(response.data));
        this.setState({ id: response.data.user['id']});
        },
        (error) => {
          console.log("this is create user error:",JSON.stringify(error));
          this.setState({ checkerror:true});
          // alert("Registration Unsuccesful. Please check your credentials.");
        }
      );
      if (this.state.role==="User"){
        this.setState({ role:"d91270ac-cd6c-47de-9b04-a82e3808872d"});
      }
      if (this.state.role==="cinema_owner"){
        this.setState({ role:"2620ec62-f40f-45eb-b6d0-66d2ab40da84"});
      }
      if (this.state.role==="Admin"){
        this.setState({ role:"64664451-576c-46f1-ae4a-5a9afca0be3c"});
      }
      if (this.state.checkerror===false){
        await axios.post("http://localhost/idm/v1/organizations/"+this.state.role+"/users/"+this.state.id+"/organization_roles/member", data2,config2).then(
          (response) => {
          console.log(JSON.stringify(response.data));
          this.setState({trash:true});
          // window.location.replace('http://localhost");
          },
          (error) => {
            console.log("add to org error:",JSON.stringify(error));
            this.setState({ checkerror:true});
            // alert("Registration Unsuccesful. Please check your credentials.");
          }
        );
      }
    }
  };

  render() {
    if (getCookie("role").length>=5) {
      return <Redirect to="/dashboard" />;
    }
    if (this.state.trash===true){
      alert("Now login to continue");
      return <Redirect to="/login" />;
    }
    return (
      <Form className="my-form" onSubmit={this.handleSubmit}>
        <Form.Row className="justify-content-md-center">
          <h3>Sign Up</h3>
        </Form.Row>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Enter username"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={this.handleChange}
          />
        </Form.Group>{
        <select value={this.state.role} onChange={this.handleChange2}>
        <option value="User">User</option>
        <option value="Admin">Admin</option>
        <option value="cinema_owner">Cinema Owner</option>
        </select>}
        <Form.Row>
          <Col>
            <Button variant="primary" type="submit" onClick={this.handleSubmit}>
              Sign Up
            </Button>
          </Col>
          <Col>
            <a href="./login"> I already have an account</a>
          </Col>
        </Form.Row>
      </Form>
    );
  }
}

export default Register;
