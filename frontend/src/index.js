import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./view/styles/color.css";
import "./view/styles/Find_Success.css";
import "./view/styles/join.css";
import "./view/styles/Login.css";
import "./view/styles/ai_make.css";
import "./view/styles/category.css";
import "./view/styles/dashboard.css";
import "./view/styles/item_add.css";
import "./view/styles/item_list.css";
import "./view/styles/search.css";
import "./view/styles/master.css";
import "./view/styles/reset.css";
import "./view/styles/sidebar.css";
import "./view/styles/video_add.css";
import "./view/styles/modal.css";
import "./view/styles/video_list.css";
import "./view/styles/Boshow_player.css";
import "./view/styles/advertising_add.css";
import "./view/styles/adb_component.css";
import "./view/styles/video_check.css";
import "./view/styles/user_rank.css";
import "./view/styles/op_adv.css";
import "./view/styles/user_support.css";
import "./view/styles/ai_faiss.css";
import "./view/contents/edit/ai_metaData/ai_metaData_styles.css"
import "./view/components/headerProflies/headerprofiles.css";
import "./view/contents/edit/ai_model_TC/styles.css"
import "./view/components/Statisticalanalysis/Analysis.css"

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { CookiesProvider } from "react-cookie";

axios.defaults.baseURL = `http:${process.env.REACT_APP_BACKEND_HOST}api`
axios.defaults.withCredentials = true;

ReactDOM.render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
