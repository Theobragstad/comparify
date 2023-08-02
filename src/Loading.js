import React from "react";
import "./App.css"

const Loading = (props) => {


  return (
    <div>


{Array.from({ length: props.length }, (_, index) => index).map((index) => (
                <div key={index} className="item">
                  <div
                    className={`primaryImage`}
                    // onClick={() =>
                    //   togglePlayback(`audio-element-modal${index}`)
                    // }
                  >
                    <div className="pImgLoading"></div>
                  </div>

                  <div className="primaryText" style={{ marginRight: "30px" }}>
                    <span className="primaryName">
                      <span className="l2Loading">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </span>
                    <span className="pALoading"></span>

                    <span className="cOSLoading"></span>
                  </div>
                </div>
              ))}
    </div>
  )
};

export default Loading;
