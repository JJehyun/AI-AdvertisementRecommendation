import * as types from "../actions/ActionTypes";
import update from "react-addons-update";

const initialState = {
  login: {
    status: "INIT",
  },
  join: {
    status: "INIT",
  },
};

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case types.AUTH_LOGIN:
      return update(state, {
        login: {
          status: { $set: "WAITING" },
        },
      });
    case types.AUTH_LOGIN_SUCCESS:
      return update(state, {
        login: {
          status: { $set: "SUCCESS" },
          userId : { $set : action.payload }
        },
      });
    case types.AUTH_LOGIN_FAILURE:
      return update(state, {
        login: {
          status: { $set: "FAILURE" },
        },
      });
    case types.AUTH_JOIN:
      return update(state, {
        join: {
          status: { $set: "WAITING" },
        },
      });
    case types.AUTH_JOIN_SUCCESS:
      return update(state, {
        join: {
          status: { $set: "SUCCESS" },
        },
      });
    case types.AUTH_JOIN_FAILURE:
      return update(state, {
        join: {
          status: { $set: "FAILURE" },
        },
      });
    default:
      return state;
  }
}
