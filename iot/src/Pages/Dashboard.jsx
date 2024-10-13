import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import bulbImage from "../Assets/bulb.jpeg";
import fanImage from "../Assets/fan.jpeg";
import airImage from "../Assets/air-conditioner.png";
import airGif from "../Assets/air-conditioner.gif";
import fanGif from "../Assets/fan.gif";
import bulbGif from "../Assets/bulb.gif";
import "./Dashboard.css";
function Dashboard() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = {
      labels: labels,
      datasets: [
        {
          label: "Temperature",
          backgroundColor: "red",
          borderColor: "red",
          data: [25, 30, 26, 27, 28, 29, 30],
          tension: 0.4,
        },
        {
          label: "Humid",
          backgroundColor: "blue",
          borderColor: "blue",
          data: [70, 65, 75, 60, 50, 80, 55],
          tension: 0.4,
        },
        {
          label: "Light",
          backgroundColor: "yellow",
          borderColor: "yellow",
          data: [30, 55, 60, 70, 55, 80, 60],
          tension: 0.4,
        },
      ],
    };

    const config = {
      type: "line",
      data: data,
    };

    const chart = new Chart(canvasRef.current, config);

    return () => {
      // Cleanup chart instance on component unmount
      chart.destroy();
    };
  }, []);

  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);

  const handleCheckboxChange1 = () => {
    setIsChecked1(!isChecked1);
  };

  const handleCheckboxChange2 = () => {
    setIsChecked2(!isChecked2);
  };

  const handleCheckboxChange3 = () => {
    setIsChecked3(!isChecked3);
  };

  return (
    <div style={{ margin: "30px" }}>
      <div className="row" style={{ margin: "5px" }}>
        <div className="col-4 py-3 py-md-0">
          <div className="card">
            <div className="card-body">
              <div className="">
                <i
                  className="fa-solid fa-temperature-empty"
                  style={{ color: "red" }}
                ></i>
                <span>Temperature</span>
              </div>

              <div className="content">30</div>
            </div>
          </div>
        </div>

        <div className="col-4 py-3 py-md-0">
          <div className="card">
            <div className="card-body">
              <div className="">
                <i
                  className="fa-solid fa-droplet"
                  style={{ color: "blue" }}
                ></i>
                <span>Humid</span>
              </div>

              <div className="content">80%</div>
            </div>
          </div>
        </div>

        <div className="col-4 py-3 py-md-0">
          <div className="card">
            <div className="card-body">
              <div className="">
                <i
                  className="fa-regular fa-lightbulb"
                  style={{ color: "yellow" }}
                ></i>
                <span>Light</span>
              </div>

              <div className="content">70</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div
          className="column col-8 py-3"
          style={{
            backgroundColor: "white",
            padding: "20px",
            marginTop: "30px",
          }}
        >
          <div className="title">Đồ Thị</div>
          <canvas ref={canvasRef}></canvas>
        </div>
        <div
          className="column col-3 py-3"
          style={{
            backgroundColor: "white",
            marginLeft: "30px",
            marginTop: "30px",
          }}
        >
          <div className="title">Tùy Chỉnh</div>
          <div className="main">
            <div className="row mb-5">
              <div className="col-4">
                {isChecked1 ? (
                  <img
                    src={bulbGif} // Đảm bảo `fanGif` là ảnh động (GIF)
                    alt="Animated Fan"
                    style={{ height: "100px" }}
                  />
                ) : (
                  <img
                    src={bulbImage} // Đảm bảo `fanImage` là ảnh tĩnh
                    alt="Static Fan"
                    style={{ height: "100px" }}
                  />
                )}
              </div>
              <div className="col-4">
                <span>Led</span>
              </div>
              <div className="col-4">
                {" "}
                <span className="status" style={{ paddingLeft: "30px" }}>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isChecked1}
                      onChange={handleCheckboxChange1}
                    />
                    <span className="slider"></span>
                  </label>
                </span>
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-4">
                {isChecked2 ? (
                  <img
                    src={fanGif}
                    alt="Animated Fan"
                    style={{ height: "100px" }}
                  />
                ) : (
                  <img
                    src={fanImage}
                    alt="Static Fan"
                    style={{ height: "100px" }}
                  />
                )}
              </div>
              <div className="col-4">
                <span>Quạt</span>
              </div>
              <div className="col-4">
                <span className="status" style={{ paddingLeft: "30px" }}>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isChecked2}
                      onChange={handleCheckboxChange2}
                    />
                    <span className="slider"></span>
                  </label>
                </span>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-4">
                {isChecked3 ? (
                  <img
                    src={airGif}
                    alt="Animated Fan"
                    style={{ height: "100px" }}
                  />
                ) : (
                  <img
                    src={airImage}
                    alt="Static Fan"
                    style={{ height: "100px" }}
                  />
                )}
              </div>
              <div className="col-4">
                {" "}
                <span>Điều Hòa</span>
              </div>
              <div className="col-4">
                <span className="status" style={{ paddingLeft: "30px" }}>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isChecked3}
                      onChange={handleCheckboxChange3}
                    />
                    <span className="slider"></span>
                  </label>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
