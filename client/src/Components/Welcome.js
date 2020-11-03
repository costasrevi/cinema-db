import React, { Component  } from "react";
import { Redirect } from "react-router-dom";
import { Container,    Button,  Row,Col, } from "react-bootstrap";

import { checkCookie,checkUser,checkConfirmed } from "../Authentication/cookies";


class Welcome extends Component {
    constructor() {
      super();
      this.state = {
        username: checkCookie(),
        user_role: checkUser(),
        confirmed: checkConfirmed(),
      };
      this.setState = this.setState.bind(this);
    }

render() {
    return ( 
        <Container bsPrefix="my-container">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h4>
              Welcome {this.state.username}! Your role is {this.state.user_role}{" "} and you are not yet confirmed!
            </h4>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Button className="dashboard" href="./logout">
              Logout
            </Button>
          </Col>
        </Row>
        </Container>
      );
    }
}

export default Welcome;
    