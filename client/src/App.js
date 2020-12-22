import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Components/Routes";
import io from "socket.io-client";
import { getCookie,setCookie } from "./Authentication/cookies";

const url = process.env.REACT_APP_SERVICE_URL
const socket = io.connect();

class App extends Component {

  componentDidMount() {
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
    'grant_type': 'refresh_token',
    'refresh_token': getCookie("refresh"),
    });
    var config = {
      method: 'post',
      url:url+ '/idm/oauth2/token',
      headers: { 
        'Authorization': 'Basic NjI1OWRlYmUtNzMyNy00YjRjLTg0NWItMTJiZWQ5NmRkY2I0OjkwYTk4NThkLTJiM2QtNDM3My1hMTBlLTY5ZThhZjcxNmU1Yw==', 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };
    axios(config)
    .then(function (response) {
      console.log("this is my fcking token setCookie app.js");
      setCookie("token",response.data.access_token);
      setCookie("refresh",response.data.refresh_token);
    })
    .catch(function (error) {
      setCookie("token",null);
      setCookie("refresh", null);
      setCookie("username", null);
      setCookie("role", null);
      console.log(error);
    });
    console.log("socket on connect",getCookie("username"));
    socket.on('message', function(data_info) {
      console.log("socket on emsasasdata_info",data_info);
      if (getCookie("username")===data_info.username){
        alert("Movies with title :"+data_info.title.value+" has been updated to :"+"\n start Date:"+data_info.startDate.value+"\n end Date:"+data_info.endDate.value+"\n category:"+data_info.category.value);
      }
      console.log("socket on emsasas");
    });
  }
  render() {
    return (
      <Router>
        <Routes />
      </Router>
    );
  }
}

export default App;
