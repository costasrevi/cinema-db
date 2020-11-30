// import jwt from "jsonwebtoken";
export function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + ";path=/";
}

export function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function checkCookie() {
  let token = getCookie("token");
  var axios = require('axios');
  var config = {
    method: 'get',
    async: false,
    url: 'http://localhost/idm/user?access_token='+token,
    headers: { 
    }
  };
  axios(config)
  .then(function (response) {
    console.log(response.data);
    return response.data.username;
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });
}

// export function checkCookieandconfirm() {
//   let token = getCookie("token");
//   console.log("token is: ", token);
//   let decoded = jwt.decode(token);
//   if (decoded !== null && decoded.confirmed) {
//     return decoded.username;
//   } else {
//     return null;
//   }
// }


export function checkowner() {
  let token = getCookie("token");
  var axios = require('axios');
  var config = {
    method: 'get',
    async: false,
    url: 'http://localhost/idm/user?access_token='+token,
    headers: { 
    }
  };
  console.log("response.data");
  axios(config)
  .then(function (response) {
    console.log(response.data);
    if (response.data.organizations['0'].name === "Cinemaowner") {
      return response.data.organizations['0'].name;}
    else{
      return null;
    }
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });
}

export function checkadmin() {
  let token = getCookie("token");
  var axios = require('axios');
  var config = {
    method: 'get',
    async: false,
    url: 'http://localhost/idm/user?access_token='+token,
    headers: { 
    }
  };
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    if (response.data.organizations['0'].name === "Admin") {
      return response.data.organizations['0'].name;}
    else{
      return null;
    }
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });
}

export function checkUser() {
  let token = getCookie("token");
  var axios = require('axios');
  var config = {
    method: 'get',
    url: 'http://localhost/idm/user?access_token='+token,
    headers: { 
    }
  };
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    if (response.data.organizations['0'].name !== null) {
      return response.data.organizations['0'].name;}
    else{
      return null;
    }
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });
}

// export function checkConfirmed() {
//   let token = getCookie("token");
//   console.log("token is: ", token);
//   let decoded = jwt.decode(token);
//   if (decoded !== null) {
//     return decoded.confirmed;
//   } else {
//     return null;
//   }
//
// }
