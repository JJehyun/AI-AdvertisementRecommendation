import * as types from "../actions/ActionTypes";
import update from "react-addons-update";

const initialState = {
  sbs: {
    status: "INIT",
  },
};

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case types.SBS_API:
      return update(state, {
        sbs: {
          status: { $set: "WAITING" },
        },
      });
    case types.SBS_API_SUCCESS:
      return update(state, {
        sbs: {
          status: { $set: "SUCCESS" },
        },
      });
    case types.SBS_API_FAILURE:
      return update(state, {
        sbs: {
          status: { $set: "FAILURE" },
        },
      });
    default:
      return state;
  }
}
