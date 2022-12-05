import React, { Component, useRef } from "react";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import axios from "axios";
import no_img from "../../images/common/no_item.png";
import add_A_type_sample from "../../images/common/add_A_type_sample.png";
import DropZone from "react-dropzone";

class AdvertisingAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      brand: "",
      adb_agency: "",
      tag: "",
      description: "",
      url: "",
      type_list: ["A타입", "B타입", "C타입", "D타입"],
      view: [""],
      type: "A타입",
      selected_type: "A타입",
      image: null,
      image_file: null,
      image_preview_file: no_img,
    };
    this.onDrop = (files) => {
      this.setState({
        image: files[0],
        image_file: null,
        image_preview_file: no_img,
      });
      let render = new FileReader();
      let file = files[0];
      render.onloadend = () => {
        file = render.result;
        this.setState({
          image_file: render.result,
        });
      };
      render.readAsDataURL(file);
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.advertising_fileInput = React.createRef();
  }

  componentDidMount() {
    axios
      .get("/AdbApi", null, { headers: { "content-type": "application/json" } })
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            posts: response.data,
          });
        }
      });
  }

  handleFileOnChange = (event) => {
    event.preventDefault();

    this.setState({
      image: event.target.files[0],
    });

    let render = new FileReader();
    let file = event.target.files[0];
    render.onloadend = () => {
      file = render.result;
      this.setState({
        image_file: render.result,
      });
    };
    render.readAsDataURL(file);
  };

  handleClick(e, type) {
    var view = [];
    this.setState({
      selected_type: type,
    });
    this.setState({
      type: type,
      view: view,
    });

    if (type === 0 || type === 2) {
      this.setState({
        tag: "",
      });
    }
    switch (type) {
      case "A타입":
        this.setState({
          type_num: 0,
        });
      case "B타입":
        this.setState({
          type_num: 1,
        });
      case "C타입":
        this.setState({
          type_num: 2,
        });
      case "D타입":
        this.setState({
          type_num: 3,
        });
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    if (!this.state.image) {
      alert("이미지가 없습니다.");
      return false;
    } else if (!this.state.name) {
      alert("이름을 입력해주세요.");
      return false;
    } else if (!this.state.brand) {
      alert("브랜드를 입력해주세요.");
      return false;
    } else if (!this.state.adb_agency) {
      alert("광고사를 입력해주세요.");
      return false;
    } else if (!this.state.url) {
      alert("광고 url을 입력해주세요.");
      return false;
    }

    var formData = new FormData();
    var type = 0;
    switch (this.state.type) {
      case "A타입":
        type = 0;
        break;
      case "B타입":
        type = 1;
        break;
      case "C타입":
        type = 2;
        break;
      case "D타입":
        type = 3;
        break;
    }
    formData.append("file", this.state.image);
    formData.append("type", type);
    formData.append("name", this.state.name);
    formData.append("brand", this.state.brand);
    formData.append("adb_agency", this.state.adb_agency);
    formData.append("description", this.state.description);
    formData.append("url", this.state.url);

    if (type === 1 || type === 3) {
      let tags = this.state.tag.replace(/(\s*)/g, "");
      tags = tags.split("#");

      if (tags.length === 1 && tags[0] !== "") {
        return alert("태그를 #으로 구분하여 입력해주세요 \n ex)#옷 #바지");
      }
      tags.splice(0, 1);
      formData.append("tag", tags);
    } else {
      formData.append("tag", "");
    }

    axios({
      method: "post",
      url: "/AdbApi",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        if (response.status == 200) {
          alert("광고 등록에 성공하셨습니다.");
          window.location.reload(); //새로고침;
          // this.props.history.push('/advertising_list')
        }
      })
      .catch((Error) => {
        console.log(Error);
        alert("광고 등록에 실패하셨습니다.");
        alert("광고 이름은 상품명과 같아야합니다.");
      });
  }

  render() {
    const item = this.state.type_list.map((type, index) => {
      return (
        <button
          type="button"
          className={type == this.state.type ? "selected adb_type" : "adb_type"}
          key={index}
          onClick={(e) => this.handleClick(e, type)}
        >
          {type}
        </button>
      );
    });
    // const Atype = <div className="A_type_advertise">wqfmwqjfiowqhfwqfu</div>
    return (
      <>
        <Header mode="editing"></Header>
        <Managenav mode="editing" menu="광고" sub_menu="광고 등록"></Managenav>
        <section className="content">
          <h1 className="title">
            광고 등록
            <span>Boshow 플레이어 광고영역을 설정해보세요!</span>
          </h1>
          <div className="advertising_add">
            <div className="advertising_add_type">
              {item}
              <button type="submit" onClick={this.handleSubmit}>
                완료
              </button>
            </div>
            <div className="advertising_add_main">
              <ul className="advertising_add_main_list">
                <li>광고 이미지</li>
                <li>
                  <DropZone className="dropZone" onDrop={this.onDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps({ className: "dropzone" })}>
                        <input
                          accept="image/jpg,image/png,image/jpeg,image/gif"
                          name="img"
                          {...getInputProps()}
                          multiple={false}
                        />
                        <img
                          src={
                            this.state.image_file !== null
                              ? this.state.image_file
                              : this.state.image_preview_file
                          }
                          className="advertising_add_image"
                        ></img>
                      </div>
                    )}
                  </DropZone>
                  {/* <label>
                                        <img src={this.state.image_file} className="advertising_add_image"></img>
                                        <input type="file" accept="image/jpg,image/png,image/jpeg,image/gif" name="img" onChange={this.handleFileOnChange} />
                                    </label> */}
                  {/* {this.state.image_file ?
                                        <label>
                                            <img src={this.state.image_file} className="advertising_add_image"></img>
                                            <input type="file" accept="image/jpg,image/png,image/jpeg,image/gif" name="img" onChange={this.handleFileOnChange} />
                                        </label>
                                        :
                                        <input type="file" accept="image/jpg,image/png,image/jpeg,image/gif" name="img" onChange={this.handleFileOnChange} />
                                    } */}
                </li>
                <li>이름</li>
                <li>
                  <input
                    type="text"
                    name="name"
                    onChange={this.handleChange}
                    maxLength={12}
                    placeholder="공백 제외 최대 12자 이내로 입력해주세요"
                  />
                </li>
                {this.state.type === "B타입" || this.state.type === "D타입" ? (
                  <>
                    <li>태그</li>
                    <li>
                      <input
                        type="text"
                        name="tag"
                        onChange={this.handleChange}
                        placeholder="#태그 #태그"
                      />
                    </li>
                  </>
                ) : null}
                <li>브랜드</li>
                <li>
                  <input
                    type="text"
                    name="brand"
                    onChange={this.handleChange}
                    maxLength={10}
                    placeholder="공백 제외 최대 10자 이내로 입력해주세요"
                  />
                </li>
                <li>광고사</li>
                <li>
                  <input
                    type="text"
                    name="adb_agency"
                    onChange={this.handleChange}
                    maxLength={10}
                    placeholder="공백 제외 최대 10자 이내로 입력해주세요"
                  />
                </li>
                <li>설명</li>
                <li>
                  <textarea
                    type="text"
                    name="description"
                    onChange={this.handleChange}
                    maxLength={50}
                    placeholder="공백 제외 최대 50자 이내로 입력해주세요"
                  />
                </li>
                <li>광고 URL</li>
                <li>
                  <input
                    type="text"
                    name="url"
                    onChange={this.handleChange}
                    placeholder="URL을 입력해주세요"
                  />
                </li>
              </ul>
              <div className="advertising_add_main_section">
                <ul>
                  <li>미리보기 화면</li>
                </ul>
                <div className="preview">
                  {this.state.selected_type == "A타입" ? (
                    <>
                      {this.state.image_file ? (
                        <img
                          src={this.state.image_file}
                          className="A_type_sample"
                        />
                      ) : (
                        <img
                          src={add_A_type_sample}
                          className="A_type_sample"
                        />
                      )}
                      <div className="A_type_side">
                        <span className="A_type_side_mini"></span>
                      </div>
                    </>
                  ) : null}
                  {this.state.selected_type == "B타입" ? (
                    <div className="B_type_advertise">
                      <span className="B_type_side_mini"></span>
                      <div>
                        <img src={no_img} />
                        <div className="B_type_hash_tag">
                              <button type="button">
                                {this.state.tag.split("#")[1]
                                  ? "#" + this.state.tag.split("#")[1]
                                  : "#태그"}
                              </button>
                              <button type="button">
                                {this.state.tag.split("#")[2]
                                  ? "#" + this.state.tag.split("#")[2]
                                  : "#태그"}
                              </button>
                        </div>
                        <ul className="B_type_info">
                          <li>
                            {this.state.name ? this.state.name : "상품명"}
                          </li>
                          <li>
                            {this.state.price ? this.state.price : "판매가"}
                          </li>
                          <li>
                            {this.state.description
                              ? this.state.description
                              : "상품특징"}
                          </li>
                        </ul>
                        <ul className="B_type_btn" style={{marginBottom:"10px"}}>
                          <li>
                            <button type="button">바로 구매하기</button>
                          </li>
                          <li>
                            <button type="button">자세히 보기</button>
                            <button type="button">♡</button>
                          </li>
                        </ul>
                      </div>
                      <div className="B_type_add">
                        {this.state.image_file ? (
                          <img src={this.state.image_file} />
                        ) : (
                          "B타입"
                        )}
                      </div>
                    </div>
                  ) : null}
                  {this.state.selected_type == "C타입" ? (
                    <div className="C_type_advertise">
                      <span className="C_type_side_mini"></span>
                      <div>
                        {this.state.image_file ? (
                          <img src={this.state.image_file} />
                        ) : (
                          <img src={no_img} />
                        )}

                        <ul className="C_type_btn">
                          <li>
                            <button type="button">자세히 보기</button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : null}
                  {this.state.selected_type == "D타입" ? (
                    <>
                      <div className="D_type_advertise">
                        <li>
                          <button>
                            {this.state.image_file ? (
                              <img src={this.state.image_file} />
                            ) : (
                              <img src={no_img} />
                            )}
                            <div className="D_type_hash_tag">
                              <button type="button">
                                {this.state.tag.split("#")[1]
                                  ? "#" + this.state.tag.split("#")[1]
                                  : "#태그"}
                              </button>
                              <button type="button">
                                {this.state.tag.split("#")[2]
                                  ? "#" + this.state.tag.split("#")[2]
                                  : "#태그"}
                              </button>
                            </div>
                            <div>
                              {this.state.name ? this.state.name : "상품명"}
                            </div>
                          </button>
                        </li>
                        <li>
                          <button>
                            <img src={no_img}></img>
                            <div className="D_type_hash_tag">
                              <button type="button">#태그</button>
                              <button type="button">#태그</button>
                            </div>
                            <div>상품명</div>
                          </button>
                        </li>
                        <li>
                          <button>
                            <img src={no_img}></img>
                            <div className="D_type_hash_tag">
                              <button type="button">#태그</button>
                              <button type="button">#태그</button>
                            </div>
                            <div>상품명</div>
                          </button>
                        </li>
                        <li>
                          <button>
                            <img src={no_img} />
                            <div className="D_type_hash_tag">
                              <button type="button">#태그</button>
                              <button type="button">#태그</button>
                            </div>
                            <div>상품명</div>
                          </button>
                        </li>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default AdvertisingAdd;
