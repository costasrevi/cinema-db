import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import axios from "axios";
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { getCookie } from "../Authentication/cookies";

const url = process.env.REACT_APP_SERVICE_URL;


class AddMovie extends Component {
  constructor() {
    super();
    this.state = {
        title: "",
        startdate: null,
        enddate: null,
        username:getCookie("username"),
        focusedInput:"",
        category: "",
        isAuthenticated: true,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const moviedata = {
      title: this.state.title,
      startDate: this.state.startDate._d,
      endDate: this.state.endDate._d,
      cinemaname: this.state.username,
      category: this.state.category,
    };
    console.log("movie success",moviedata);
    if (moviedata.title !== "" && moviedata.startDate !== null && moviedata.endDate !== null && moviedata.cinemaname !== "" ){
      await axios.post(url + "/dbmaster/addmovie", moviedata).then(
        (response) => {
          alert("Movie added successfully");
        },
        (error) => {
          alert("addmovie Unsuccesful. Please check your data.");
        }
      );}
  };

  render() {
    if (getCookie("role")!=="Cinemaowner"){
      alert("access denied");
      return (<Redirect to="/dashboard" />);}
    else{
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
              <Button className="EditMovies" href="./EditMovies">
                  Go Back
              </Button>
            </Col>
          </Form.Row>
        </Form>
      );
    }
  }
}

export default AddMovie;
