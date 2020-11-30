import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import axios from "axios";

import { getCookie ,setCookie} from "../Authentication/cookies";

const url = process.env.REACT_APP_SERVICE_URL;
// const querystring = require('querystring');
// const { curly } = require('node-libcurl');

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      email: "",
      id: "",
      role:"User",
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
          alert("Go to login");
          // window.location.replace('http://localhost");
          },
          (error) => {
            console.log("add to org error:",JSON.stringify(error));
            this.setState({ checkerror:true});
            // alert("Registration Unsuccesful. Please check your credentials.");
          }
        );
      }
      // if (this.state.checkerror===false){
      //   setTimeout(() => {
      //   // var axios = require('axios');
      //   var qs = require('qs');
      //   var data = qs.stringify({
      //   'grant_type': 'password',
      //   'username': this.state.username,
      //   'password': this.state.password 
      //   });
      //   var config = {
      //     method: 'post',
      //     url: 'http://localhost/idm/oauth2/token',
      //     headers: { 
      //       'Authorization': 'Basic ZWY5ZTBkMTQtODg1My00MGE2LTg1ZGMtNTA5NGNjMzM3YWNhOmI0OTU1NmNjLThjZDEtNDVhYS1iMjU3LTRiMjJmOTdiNmUyMw==', 
      //       'Content-Type': 'application/x-www-form-urlencoded'
      //     },
      //     data : data
      //   };
      //   var self = this;
      //   axios(config)
      //   .then(function (response) {
      //     console.log(JSON.stringify(response.data));
      //     setCookie("token",response.data.access_token);
      //     self.setState({ checkCookie:true});
      //     // this.setState({ isAuthenticated:response.data.access_token});
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //     self.setState({ checkCookie:false});
      //   });
      // }, 3000);
      // }
    }
  };
//used to check if there is a token and if that token is valid
  componentDidMount() {
    if (this.state.username===""){
      let token = getCookie("token");
      const axios = require('axios');
      axios.get("http://localhost/idm/user?access_token="+token, token).then(
        (response) => {
        console.log("response.data.username",response.data.username);
        this.setState({ username :response.data.username});
        this.setState({ role :response.data.organizations['0'].name});
        this.setState({ checkCookie :true});
        console.log("this is create user error: checkCookie :true}");
        },
        (error) => {
          console.log("this is create user error:",JSON.stringify(error));
          this.setState({ checkCookie :false});
        }
      );
    }
  }


  render() {
    if (this.state.checkCookie) {
      return <Redirect to="/dashboard" />;
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
        {/* <Form.Group controlId="surname">
          <Form.Label>Surname</Form.Label>
          <Form.Control
            type="text"
            name="surname"
            placeholder="Enter surname"
            onChange={this.handleChange}
          />
        </Form.Group> */}
        {/* <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter name"
            onChange={this.handleChange}
          />
        </Form.Group> */}
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
