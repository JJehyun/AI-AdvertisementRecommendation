import React, { useState, useEffect } from "react";



const ItemModal =({modal,events})=>{
    return(
<>
    <div className="video_update">
          <h1>
            상품 정보
            <button
              type="button"
              onClick={events}
            >
              X
            </button>
          </h1>
          <img
            src={
              `${process.env.REACT_APP_BACKEND_HOST}static/item_image/` +
              modal.idx +
              "/item_1.jpg"
            }
            alt=""
            width="250"
            className="video_list_image"
          />

          <ul>
            <li>상품명</li>
            <li>
              <input
                type="text"
                name="update_title"
                value={modal.title}
                readOnly
              />
            </li>
            <li>판매가</li>
            <li>
              <input
                type="text"
                name="update_price"
                value={modal.price}
                readOnly
              />
            </li>
            <li>상품특징</li>
            <li>
              <input
                type="text"
                name="update_description"
                value={modal.description}
                readOnly
              />
            </li>
            <li>URL</li>
            <li>
              <input type="text" name="update_url" value={modal.url} readOnly />
            </li>
            {/* <li>카테고리</li> */}
            {/* <li>
                                <input type="text" name="update_category" onChange={this.handleChange}/> */}
            {/* value={this.state.update_category} */}
            {/* </li> */}
            <li>상품 태그</li>
            <li>
              <input
                type="text"
                name="update_tag"
                placeholder="#태그 #태그"
                readOnly
              />
              {/* value={this.state.update_tag} */}
            </li>
            <li>날짜</li>
            <li>
              <input
                type="text"
                name="upload_time"
                value={modal.upload_time}
                readOnly
              />
            </li>
          </ul>
        </div>
</>
    );
}
export default ItemModal;
