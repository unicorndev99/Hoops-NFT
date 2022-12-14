import axios from "axios";

// function getCookie(cname) {
//   let name = cname + "=";
//   let decodedCookie = decodeURIComponent(document.cookie);
//   let ca = decodedCookie.split(";");
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) === " ") {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name) === 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return "";
// }

export function auth() {
  // console.log(token)
  const req = axios
    .get("/auth")
    .then((resp) => {
      return resp.data;
    })
    .catch(console.error());

  return {
    type: "AUTH_CHECK",
    payload: req,
  };

}


export function loginUser(username, password) {
  const req = axios
    .post("/login", { email: username, password })
    .then((resp) => {
      if (resp.data.isAuth) document.cookie = `auth=${resp.data.token}`;

      return resp.data;
    })
    .catch(console.error());
  return {
    type: "USER_LOGIN",
    payload: req,
  };
}

export function clearLoginUser() {
  return {
    type: "USER_LOGIN_CLEAN",
    payload: {},
  };
}

export function logout() {
  const req = axios
    .get("/logout", {
    })
    .then((resp) => resp.data)
    .catch(console.error());
  return {
    type: "USER_lOGOUT",
    payload: req,
  };
}

export async function changePassword(password) {  //p1 box in password
  // console.log("changePassword 08: ", password);    
  
     const req = await axios
    .post("/changePassword", { password })    //patch used instead of post
    .then((resp) => {
      
      return {
        type: "CHANGE_PASSWORD",
        payload: resp.data,
      };
      // return resp.data;
    })
    .catch(() => {
      return {
        type: "CHANGE_PASSWORD",
        payload: "Something went Wrong!"
      };
    });
    // console.log("req: ",req)
    return {
      type: "CHANGE_PASSWORD",
      payload: req,
    };
}

export function deleteUser(username){
  const req = axios
  .post("/deleteuser", { username })
  .then((resp) => {
    return resp.data;
  })
  .catch(console.error());
return {
  type: "DELETE_USER",
  payload: req,
};
}