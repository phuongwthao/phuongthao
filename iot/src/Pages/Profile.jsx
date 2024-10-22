import React from "react";
import "./Profile.css";
import ava from "../Assets/avt.jpg";
function Profile() {
  return (
    <div className="profile">
      <div className="contain">
        <div className="column col-md-5">
          <img
            src={ava}
            style={{ height: "380px", paddingRight: "50px" }}
            alt=""
          />
        </div>
        <div className="column col-md-5">
          <div className="row">Lưu Phương Thảo</div>
          <div className="row">B21DCCN684</div>
          <div className="row">0362197282</div>
          <div className="row">
            <a href="https://github.com/phuongwthao">Github</a>
          </div>

          <div className="row">
            <a href="https://grey-astronaut-252918.postman.co/workspace/f81a6362-ad0b-471b-80e9-cc54c6af4094/overview">
              APIdocs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
