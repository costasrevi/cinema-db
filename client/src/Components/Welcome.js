import React, { Component ,
     Container,
    Row, } from "react";
// import { Redirect } from "react-router-dom";
// import { Form, Button, Col } from "react-bootstrap";


import { checkCookie,checkUser,checkConfirmed } from "../Authentication/cookies";


class Welcome extends Component {
    constructor() {
      super();
      this.state = {
        username: checkCookie(),
        user_role: checkUser(),
        confirmed: checkConfirmed,
      };
      this.setState = this.setState.bind(this);
    }

render() {
    return ( 
        <Container bsPrefix="my-container">
        <Row className="justify-content-md-center">
          <h4>
            Welcome {this.state.username}! You are not Confirmed yet.Please try again later!
          </h4>
        </Row>
      </Container>
      );
    }
}

export default Welcome;
    