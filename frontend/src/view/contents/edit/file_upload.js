import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { FiUpload } from 'react-icons/fi';

import item_image_select from "../../images/common/item_image_select.png";
import uploadImage from "../../images/common/icons/ic_upload.png"

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // files_DnD: [],
      files: this.props.files,
      image_preview: this.props.previewUrl,
    };
    // this.onDrop = (files) => {
    //     console.log(files[0].name)
    //     this.setState({files: files[0]});
    // }
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFileChange(event) {
    event.preventDefault();

    let files = this.state.files;
    files[event.target.id] = event.target.files[0];

    let image_preview = this.state.image_preview;

    let reader = new FileReader();
    reader.onloadend = () => {
      image_preview[event.target.id] = reader.result;

      this.setState({
        files: files,
        image_preview: image_preview,
      });
    };
    reader.readAsDataURL(files[event.target.id]);
  }

  handleDrop = (event, inputId) => {
    let files = this.state.files;
    files[inputId] = event[0];

    let image_preview = this.state.image_preview;

    let reader = new FileReader();
    reader.onloadend = () => {
      image_preview[inputId] = reader.result;

      this.setState({
        files: files,
        image_preview: image_preview,
      });
    };
    reader.readAsDataURL(files[inputId]);
    
  }

  handleSubmit() {
    this.props.setFiles(this.state.files);
    this.props.setPreviewUrl(this.state.image_preview);
    // const files = this.state.files;

    // if (Object.keys(files).length > 0) {
    //     let reader = new FileReader();
    //     reader.onloadend = () => {
    //         this.props.setFiles(files);
    //         this.props.setPreviewUrl(reader.result);
    //     };
    //     reader.readAsDataURL(files['file_0']);
    // }
    this.props.handleFile();
  }

  render() {
    let add_file = "";
    let is_file = null;
    if (Object.keys(this.state.files).length === 0) {
      add_file = (
        <>
          <div>
            <Dropzone maxFiles={1} onDrop={e => this.handleDrop(e, "file_0")} noClick={true}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}>
                  <input {...getInputProps()} />
                  <img src={uploadImage} alt="uploadImage" style={{ fontSize: '3.125rem', marginTop: '0.813rem', color: '#b4b4b4' }} />
                </div>
              )}
            </Dropzone>
          </div>
          <p>드래그 앤 드롭</p>
          <p>이 곳에 이미지를 끌어 넣으세요</p>
        </>
      );
      // <DropZone onDrop={this.onDrop}>
      //     {({getRootProps, getInputProps})=>(
      //         <>
      //             <div {...getRootProps({className: 'dropzone'})}>
      //                 <input {...getInputProps()} multiple={false}/>
      //                 <i class="fas fa-upload"></i>
      //             </div>
      //             <p>드래그 앤 드롭</p>
      //             <p>이 곳에 이미지를 끌어 넣으세요</p>
      //             <ul>{this.state.files.name}</ul>
      //         </>
      //     )}
      // </DropZone>
    } else {
      /* add_file = (
        <p className="item_image_select_info">
          <span>등록된 이미지</span>권장사이즈 500px * 500px / 용량 2MB 이하 /
          최대 3장 등록 가능
        </p>
      ); */
     /*  is_file = (
        <>
          <label for="file_1">
            {this.state.image_preview["file_1"] ? (
              <Dropzone maxFiles={1} onDrop={e => this.handleDrop(e, "file_0")}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}>
                  <input {...getInputProps()} />
                  <FiUpload style={{ fontSize: '3.125rem', marginTop: '0.813rem', color: '#b4b4b4' }} />
                </div>
              )}
            </Dropzone>
              
            ) : (
              <img src={item_image_select} />
            )}
          </label>
          <input
            type="file"
            id="file_1"
            accept="image/jpg,image/png,image/jpeg,image/gif"
            name="img"
            onChange={this.handleFileChange}
          />
          <label for="file_2">
            {this.state.image_preview["file_2"] ? (
              <img src={this.state.image_preview["file_2"]} />
            ) : (
              <img src={item_image_select} />
            )}
          </label>
          <input
            type="file"
            id="file_2"
            accept="image/jpg,image/png,image/jpeg,image/gif"
            name="img"
            onChange={this.handleFileChange}
          />
        </>
      ); */
    }
    return (
      <div className="modal">
        <section className="searchModal directly_upload_modal">
          <main>
            <header>
              이미지 등록
              <button className="close" onClick={this.props.handleFile}>
                {" "}
                &times;{" "}
              </button>
            </header>
            <div className="content">
              <div>
                <div>
                  {add_file}
                  <label
                    for="file_0"
                    className={
                      this.state.image_preview["file_0"] ? null : "file_upload"
                    }
                  >
                    {this.state.image_preview["file_0"] ? (
                      <img src={this.state.image_preview["file_0"]} />
                    ) : (
                      "파일 선택"
                    )}
                  </label>
                  <input
                    type="file"
                    id="file_0"
                    accept="image/jpg,image/png,image/jpeg,image/gif"
                    name="img"
                    onChange={this.handleFileChange}
                  />
                  {is_file}
                </div>
                {this.state.image_preview["file_0"] && (
                  <button type="submit" onClick={this.handleSubmit}>
                    저장
                  </button>
                )}
              </div>
            </div>
          </main>
        </section>
      </div>
    );
  }
}

export default FileUpload;
