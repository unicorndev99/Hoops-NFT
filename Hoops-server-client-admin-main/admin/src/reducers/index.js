import { combineReducers } from "redux";
import user from "./user_reducer";
import request from "./request_reducer";

const rootReducer = combineReducers({
  user,
  request
});
export default rootReducer;
