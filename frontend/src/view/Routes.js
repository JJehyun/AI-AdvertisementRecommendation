import React from "react";
import { Route, Switch } from "react-router-dom";
// 로그인
import PrivateRoute from "./contents/user/privateRoute.js";
import OpRoute from "./contents/user/opRoute.js";
import AuthRoute from "./contents/user/authRoute.js";
import Login from "./contents/user/login.js";
import IdInquiry from "./contents/user/id_Inquiry.js";
import PwInquiry from "./contents/user/pw_Inquiry.js";
import PwInquirySuccess from "./contents/user/pw_Inquiry_success.js";
import ChangePw from "./contents/user/change_pw.js";
import Join from "./contents/user/join.js";
import JoinSuccess from "./contents/user/join_success.js";
// 편집모드
import EdDashboard from "./contents/edit/dashboard.js";
import Category from "./contents/edit/category.js";
import VideoAdd from "./contents/edit/video_add.js";
import VideoList from "./contents/edit/video_list.js";
import ItemAdd from "./contents/edit/item_add.js";
import ItemAddCategory from "./contents/edit/item_add_category.js";
import ItemList from "./contents/edit/item_list.js";
import AiMake from "./contents/edit/ai_make.js";
import AiFaiss from "./contents/edit/ai_faiss.js";
import AiSetting from "./contents/edit/ai_setting.js";
import AiTcFix from "./contents/edit/ai_tc_fix";
import AdvertisingAdd from "./contents/edit/advertising_add.js";
import AdvertisingList from "./contents/edit/advertising_list.js";
// 운영모드
import OpDashboard from "./contents/operation/dashboard.js";
import OpUserRank from "./contents/operation/oper_user_rank.js";
import OpUserLog from "./contents/operation/oper_user_log.js";
import OpAdvertisingList from "./contents/operation/oper_advertising.js";
import OPVideoCheck from "./contents/operation/oper_video_check.js";
import AnalysisView from "./components/Statisticalanalysis/AnalysisView.js";
// 고객지원
import UserSetting from "./contents/user_support/user_setting.js";
import CustomerSupport from "./contents/user_support/customer_support.js";
// 플레이어
import BoshowPlayer from "./contents/edit/ai_model_TC/boshowPlayer";
import tcCheckPlayer from "./contents/edit/ai_model_TC/tcCheckPlayer.js";

const Routes = (props) => {
  return (
    <Switch>
      {/* 유저 */}
      <AuthRoute exact path="/login" component={VideoAdd} />
      <AuthRoute exact path="/id_inquiry" component={IdInquiry} />
      <AuthRoute exact path="/pw_inquiry" component={PwInquiry} />
      <AuthRoute
        exact
        path="/pw_inquiry_success"
        component={PwInquirySuccess}
      />
      <AuthRoute exact path="/change_pw" component={ChangePw} />
      <AuthRoute exact path="/join" component={Join} />
      <AuthRoute exact path="/join_success" component={JoinSuccess} />
      {/* 편집모드 */}
      <PrivateRoute exact path="/video_add" component={VideoAdd} />
      <PrivateRoute exact path="/ed_dashboard" component={EdDashboard} />
      <PrivateRoute exact path="/category" component={Category} />
      <PrivateRoute exact path="/video_list" component={VideoList} />
      <PrivateRoute exact path="/item_add" component={ItemAdd} />
      <PrivateRoute
        exact
        path="/item_add_category"
        component={ItemAddCategory}
      />
      <PrivateRoute exact path="/item_list" component={ItemList} />
      <PrivateRoute exact path="/ai_make" component={AiMake} />
      <PrivateRoute exact path="/ai_faiss" component={AiFaiss} />
      <PrivateRoute exact path="/ai_setting" component={AiSetting} />
      <PrivateRoute exact path="/ai_tc_fix" component={AiTcFix} />
      <PrivateRoute exact path="/advertising_add" component={AdvertisingAdd} />
      <PrivateRoute
        exact
        path="/advertising_list"
        component={AdvertisingList}
      />
      {/* 운영모드 */}
      <PrivateRoute exact path="/op_dashboard" component={OpDashboard} />
      <PrivateRoute exact path="/op_user_rank" component={OpUserRank} />
      <PrivateRoute exact path="/op_user_log" component={OpUserLog} />
      <PrivateRoute
        exact
        path="/op_advertising_list"
        component={OpAdvertisingList}
      />
      <PrivateRoute exact path="/op_video_check" component={OPVideoCheck} />
      <PrivateRoute exact path="/op_analysis" component={AnalysisView} />

      {/* 고객지원 */}
      {/* <PrivateRoute exact path="/user_settings" component={UserSetting} />
      <PrivateRoute
        exact
        path="/customer_support"
        component={CustomerSupport}
      /> */}
      {/* 플레이어 */}
      <Route exact path="/Boshow_player" component={BoshowPlayer} />
      <Route exact path="/TCCheck_player" component={tcCheckPlayer} />

      <PrivateRoute path="/*" component={VideoAdd} />
    </Switch>
  );
};

export default Routes;
