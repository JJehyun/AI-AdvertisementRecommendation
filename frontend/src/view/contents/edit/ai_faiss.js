import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Header from "../../header.js";
import ManageNav from "../../manage_nav.js";
import VideoContainer from "../../components/video_container.js";
import AiMatchCategory from "./ai_match.js";
import VideoAddCategory from "./video_add_category";
import AiMetadata from "./ai_metaData/ai_metaData.js";
import AiEdit from "./ai_edit.js"


const AiFaiss = (props) => {
  const [detailarr,setdetailarr] = useState([]);
  const [selectitem ,setselectitem] = useState({});
  const [level, setLevel] = useState(1); // 렌더링 컴포넌트 레벨
  const [step, setStep] = useState(null); // 레벨별 렌더링할 컴포넌트
  const [video, setVideo] = useState({}); // 선택한 비디오
  const [data, setData] = useState({}); // 선택된한 항목 데이터(?)
  const [item, setItem] = useState([]);
  const [itemDetail, setItemDetail] = useState([]); //선택한 비디오의 itemdetail
  const [category, setcategory] = useState([false,false,false,false,false,false,false,false,false,false,false,false]); //레벨2에서 선택한 카테고리
  const [levelcheck, setlevelcheck] = useState(false); //레벨3에서 레벨2로 가기 위한 변수
  const [posts,setposts] = useState([{}])
  const [match, setMatch] = useState([{
    imagePath: '',
    imageName: '',
    item: undefined,
  }]); // 상품 매치 결과 데이터
  useEffect(() => {
    if (Object.keys(video).length) {
      // 비디오를 선택하면 다음 버튼 활성화 ('top': [], 'bottom': [], 'skirt': [], 'shoes': [], 'cap': [], 'golfball': [], 'golfbag': [], 'golfclub': [], 'mask': [], 'dress': [], 'coat': [], 'watch': []) 활성화 된 부분은 배열 중 true return됨
      const video_btn = document.getElementById("video_btn");
      try {
        video_btn.className = "";
      } catch {}
    }
  }, [video]);
  useEffect(() => {
    levelStep(); // 레벨이 변경될때 마다 step을 불러옴(렌더링할 컴포넌트 변경)
  }, [level]);
  const prevLevel = () => {
    // 이전 레벨
    setLevel(level - 1);
  };

  const nextLevel = () => {
    // 다음 레벨
    setLevel(level + 1);
  };
  const aieditapi = (array,item) => {
    setdetailarr(array);
    setselectitem(item);
  }
  const getposts =(lists)=>{
    setposts(lists)
  }
  const getcategory = (category) => {
    let arraycate = [...category]; //level 2에서 선택한 카테고리를 category 에 넣어줌
    setcategory(arraycate);
  };
  const LevelCheckfun = (check) => {
    setlevelcheck(check);
  };

  const changeLevel = (level) => {
    // 레벨 클릭 이동
    if (Object.keys(video).length === 0) {
      setLevel(1);
    } else if (level == 3 && levelcheck == true) {
      setLevel(3);
    } else if (level == 4 && detailarr.length == 0) {
      return;}
      else if (level == 4 && posts.length != 0) {
      setLevel(4);
      }else if (level == 5 && detailarr.length == 0) {
      return;}
      else if (level == 5 && posts.length != 0){
      setLevel(5);}
     else {
      setLevel(level);
    }
  };
  const levelStep = () => {
    switch (level) {
      case 1:
        setStep(
          <VideoContainer type="ai" setVideo={setVideo}>
            <button
              id="video_btn"
              className="hide"
              type="button"
              onClick={nextLevel}
            >
              다음
            </button>
          </VideoContainer>
        );
        break;
      case 2:
        setStep(
          <VideoAddCategory
            nextleveltwo={nextLevel}
            GetCateGoryList={getcategory}
            nowcategory={category}
            Levelcheche={LevelCheckfun}
            prevLevel = {prevLevel}
          />
        );
        break;
      case 3:
        setStep(
          <AiMatchCategory
            nextLevel={nextLevel}
            add_data={add_data}
            selectedData={data}
            video={video}
            category={category}
            setItemDetail={setItemDetail}
            setMatch={setMatch}
            prevLevel = {prevLevel}
          />
        );
        break;
      case 4:
        setStep(
          <AiMetadata 
            aieditapi={aieditapi}
            nextLevel={nextLevel}
            category={category}
            video={video}
            itemDetail={itemDetail}
            setItemDetail={setItemDetail}
            item={item}
            match={match}
            setMatch={setMatch}
            prevLevel = {prevLevel}
            getposts = {getposts}
            postss={posts}
           />
      );
        break;
        case 5:
          setStep(
            <AiEdit 
                  video={video} 
                  item={selectitem} 
                  itemDetail={detailarr}
             />
        );
          break;
      default:
        setStep(<AiFaiss />);
        break;
    }
  };
  
  const add_data = (item) => {
    setData(item);
  };

  return (
    <div>
      <Header mode="editing"></Header>
      <ManageNav mode="editing" menu="AI" sub_menu="AI Edit"></ManageNav>
      <section className="content make_ai">
        <h1 className="title">
          AI Edit
          <span>등록한 동영상과 상품을 선택하여 AI데이터를 연결해보세요!</span>
        </h1>
        <ul className="faiss_ai_level">
          <li
            onClick={() => changeLevel(1)}
            className={level === 1 ? "selected" : ""}
          >
            동영상 선택
          </li>
          <li
            onClick={() => {
              changeLevel(2);
            }}
            className={level === 2 ? "selected" : ""}
          >
            AI 범주 지정
          </li>
          <li
            onClick={() => changeLevel(3)}
            className={level === 3 ? "selected" : ""}
          >
            AI 매치
          </li>
          <li 
          onClick={() => changeLevel(4)}
          className={level === 4 ? "selected" : ""}>메타데이터 연결</li>
          <li 
          onClick={() => changeLevel(5)}
          className={level === 5 ? "selected" : ""}>AI 편집</li>
        </ul>
        {step}
      </section>
    </div>
  );
};

export default withRouter(AiFaiss);