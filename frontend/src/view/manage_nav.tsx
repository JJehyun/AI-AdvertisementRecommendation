import React from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { fetchWithToken } from "../fetcher";
import { getCookie, removeCookie } from "./contents/user/cookies";

// 편집모드 이미지
import video from "../view/images/common/icons/menu-video.png";
import video_selected from "../view/images/common/icons/menu-video_selected.png";
import item from "../view/images/common/icons/menu-item.png";
import item_selected from "../view/images/common/icons/menu-item_selected.png";
import ai_make from "../view/images/common/icons/menu-ai_make.png";
import ai_make_selected from "../view/images/common/icons/menu-ai_make_selected.png";
import advertising from "../view/images/common/icons/menu-advertising.png";
import advertising_selected from "../view/images/common/icons/menu-advertising_selected.png";
import sitemap from "../view/images/common/icons/ic-sitemap.png";

import settings from "../view/images/common/icons/ic-option.png";
import settings_selected from "../view/images/common/icons/ic_option_selected.png";

// 운영모드 이미지
import dashboard from "../view/images/common/icons/menu-dashboard.png";
import dashboard_selected from "../view/images/common/icons/menu-dashboard_selected.png";
import category from "../view/images/common/icons/menu-category.png";
import user_rank from "../view/images/common/icons/menu-user_rank.png";
import user_rank_selected from "../view/images/common/icons/menu-user_rank_selected.png";
import menu_op_analysis from "../view/images/common/icons/menu_op_analysis.png"
import menu_op_analysis_selected from "../view/images/common/icons/menu_op_analysis_selected.png"
import user_support from "../view/images/common/icons/ic-support.png";
import user_support_selected from "../view/images/common/icons/ic-support_selected.png";

const Managenav = (props) => {
  const { data: userInfo, error } = useSWR(
    ["/FindUserDetails", getCookie("boshow_token")],
    fetchWithToken
  );

  let sidebar_menu = [];
  if (props.mode === "editing") {
    sidebar_menu = [
      {
        id: 1,
        type: "main",
        menu: "동영상",
        image: video,
        image_selected: video_selected,
        link: "/video_add",
        tier: 1,
      },
      { id: 2, type: "sub", menu: "동영상 등록", link: "/video_add", tier: 1 },
      { id: 3, type: "sub", menu: "동영상 관리", link: "/video_list", tier: 1 },
      {
        id: 4,
        type: "main",
        menu: "상품",
        image: item,
        image_selected: item_selected,
        link: "/item_add",
        tier: 1,
      },
      { id: 5, type: "sub", menu: "상품 등록", link: "/item_add", tier: 1 },
      { id: 6, type: "sub", menu: "상품 관리", link: "/item_list", tier: 1 },
      {
        id: 7,
        type: "main",
        menu: "AI",
        image_selected: ai_make_selected,
        image: ai_make,
        link: "/ai_make",
        tier: 1,
      },
      { id: 8, type: "sub", menu: "AI Matching", link: "/ai_make", tier: 1 },
      { id: 9, type: "sub", menu: "AI Edit", link: "/ai_faiss", tier: 1 },
      { id: 10, type: "sub", menu: "AI TC fix", link: "/ai_tc_fix", tier: 1 },
      { id: 11, type: "sub", menu: "설정", link: "/ai_setting", tier: 1 },

      {
        id: 8,
        type: "main",
        menu: "광고",
        image: advertising,
        image_selected: advertising_selected,
        link: "/advertising_add",
        tier: 1,
      },
      {
        id: 9,
        type: "sub",
        menu: "광고 등록",
        link: "/advertising_add",
        tier: 1,
      },
      {
        id: 10,
        type: "sub",
        menu: "광고 관리",
        link: "/advertising_list",
        tier: 1,
      },
    ];
  } else if (props.mode === "operation") {
    sidebar_menu = [
      {
        id: 1,
        type: "main",
        menu: "대시보드",
        image: dashboard,
        image_selected: dashboard_selected,
        link: "/op_dashboard",
        tier: 1,
      },
      {
        id: 2,
        menu: "통계분석",
        image: menu_op_analysis,
        image_selected: menu_op_analysis_selected,
        link: "/op_analysis",
        tier: 1,
      },
      {
        id: 3,
        type: "main",
        menu: "광고",
        image: advertising,
        image_selected: advertising_selected,
        link: "/op_advertising_list",
        tier: 1,
      },
      {
        id: 4,
        type: "main",
        image: video,
        image_selected: video_selected,
        menu: "동영상 검수",
        link: "/op_video_check",
        tier: 1,
      },
      {
        id: 5,
        type: "main",
        image: user_rank,
        image_selected: user_rank_selected,
        menu: "관리",
        link: "/op_user_rank",
        tier: 2,
      },
      { id: 6, type: "sub", menu: "권한 설정", link: "/op_user_rank", tier: 2 },
      { id: 7, type: "sub", menu: "활동기록", link: "/op_user_log", tier: 2 },
    ];
  }
  let sidebar_user_support_menu = [
    // {
    //   id: 1,
    //   menu: "사이트맵",
    //   image: sitemap,
    //   link: "/",
    //   mode: props.mode,
    // },
    // {
    //   id: 2,
    //   menu: "설정",
    //   image: settings,
    //   image_selected: settings_selected,
    //   link: "/user_settings",
    //   mode: props.mode,
    // },
    // {
    //   id: 3,
    //   menu: "고객지원",
    //   image: user_support,
    //   image_selected: user_support_selected,
    //   link: "/customer_support",
    //   mode: props.mode,
    // },
  ];

  const sidebar_menu_list = sidebar_menu.map((menu) => (
    <>
      {console.log(menu.tier)}
      <li
        key={menu.id}
        className={
          //tier check
          menu.tier <= (userInfo && userInfo.tier)
            ? menu.menu === props.menu
              ? menu.type + " main_selected"
              : menu.menu === props.sub_menu
              ? menu.type + " sub_selected"
              : menu.type
            : //권한이 없으면 가려짐
              "hide"
        }
      >
        <img
          src={menu.menu === props.menu ? menu.image_selected : menu.image}
          alt=""
        />
        <Link to={menu.link}>{menu.menu}</Link>
      </li>
    </>
  ));

  const sidebar_user_support_list = sidebar_user_support_menu.map((menu) => (
    <>
      <li
        key={menu.id}
        className={
          menu.menu === props.menu
            ? "main_selected"
            : // sub_menu 없어서 주석 처리(해제할 경우 AI>설정 페이지와 CSS 겹침)
              // : menu.menu === props.sub_menu
              // ? "sub_selected"
              ""
        }
      >
        <img
          className={
            menu.menu === props.menu
              ? "main_selectedIMG"
              : menu.menu === props.sub_menu
              ? "sub_selectedIMG"
              : ""
          }
          src={menu.menu === props.menu ? menu.image_selected : menu.image}
          alt=""
        />
        {menu.menu == "사이트맵" ? (
          <a href="https://www.boshow.co.kr/">{menu.menu}</a>
        ) : (
          <Link to={{ pathname: menu.link, state: { mode: menu.mode } }}>
            {menu.menu}
          </Link>
        )}
      </li>
    </>
  ));

  return (
    <div className="sidebar">
      <ul>{sidebar_menu_list}</ul>
      <ul className="user_support">{sidebar_user_support_list}</ul>
    </div>
  );
};

export default Managenav;
