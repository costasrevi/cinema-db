import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from 'prop-types';
import { Form, Button, Col } from "react-bootstrap";
import axios from "axios";

// import DatePicker from "react-datepicker";
//import DateRangePicker from '@bit/wilsonhuynh.wh-app.date-range-picker';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
 
// import "react-datepicker/dist/react-datepicker.css";

import { checkCookie, setCookie } from "../Authentication/cookies";

const url = process.env.REACT_APP_SERVICE_URL;


class AddMovie extends Component {
  constructor() {
    super();
    this.state = {
        title: "",
        startdate: null,
        enddate: null,
        username:checkCookie(),
        focusedInput:"",
        category: "",
      isAuthenticated: checkCookie(),
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    // check it out: we get the event.target.name (which will be either "username" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("movie success",this.state.startDate.getUTCDate());
    console.log("movie ",this.state.startDate._d);
    console.log("movie ",this.state.startDate._d.getDay);
    // console.log("movie success",this.state.startDate.getDate());
    const moviedata = {
      title: this.state.title,
      startDate: this.state.startDate._d,
      endDate: this.state.endDate._d,
      cinemaname: this.state.username,
      category: this.state.category,
    };
    console.log("movie success",moviedata);
    if (moviedata.title !== "" && moviedata.startDate !== null && moviedata.endDate !== null && moviedata.cinemaname !== "" ){}
    await axios.post(url + "/dbmaster/addmovie", moviedata).then(
      (response) => {
        alert("Movie added successfully");
      },
      (error) => {
        alert("addmovie Unsuccesful. Please check your data.");
      }
    );
    this.setState({ title: "", startDate: null, endDate: null,cinemaname: "" ,category:""});
  };
  
  render() {
    // const { startDate, endDate } = this.state;
    return (
      <Form className="my-form" onSubmit={this.handleSubmit}>
        <Form.Row className="justify-content-md-center">
          <h3>Add Movie</h3>
        </Form.Row>
        <Form.Group controlId="title">
          <Form.Label>Tittle</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Enter title"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="startDate">
        <Form.Label>Select Dates</Form.Label>
        <DateRangePicker
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          readOnly={true}
          startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
          onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
        />
        </Form.Group>
        {/* <Form.Group controlId="formBasicPassword">
          <Form.Label>cinema name</Form.Label>
          <Form.Control
            type="cinemaname"
            name="cinemaname"
            placeholder="Enter Cinema name"
            onChange={this.handleChange}
          />
        </Form.Group> */}
        <Form.Group controlId="formBasicPassword">
          <Form.Label>category</Form.Label>
          <Form.Control
            type="category"
            name="category"
            placeholder="Enter category"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Row>
          <Col>
            <Button variant="primary" type="submit" onClick={this.handleSubmit}>
              add
            </Button>
            <Button className="dashboard" href="./dashboard">
                Go Back
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }
}

export default AddMovie;
