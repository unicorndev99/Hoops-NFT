import axios from "axios";
import { LIST_REQUESTS, APPROVE_REQUEST, ADD_USER, DELETE_REQUEST, DISAPPROVE_REQUEST, BLOCK_REQUEST, UNBLOCK_REQUEST } from "../constants";

import SelectDate from "../components/selectDate/selectDate";

export function fetchRequests() {
  const req = axios
    .get("/all-requests")
    .then((resp) => resp.data)
    .catch(console.error());
  return {
    type: LIST_REQUESTS,
    payload: req,
  };
}

export function requestApprove(address, date) {  //unixdate added
  const req = axios
    .post("/request-approve", { address, date})
    .then((resp) => resp.data)
    .catch(console.error());
  return {
    type: APPROVE_REQUEST,
    payload: req,
  };
}

export function addUser(address) {
  const req = axios
    .post("/add-user", { address })
    .then((resp) => resp.data)
    .catch(console.error())
  console.log('req', req);
  return {
    type: ADD_USER,
    payload: req,
  };
}

export function deleteRequest(address) {
  const req = axios
    .delete(`/delete-request?address=${address}`)
    .then((resp) => resp.data)
    .catch(console.error());
  return {
    type: DELETE_REQUEST,
    payload: req,
  };
}

//Block 
export function blockRequest(address) {
  const req = axios
    .patch("/block-request",{address})
    .then((resp) => resp.data)
    .catch(console.error());
  return {
    type: BLOCK_REQUEST,
    payload: req,
  };
}
//

//Unblock
export function unBlockRequest(address) {
  const req = axios
    .patch("/unblock-request", { address })
    .then((resp) => resp.data)
    .catch(console.error());
  return {
    type: UNBLOCK_REQUEST,
    payload: req,
  };
}
//

export function disApproveRequest(address) {
  const req = axios
    .patch("/disapprove-request", { address })
    .then((resp) => resp.data)
    .catch(console.error());
  return {
    type: DISAPPROVE_REQUEST,
    payload: req,
  };
}