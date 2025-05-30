import { userService } from "../../services/user";

export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";
export const CHANGE_COUNT = "CHANGE_COUNT";
export const SET_USER = "SET_USER";
export const SET_WATCHED_USER = "SET_WATCHED_USER";
export const REMOVE_USER = "REMOVE_USER";
export const SET_USERS = "SET_USERS";
export const IS_SIGNUP = "IS_SIGNUP";

const initialState = {
  count: 10,
  user: userService.getLoggedinUser(),
  users: [],
  watchedUser: null,
  isSignup: false,
}

export function userReducer(state = initialState, action) {
  var newState = state;
  switch (action.type) {
    case INCREMENT:
      newState = { ...state, count: state.count + 1 };
      break;
    case DECREMENT:
      newState = { ...state, count: state.count - 1 };
      break;
    case CHANGE_COUNT:
      newState = { ...state, count: state.count + action.diff };
      break;
    case SET_USER:
      newState = { ...state, user: action.user };
      break;
    case SET_WATCHED_USER:
      newState = { ...state, watchedUser: action.user };
      break;
    case REMOVE_USER:
      newState = {
        ...state,
        users: state.users.filter((user) => user._id !== action.userId),
      };
      break;
    case SET_USERS:
      newState = { ...state, users: action.users };
      break;
    case IS_SIGNUP:
      return { ...state, isSignup: action.isSignup };
    default:
      return state;
  }
  // For debug:
  // window.userState = newState
  // console.log('State:', newState)
  return newState;
}
