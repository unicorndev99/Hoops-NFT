import { LIST_REQUESTS, APPROVE_REQUEST, ADD_USER, DELETE_REQUEST, DISAPPROVE_REQUEST } from "../constants";

export default function (state = {}, action) {
  switch (action.type) {
    case LIST_REQUESTS:
      return { ...state, requests: action.payload };
    case APPROVE_REQUEST:
      return { ...state, requests: action.payload };
    case ADD_USER:
      return { ...state, addUser: action.payload };
    case DELETE_REQUEST:
      return { ...state, deleteUser: action.payload };
    case DISAPPROVE_REQUEST:
      return { ...state, disApproveRequest: action.payload };
    default:
      return state;
  }
}
