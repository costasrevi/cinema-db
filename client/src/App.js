import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Components/Routes";
import io from "socket.io-client";
import { getCookie } from "./Authentication/cookies";

const socket = io.connect();

class App extends Component {

  componentDidMount() {
    console.log("socket connect and joinned room");
    console.log("socket on emsasas",getCookie("username"));
    socket.on('message', function(data_info) {
      // console.log(typeof data_info);
      // console.log("data_info",data_info);
      // console.log(typeof data_info);
      console.log("socket on emsasasdata_info",data_info);
      console.log("socket on emsasas",getCookie("username"));
      console.log("socket on emsasadata_info[1]s",data_info.username);
      if (getCookie("username")===data_info.username[1]){
        alert(" title:"+data_info.title.value+"\n start Date:"+data_info.startDate.value+"\n end Date:"+data_info.endDate.value+"\n category:"+data_info.category.value);
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
