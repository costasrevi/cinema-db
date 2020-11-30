import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
// import axios from "axios";
import { setCookie, getCookie , checkCookie } from "../Authentication/cookies";

// const url = process.env.REACT_APP_SERVICE_URL;

class Login extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      email: "",
      trash:"",
      // isAuthenticated: false,
      // confirmed:checkConfirmed(),
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
      url: 'http://localhost/idm/oauth2/token',
      headers: { 
        'Authorization': 'Basic ZWY5ZTBkMTQtODg1My00MGE2LTg1ZGMtNTA5NGNjMzM3YWNhOmI0OTU1NmNjLThjZDEtNDVhYS1iMjU3LTRiMjJmOTdiNmUyMw==', 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };
    // var self = this;
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      setCookie("token",response.data.access_token);
      // self.setState({ isAuthenticated:true});
      // this.setState({ isAuthenticated:response.data.access_token});
    })
    .catch(function (error) {
      console.log(error);
      // self.setState({ isAuthenticated:false});
    });
    if (getCookie("token")!==""){
      // this.setState({trash:"tesad"});
      let token = getCookie("token");
      console.log("this is my fcking token");
      const axios = require('axios');
      axios.get("http://localhost/idm/user?access_token="+token, token).then(
        (response) => {
        console.log("response.data.username",response.data.username);
        // this.setState({ username :response.data.username});
        setCookie("username",response.data.username);
        // this.setState({ user_role :response.data.organizations['0'].name});
        setCookie("role",response.data.organizations['0'].name);
        console.log("this.state.user_role ",this.state.user_role );
        this.setState({trash:"tesad"});
        // this.setState({ isAuthenticated :true});
        },
        (error) => {
          console.log("this is create user error:",JSON.stringify(error));
          // this.setState({ isAuthenticated :false});
          this.setState({trash:"tesad"});
        }
      );
    }
    setTimeout(() => {this.setState({trash:true});}, 50);
  };

  componentDidMount() {
    this.setState({trash:"tesad"});
  }

  // componentDidMount() {
  //   if (this.state.username===""){
  //     let token = getCookie("token");
  //     const axios = require('axios');
  //     axios.get("http://localhost/idm/user?access_token="+token, token).then(
  //       (response) => {
  //       console.log("response.data.username",response.data.username);
  //       // this.setState({ username :response.data.username});
  //       setCookie("username",response.data.username);
  //       // this.setState({ user_role :response.data.organizations['0'].name});
  //       setCookie("role",response.data.organizations['0'].name);
  //       console.log("this.state.user_role ",this.state.user_role );
  //       // this.setState({ isAuthenticated :true});
  //       },
  //       (error) => {
  //         console.log("this is create user error:",JSON.stringify(error));
  //         // this.setState({ isAuthenticated :false});
  //       }
  //     );
  //   }
  // }
  render() {
    console.log("getCookie(token)wtfwtf", getCookie("role")," lebnght ",getCookie("role").length);
    if (getCookie("role").length>=5) {
      console.log("getCookie(token)reaaaalllyyy?", getCookie("role")," lebnght ",getCookie("tokroleen").length);
      return <Redirect to="/dashboard" />;
    }
    // if (!this.state.confirmed && this.state.isAuthenticated) {
    //   return <Redirect to="/welcome" />;
    // }
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
