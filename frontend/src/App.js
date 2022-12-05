import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./view/Routes.js";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "./view/reducers";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

const App = (props) => {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <Routes />
        </Router>
      </Provider>
    </div>
  );
};

export default App;
