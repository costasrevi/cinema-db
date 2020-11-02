import React, { Component, useState } from "react";
// import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Col,
  Row,
  Table,
  Dropdown,
  DropdownButton,
  Modal,
  Form,
  ButtonGroup,
} from "react-bootstrap";
import { checkCookie, checkUser } from "../Authentication/cookies";
import axios from "axios";

const url = process.env.REACT_APP_SERVICE_URL;


function User(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log(props.users);
  return (
    <tr>
      <td>{props.users.username}</td>
      <td>{props.users.email}</td>
      <td>{props.users.surname}</td>
      <td><Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body><Form.Control
            type="text"
            name="surname"
            placeholder="Enter surname"
            // onChange={this.handleChange}
          /></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={this.handleSubmit}>
              add
          </Button>
        </Modal.Footer>
      </Modal></td>
      <td>{props.users.name}</td>
      <td>{props.users.confirmed}</td>
      <td><Button onClick={props.onClickconfirm}>confirmed</Button></td>
      <td>{props.users.user_role}</td>
      <td>
        <DropdownButton
          as={ButtonGroup}
          title="Change Role"
          id="bg-nested-dropdown"
        >
          <Dropdown.Item onClick={props.onClickAdmin}>Make Admin</Dropdown.Item>
          <Dropdown.Item onClick={props.onClickcinema_owner}>
            Make Cinema owner
          </Dropdown.Item>
        </DropdownButton>
      </td>
    </tr>
  );
}

class AdminPanel extends Component {
  constructor() {
    super();
    this.state = {
      username: checkCookie(),
      user_role: checkUser(),
      users_list: [],
      users_fetched: false,
    };
    this.setState = this.setState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleSubmit = async (event) => {
    event.preventDefault();

  }
  fetchUsersList() {
    axios.get(url + "/auth/get_users").then((response) => {
      const users_list = response.data.users_list;
      console.log("users fetched");
      this.setState({ users_list: users_list, users_fetched: true });
    });
  }

  handleChange(event) {
    // check it out: we get the event.target.name (which will be either "username" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [event.target.name]: event.target.value });
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
    return (
      <Container bsPrefix="my-container">
        {this.state.users_fetched ? null : this.fetchUsersList()}
        <Row className="justify-content-md-center">
          <h4>
            Good to have you back {this.state.username}! This is your admin
            panel. You can promote users to cinemaowners or Admins!
          </h4>
        </Row>
        <Row>
          <Table responsive striped bordered hover>
            <tbody>
              {this.state.users_list.map((user, index) => (
                <User
                  key={index}
                  users={user}
                  onClickconfirm={() => this.handleClick(user, "confirm")}
                  onClickAdmin={() => this.handleClick(user, "admin")}
                  onClickcinema_owner={() => this.handleClick(user, "cinema_owner")}
                />
              ))}
            </tbody>
          </Table>
        </Row>
        <Row className="justify-content-md-right">
          <Col md="auto">
            <Button className="dashboard" href="./dashboard">
              Go Back
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AdminPanel;
