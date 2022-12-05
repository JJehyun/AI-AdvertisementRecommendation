import * as types from "../actions/ActionTypes";
import update from "react-addons-update";

const initialState = {
  list: {
    status: "INIT",
  },
};

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case types.VIDEO_LIST:
      return update(state, {
        list: {
          status: { $set: "WAITING" },
        },
      });
    case types.VIDEO_LIST_SUCCESS:
      return update(state, {
        list: {
          status: { $set: "SUCCESS" },
        },
      });
    case types.VIDEO_LIST_FAILURE:
      return update(state, {
        list: {
          status: { $set: "FAILURE" },
        },
      });
    default:
      return state;
  }
}
