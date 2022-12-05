import React, { Component } from "react";
import Header from "../../header.js";
import ManageNav from "../../manage_nav.js";
import ItemContainer from "../../components/item_container.js";

class ItemList extends Component {
  render() {
    return (
      <>
        <Header mode="editing"></Header>
        <ManageNav mode="editing" menu="상품" sub_menu="상품 관리"></ManageNav>
        <section className="content">
          <h1 className="title">
            상품 관리
            <span>지금까지 올린 전체 상품을 확인하실 수 있습니다.</span>
          </h1>
          <ItemContainer type="list" />
        </section>
      </>
    );
  }
}

export default ItemList;
