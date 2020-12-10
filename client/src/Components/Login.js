import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
// import axios from "axios";
import { setCookie, getCookie , checkCookie } from "../Authentication/cookies";

const url = process.env.REACT_APP_SERVICE_URL;

class Login extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      email: "",
      login:false,
    };
    // this.setState = this.setState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    // check it out: we get the event.target.name (which will be either "username" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
    'grant_type': 'password',
    'username': this.state.email,
    'password': this.state.password 
    });
    var config = {
      method: 'post',
      url: url+'/idm/oauth2/token',
      headers: { 
        'Authorization': 'Basic ZWY5ZTBkMTQtODg1My00MGE2LTg1ZGMtNTA5NGNjMzM3YWNhOmI0OTU1NmNjLThjZDEtNDVhYS1iMjU3LTRiMjJmOTdiNmUyMw==', 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };
    axios(config)
    .then(function (response) {
      console.log("this is my fcking token");
      const axios = require('axios');
      axios.get(url+"/idm/user?access_token="+response.data.access_token, response.data.access_token).then(
        (response) => {
        // setTimeout(() => {this.setState({login:true})}, 100);
        console.log("response.data.username",response.data.username);
        setCookie("username",response.data.username);
        setCookie("role",response.data.organizations['0'].name);
        console.log("this.state.user_role ", response.data.organizations['0'].name);
        },
        (error) => {
          console.log("this is create user error:",JSON.stringify(error));
          // this.setState({ isAuthenticated :false});
        }
      );
      console.log(JSON.stringify(response.data));
      setCookie("token",response.data.access_token);
      setCookie("refresh",response.data.refresh_token);
    })
    .catch(function (error) {
      console.log(error);
    });
    setTimeout(() => {this.setState({login:true})}, 500);
  };


  render() {
    console.log("getCookie(token)wtfwtf", getCookie("role")," lebnght ",getCookie("role").length);
    if (getCookie("role").length>=5) {
      console.log("getCookie(token)reaaaalllyyy?", getCookie("role")," lebnght ",getCookie("tokroleen").length);
      return <Redirect to="/dashboard" />;
    }

    return (
      <Form
        fluid="md"
        className="my-form justify-content-center"
        onSubmit={this.handleSubmit}
      >
        <Form.Row className="justify-content-md-center">
          <h3>Sign In</h3>
        </Form.Row>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
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
            placeholder="Password"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Row>
          <Col>
            <Button variant="primary" type="submit" onClick={this.handleSubmit}>
              Login
            </Button>
          </Col>
          <Col>
            <a href="./register"> I don't have an account</a>
          </Col>
        </Form.Row>
      </Form>
    );
  }
}

export default Login;

// We can add Register Class Here
