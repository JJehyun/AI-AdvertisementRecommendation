import React, { Component } from "react";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import axios from "axios";
import Dropzone from "react-dropzone";
import ScaleLoader from "react-spinners/ScaleLoader";
import BeatLoader from "react-spinners/BeatLoader"
import jwt_decode from 'jwt-decode';
import { connect } from 'react-redux'
import { settingDuration } from "../../components/common"

import ic_video_upload from "../../images/common/icons/ic_video_upload.png";
import ic_video_upload_selected from "../../images/common/icons/ic_video_upload_selected.png";
import ic_video_link_search from "../../images/common/icons/ic_video_link_search.png";
import ic_video_achive_search_selected from "../../images/common/icons/ic_video_achive_search_selected.png";
import ic_video_achive_search from "../../images/common/icons/ic_video_achive_search.png";
import ic_video_link_search_selected from "../../images/common/icons/ic_video_link_search_selected.png";
import EditSearchModal from "./edit_search_modal.js";
import uploadImage from "../../images/common/icons/ic_upload.png"

import ic_video from "../../images/common/ic_video.png";
import ic_sbsGolf from "../../images/common/ic_sbsGolf.png";
import ic_sbsGolf_selected from "../../images/common/ic_sbsGolf_selected.png";
import ic_youtube from "../../images/common/ic_youtube.png";
import ic_youtube_selected from "../../images/common/ic_youtube_selected.png";
import no_image from "../../images/common/no_video.png"
import { getCookie, setCookie } from "../user/cookies.js";

class VideoAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      upload_type: 1,
      description: "",
      explanation: "",
      tag: "",
      duration: "",
      platform: "",
      url: "",
      category: "",
      searchLink: "",
      searchActive: "",
      youtubeList: "",
      loading: false,
      submitLoading: false,
      thumbnail: "",
      videoThumnail: "",
      NoneSearch: false,
      videoUrl: "",
      directlyUploadOpen: false,
      linkOpen: false,
      archaiveOpen: false,
      placementSbsGolf: false,
      placementYoutube: false,
      files: undefined,
      token: getCookie("boshow_token"),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    this.checkToken();
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (name === "tag") {
      const tagStr = value;
      const tags = tagStr.split('#');
      const tagsLength = tags.length - 1;

      for (let i = 1; tagsLength >= i; i++) {
        if (tags[i].length > 4) {
          tags[i] = tags[i].slice(0, 4)
        }
      }

      this.setState({
        tag: tags.join('#')
      })
      return;
    }
    this.setState({
      [name]: value,
    });
  }

  async handleSubmit() {
    let tags = this.state.tag.replace(/(\s*)/g, "");
    tags = tags.split("#");

    // if(this.state.files == ''){
    //     alert('???????????? ????????????')
    //     return false;
    // }else
    if (this.state.title == "") {
      return alert("????????? ??????????????????");
    } else if (tags.length === 1 && tags[0] !== "") {
      return alert("????????? #?????? ???????????? ?????????????????? \n ex)#??? #??????");
    } else if (this.state.category == "") {
      return alert("????????? ??????????????????");
    }
    tags.splice(0, 1);

    this.setState({
      submitLoading: true
    })

    let duration = this.state.duration.split(":");
    if (this.state.files) {
      let video_type = this.state.files.name.split(".");
      let url = video_type[video_type.length - 1];
      await this.setState({
        url: url,
      });
    }

    if (duration.length === 3) {
      duration =
        parseInt(duration[0]) * 3600 +
        parseInt(duration[1]) * 60 +
        parseInt(duration[2]);
    } else if (duration.length === 2) {
      duration = parseInt(duration[0]) * 60 + parseInt(duration[1]);
    }

    // image ????????? ?????? formdata??? ????????? ??????
    let formData = new FormData();
    formData.append("files", this.state.files);
    formData.append("title", this.state.title);
    formData.append("description", this.state.description);
    formData.append("explanation", this.state.explanation);
    formData.append("tag", tags);
    formData.append("duration", duration);
    formData.append("platform", this.state.platform);
    formData.append("url", this.state.url);
    formData.append("thumbnail", this.state.thumbnail);
    formData.append("category", this.state.category);
    formData.append("boshow_token", this.state.token);

    axios({
      method: "post",
      url: "/VideoApi",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(async (response) => {
      if (response.status === 200) {
        await alert("????????? ?????? ???????????????.");
        this.setState({
          submitLoading: false
        });
        window.location.reload();
      } else {
        return false;
      }
    }, this.props.history.push("/video_list"));
  }

  fileReader = async (video) => {
    let videoURLs = "";
    let file = video;
    let reader = new FileReader();

    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        videoURLs = await reader.result;
        resolve(videoURLs);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    })
  };

  audioReader = async (audio) => {
    let duration = "";
    let reader = new Audio(audio);

    return new Promise((resolve, reject) => {
      reader.onloadedmetadata = async () => {
        duration = await reader.duration;
        resolve(duration);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    })
  }

  async handleFileChange(event, isDrop) {
    if (!isDrop) {
      await this.setState({
        files: event.target.files[0],
      });
    }
    else {
      await this.setState({
        files: event[0]
      })
    }

    const fileBase64 = await this.fileReader(this.state.files);
    const duration = settingDuration(await this.audioReader(fileBase64));

    if (this.state.files) {
      let video_type = this.state.files.name.split(".");
      video_type = video_type[video_type.length - 1];
      const video_title = this.state.files.name.split("." + video_type)[0];
      this.setState({
        title: video_title,
        platform: "?????? ?????????",
        explanation: "",
        duration: duration,
        url: "",
        tag: "",
        thumbnail: "",
        videoThumnail: fileBase64,
        category: "",
      });

    }

    this.closeModal();
  }

  directlyUploadOpen() {
    this.setState({ directlyUploadOpen: true, upload_type: 1 });
  }

  searchLinkOpen() {
    this.setState({ linkOpen: true, upload_type: 2 });
  }

  searchArchaiveOpen() {
    this.setState({ archaiveOpen: true, upload_type: 3 });
  }

  closeModal = () => {
    this.setState({
      directlyUploadOpen: false,
      linkOpen: false,
      archaiveOpen: false,
      link: "",
      searchLink: "",
      NoneSearch: false,
      searchActive: "",
    });
  };

  checkToken = () => {
    const token = getCookie('boshow_token');
    const decodeToken = jwt_decode(token);
    const expConvertDate = new Date(decodeToken.exp * 1000);
    const currentTime = new Date();
    const calc = ((expConvertDate.getTime() - currentTime.getTime()) / 1000 / 60);
    
      if(token){
        const formData = new FormData()
        formData.append('token', token);

        if(calc <= 5 && calc > -1) {
        axios.post('/Auth', formData)
        .then((response) => {
          setCookie('boshow_token', response.data);
          if(response.data.status === 500){
            alert('?????? ???????????? ??????????????????. ????????? ????????? ?????????????????? ??????????????? ????????????')
          }
        })
        .catch((err) => {
          console.log(err)
        })
      }
    }
  }

  VideoSearch(searchLink, e) {
    e.preventDefault();
    this.setState({ NoneSearch: false, loading: true });
    String.prototype.toHHMMSS = function () {
      let sec_num = parseInt(this, 10);
      let hours = Math.floor(sec_num / 3600);
      let minutes = Math.floor((sec_num - hours * 3600) / 60);
      let seconds = sec_num - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      return hours + ":" + minutes + ":" + seconds;
    };

    let link,
      video_search_id,
      playtime,
      length,
      formattedLength,
      title,
      thumbnail;
    const search = searchLink;
    try {
      if (search.indexOf("sbs") !== -1) {
        const params = new URLSearchParams(search);
        video_search_id = search.slice(-11);
        let token = "";
        axios
          .get("/MakeSbsToken", null, {
            headers: { "content-type": "application/json" },
          })
          .then((response) => {
            if (response.status == 200) {
              token = response.data.token;
            }
          });
        let SBS_video_id = video_search_id;
        axios
          .get(
            "http://apis.sbs.co.kr/play-api/ad-admin/1.0/boshow/media/" +
            SBS_video_id +
            "?pnw-token=" +
            token,
            {
              headers: { "content-type": "application/json" },
            }
          )
          .then(function (response) {
            if (response.status == 200) {
              playtime = response.data.playtime;
              length = response.data.playtime;
              link = response.data.mediaurl;
              thumbnail = response.data.thumbnail.medium;
              console.log(response.data);
            } else if (response.status == 404) {
              alert("????????? ????????? ?????? ????????????.");
            } else if (response.status == 500) {
              alert("????????? ???????????? ????????????.");
            }
          });

        length = length.toFixed();
        formattedLength = length.toHHMMSS();
        console.log(formattedLength);
        this.setState({
          link: link,
          formattedLength: formattedLength,
          platform_id: "SBS",
          thumbnail_image: thumbnail,
          video_url: search,
          NoneSearch: true,
          loading: false,
        });
      } else if (search.indexOf("youtube") !== -1) {
        console.log("youtube");
        video_search_id = search.slice(-11);
        this.dataYoutube = {
          youtube_link: video_search_id,
          searchMode: "link",
        };
        axios
          .post(
            "/YoutubeSearchApi",
            null,
            { params: this.dataYoutube },
            { headers: { "content-type": "application/json" } }
          )
          .then((response) => {
            var minutes = parseInt(response.data / 60);
            var seconds = parseInt(response.data % 60);
            this.setState({
              link: "https://www.youtube.com/embed/" + String(video_search_id),
              formattedLength: minutes + ":" + seconds,
              platform_id: "YOUTUBE",
              thumbnail_image:
                "https://img.youtube.com/vi/" +
                String(video_search_id) +
                "/hqdefault.jpg",
              video_url:
                "https://www.youtube.com/watch?v=" + String(video_search_id),
              NoneSearch: true,
              loading: false
            });
          });
      }
    } catch {
      alert("????????? ??????????????????");
    }
  }

  loadVideoInfo = (video, e) => {
    e.preventDefault();
    console.log(video.duration);
    this.setState({
      title: "",
      url: video.video_url,
      platform: video.platform_id,
      duration: video.formattedLength,
      thumbnail: video.thumbnail_image,
      files: "",
    });
    this.closeModal();
  };

  loadYouVideoInfo = (video, e) => {
    e.preventDefault();
    console.log(video);
    var duration = "";
    var beforeStr = String(video.duration);
    var afterStr = beforeStr.split(":")
    switch (afterStr.length) {
      case 1:
        duration = "00:00:" + String(afterStr[0]).padStart(2, "0");
        break;
      case 2:
        duration =
          "00:" +
          String(afterStr[0]).padStart(2, "0") +
          ":" +
          String(afterStr[1]).padStart(2, "0");
        break;
      case 3:
        duration =
          String(afterStr[0]).padStart(2, "0") +
          ":" +
          String(afterStr[1]).padStart(2, "0") +
          ":" +
          String(afterStr[2]).padStart(2, "0");
        break;
    }
    this.setState({
      title: video.title,
      url: video.link,
      platform: "YOUTUBE",
      duration: duration,
      thumbnail: video.thumbnails[1],
      files: "",
    });
    this.closeModal();
  };

  VideoArSearch = (searchTitle, e) => {
    if (this.state.placementYoutube) {
      e.preventDefault();
      this.setState({ NoneSearch: false, loading: true });
      this.dataYoutube = { youtube_title: searchTitle, searchMode: "Ac" };
      axios
        .post(
          "/YoutubeSearchApi",
          null,
          { params: this.dataYoutube },
          { headers: { "content-type": "application/json" } }
        )
        .then((response) => {
          this.setState({ youtubeList: response.data, NoneSearch: true, loading: false });
        });
    } else {
      alert("SBS ????????? ?????? ???????????? ????????????.");
    }
  };

  inputFromHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    let youtube_table_list = "";
    if (this.state.youtubeList !== "") {
      youtube_table_list = this.state.youtubeList.map((menu) => (
        <tr key={menu.index} onClick={this.loadYouVideoInfo.bind(this, menu)}>
          <td>
            <img
              src={menu.thumbnails[1]}
              alt=""
              className="video_list_image"
              style={{ width: "231px", height: "135px" }}
            />
          </td>
          <td>
            <p>{menu.channel}</p>
            <p>{menu.title}</p>
            <p>
              ????????? {menu.views}??? {menu.publishTime}
            </p>
          </td>
        </tr>
      ));
    }

    const imageVideoRendering = () => {
      if (this.state.thumbnail) {
        return (<img src={this.state.thumbnail} className="image_video_add" alt="video_thumnail" />)
      }
      else if (this.state.videoThumnail) {
        return (<video src={this.state.videoThumnail} className="image_video_add" alt="video_thumnail" />)
      }
    }

    return (
      <>
        <Header mode="editing" />
        <Managenav
          mode="editing"
          menu="?????????"
          sub_menu="????????? ??????"
        />
        <section className="content">
          <h1 className="title">????????? ??????</h1>
          <div className="video_add">
            <div className="video_add_type">
              <button
                type="button"
                className={this.state.upload_type == 1 && "selected"}
                onClick={this.directlyUploadOpen.bind(this)}
              >
                <img
                  src={
                    this.state.upload_type == 1
                      ? ic_video_upload_selected
                      : ic_video_upload
                  }
                />
                ?????? ?????????
              </button>
              <button
                type="button"
                className={this.state.upload_type == 2 && "selected"}
                onClick={this.searchLinkOpen.bind(this)}
              >
                <img
                  src={
                    this.state.upload_type == 2
                      ? ic_video_link_search_selected
                      : ic_video_link_search
                  }
                  style={{marginTop:"4px", marginBottom:"4px"}}
                />
                ?????? ??????
              </button>
              <button
                type="button"
                className={this.state.upload_type == 3 && "selected"}
                onClick={this.searchArchaiveOpen.bind(this)}
              >
                <img
                  alt=""
                  src={
                    this.state.upload_type == 3
                      ? ic_video_achive_search_selected
                      : ic_video_achive_search
                  }
                />
                ???????????? ??????
              </button>
            </div>
            <div className="video_add_section">
              <div className="video_add-left">
                <div>????????? ????????? ?????????</div>
                <div>
                  {this.state.files ? (
                    <div className="no_image_video_add directly_video">
                      ???????????? ?????? ?????????????????????.
                    </div>
                  ) : (
                    <Dropzone noClick maxFiles={1} onDrop={e => this.handleFileChange(e, true)}>
                      {({ getRootProps, getInputProps }) => (
                        <div
                          {...getRootProps()}>
                          <input {...getInputProps()} />
                          <div className="no_image_video_add" style={{
                            width: '100%',
                            minHeight: '280px',
                            marginTop: '17px',
                            background: 'no-repeat 100% 100%',
                            backgroundImage: `url(${no_image})`,
                            border: '1px solid #c3c3c3',
                            textAlign: 'center',
                            lineHeight: 1.7,
                          }}>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                  )}
                  {imageVideoRendering()}
                </div>
              </div>
              <div className="video_add-right">
                <table>
                  <colgroup>
                    <col width="93px" />
                    <col width="165px" />
                    <col width="235px" />
                    <col width="113px" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>??????</th>
                      <td colSpan="2">
                        <input
                          type="text"
                          name="title"
                          maxLength={48}
                          value={this.state.title}
                          onChange={this.handleChange}
                        />
                      </td>
                      <td className="video_add_table_title_advise">
                        <span>
                          (<span>{this.state.title.length}</span>/48)
                        </span>
                        <span>*????????????</span>
                      </td>
                    </tr>
                    <tr>
                      <th>??????</th>
                      <td colSpan="2">
                        <textarea
                          className="video_add_explanation"
                          name="description"
                          maxLength={512}
                          value={this.state.description}
                          onChange={this.handleChange}
                          placeholder="????????? ?????? ????????? ?????????, ?????? PD ??? ????????????????????????! (????????? ???????????? ????????? ??????, ????????? ???????????????.)"
                        />
                      </td>
                      <td />
                    </tr>
                    <tr>
                      <th>??????</th>
                      <td colSpan="2">
                        <input
                          type="text"
                          name="tag"
                          value={this.state.tag}
                          onChange={this.handleChange}
                          placeholder="?????? ??? ?????? 4??? ????????? ??????????????????"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>URL</th>
                      <td colSpan="2">
                        <input
                          type="text"
                          name="url"
                          value={this.state.url}
                          onChange={this.handleChange}
                          placeholder={
                            this.state.files
                              ? "?????? ????????? ????????? url??? ???????????? ??? ????????????"
                              : "?????? ????????? ?????? ????????? ???????????? ???????????? ??????????????????"
                          }
                          readOnly="readonly"
                        />
                      </td>
                      <td/>
                    </tr>
                    <tr>
                      <th>??????</th>
                      <td>
                        {/*readOnly={this.state.files ? null : "readonly"}*/}
                        <input
                          readOnly="readonly"
                          type="text"
                          name="duration"
                          value={this.state.duration}
                          onChange={this.handleChange}
                          placeholder={
                            this.state.files
                              ? "????????? ???????????? ???????????????."
                              : "00:00:00"
                          }
                        />
                      </td>
                      <td/>
                      <td/>
                    </tr>
                    <tr>
                      <th>?????????</th>
                      <td>
                        <input
                          readOnly
                          type="text"
                          name="platform"
                          value={this.state.platform}
                          onChange={this.handleChange}
                        />
                      </td>
                      <td/>
                      <td/>
                    </tr>
                    <tr>
                      <th>??????</th>
                      <td>
                        <select name="category" onChange={this.handleChange}>
                          <option value="" disabled selected hidden>
                            ???????????? ??????
                          </option>
                          <option value="1">??????</option>
                          <option value="2">?????????/??????</option>
                          <option value="3">?????????</option>
                          <option value="4">??????</option>
                          <option value="5">???????????????</option>
                          <option value="6">??????</option>
                          <option value="0">??????</option>
                        </select>
                      </td>
                      <td/>
                      <td/>
                    </tr>
                  </tbody>
                </table>
                <div>
                  {
                    this.state.submitLoading
                      ?
                      <BeatLoader loading={this.state.submitLoading} color={'#4d20a3'} />
                      :
                      <button type="submit" onClick={this.handleSubmit}>
                        ??????
                      </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
        {this.state.directlyUploadOpen ? (
          <EditSearchModal
            open={this.state.directlyUploadOpen}
            close={this.closeModal}
            header="????????? ?????? ??????"
            type="directly_upload"
          >
            <div>
              <div>
                <div>
                  <Dropzone noClick maxFiles={1} onDrop={e => this.handleFileChange(e, true)}>
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <img src={uploadImage} alt="uploadImage" style={{ fontSize: '3.125rem', marginTop: '0.813rem', color: '#b4b4b4' }} />
                      </div>
                    )}
                  </Dropzone>
                  <p>????????? ??? ?????? ??????</p>
                  <p>??? ?????? ???????????? ?????? ????????????.</p>
                  <label
                    for="video_directly_select_btn"
                    className="file_upload"
                  >
                    ?????? ??????
                  </label>
                  <input
                    type="file"
                    id="video_directly_select_btn"
                    accept="video/mp4,video/x-m4v,video/*"
                    name="directly_upload_video_file"
                    onChange={e => this.handleFileChange(e, false)}
                  />
                </div>
              </div>
            </div>
          </EditSearchModal>
        ) : null}
        {this.state.linkOpen || this.state.archaiveOpen ? (
          <EditSearchModal
            open={this.state.linkOpen || this.state.archaiveOpen}
            close={this.closeModal}
            header={this.state.linkOpen ? "?????? ??????" : "???????????? ??????"}
          >
            <div>
              <main> {this.props.children} </main>
              {/* ???????????? ?????? ????????? ?????? */}
              {this.state.linkOpen ? null : (
                // ???????????? ??????
                <>
                  <div className="placement">
                    <ul>
                      <li>
                        <button
                          disabled
                          style={{ cursor: 'not-allowed' }}
                          type="button"
                          className={
                            this.state.placementSbsGolf
                              ? "Placement-Area sbsGolf selected"
                              : "Placement-Area sbsGolf"
                          }
                          onClick={() =>
                            this.setState({
                              placementSbsGolf: !this.state.placementSbsGolf,
                              placementYoutube: false,
                              youtubeList: "",
                            })
                          }
                        >
                          <img
                            alt=""
                            src={
                              this.state.placementSbsGolf
                                ? ic_sbsGolf_selected
                                : ic_sbsGolf
                            }
                          />
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={
                            this.state.placementYoutube
                              ? "Placement-Area youtube selected"
                              : "Placement-Area youtube"
                          }
                          onClick={() =>
                            this.setState({
                              placementSbsGolf: false,
                              placementYoutube: !this.state.placementYoutube,
                            })
                          }
                        >
                          <img
                            alt=""
                            src={
                              this.state.placementYoutube
                                ? ic_youtube_selected
                                : ic_youtube
                            }
                          />
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
              <div>
                <div className="search">
                  {this.state.linkOpen ? (
                    // ?????? ??????
                    <>
                      <input
                        name="searchLink"
                        type="text"
                        placeholder="????????? ????????? ??????????????????"
                        value={this.state.searchLink}
                        onChange={this.inputFromHandler.bind(this)}
                      />
                      <button
                        type="button"
                        onClick={this.VideoSearch.bind(
                          this,
                          this.state.searchLink
                        )}
                      >
                        ??????
                      </button>
                    </>
                  ) : (
                    // ???????????? ??????
                    <>
                      <input
                        name="searchActive"
                        type="text"
                        placeholder="???????????? ??????????????????"
                        value={this.state.searchActive}
                        onChange={this.inputFromHandler.bind(this)}
                      />
                      <button
                        type="button"
                        onClick={this.VideoArSearch.bind(
                          this,
                          this.state.searchActive
                        )}
                      >
                        ??????
                      </button>
                    </>
                  )}
                </div>
                <div 
                  className="preview"
                  style={this.state.linkOpen ? null : {height:"370px", overflow:"auto"}}
                  >
                  {/* ?????? ??????????????? ?????? */}
                  {this.state.linkOpen ? <p>????????? ?????? ??????</p> : null}
                  <div className={this.state.NoneSearch ? "hide" : "active"}>
                    {this.state.loading
                      ? <ScaleLoader loading={this.state.loading} color={'#4d20a3'} />
                      : <div>
                        <img src={ic_video} />
                        <br />
                        ??????????????? ???????????? ??????????????????
                      </div>
                    }
                  </div>

                  {this.state.linkOpen ? (
                    // ?????? ??????
                    <iframe
                      className={this.state.NoneSearch ? "active" : "hide"}
                      width="710"
                      height="330"
                      src={this.state.link}
                    />
                  ) : (
                    // ???????????? ??????
                    <table
                      className={
                        this.state.NoneSearch ? "youtubeSearchResult" : "hide"
                      }
                    >
                      {youtube_table_list}
                    </table>
                  )}
                </div>
                {/* ?????? ??????????????? ?????? */}
                {this.state.linkOpen ? (
                  <div className="btn_line">
                    <button
                      className={this.state.NoneSearch ? "active" : "hide"}
                      type="button"
                      onClick={this.loadVideoInfo.bind(this, this.state)}
                    >
                      ????????????
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </EditSearchModal>
        ) : null}
      </>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    userId: state.authentication.login.userId
  }
}

export default connect(mapStateToProps)(VideoAdd);
