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
  const [temperature, setTemperature] = useState(30);
  const [humidity, setHumidity] = useState(60);
  const [light_level, setLight_Level] = useState(0);
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);

  const getColorWithAlpha = (value, type) => {
    let baseColor;
    if (type === "temperature") baseColor = "255, 0, 0"; // Màu đỏ cho nhiệt độ
    else if (type === "humidity")
      baseColor = "30,144,255"; // Màu xanh cho độ ẩm
    else if (type === "light") baseColor = "255,255,153"; // Màu vàng cho ánh sáng

    // Tăng alpha dựa trên giá trị cảm biến, giá trị càng cao alpha càng lớn
    const alpha = Math.min(1, value / 100); // Chỉ số alpha từ 0 đến 1
    return `rgba(${baseColor}, ${alpha})`; // Trả về màu với alpha
  };

  const fetchLatestSensorData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/get-latest-sensor-data"
      );
      const data = await response.json();
      // Cập nhật giá trị cảm biến với dữ liệu từ API
      setTemperature(data.temperature);
      setHumidity(data.humidity);
      setLight_Level(data.light_level);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  useEffect(() => {
    fetchLatestSensorData();

    // Gọi API liên tục mỗi 5 giây để cập nhật dữ liệu cảm biến
    const intervalId = setInterval(fetchLatestSensorData, 5000);

    // Cleanup interval khi component bị hủy
    return () => clearInterval(intervalId);
  }, []);

  const fetchSensorData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/get-all-sensor-data?page=1&pagesize=10"
      );
      const datas = await response.json();

      // Trả về dữ liệu, ví dụ như mảng các bản ghi
      return datas.data;
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      return [];
    }
  };

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAndRenderData = async () => {
      // Lấy dữ liệu từ API
      const sensorData = await fetchSensorData();

      if (sensorData.length === 0) return;

      // Lấy ra thời gian và các dữ liệu cảm biến từ API
      const labels = sensorData.map((item) => item.time).reverse();
      const temperatureData = sensorData
        .map((item) => item.temperature)
        .reverse();
      const humidityData = sensorData.map((item) => item.humidity).reverse();
      const lightData = sensorData.map((item) => item.light_level).reverse();

      const data = {
        labels: labels,
        datasets: [
          {
            label: "Temperature",
            backgroundColor: "red",
            borderColor: "red",
            data: temperatureData,
            tension: 0.4,
          },
          {
            label: "Humid",
            backgroundColor: "blue",
            borderColor: "blue",
            data: humidityData,
            tension: 0.4,
          },
          {
            label: "Light",
            backgroundColor: "yellow",
            borderColor: "yellow",
            data: lightData,
            tension: 0.4,
          },
        ],
      };

      const config = {
        type: "line",
        data: data,
      };

      // Hủy biểu đồ cũ trước khi tạo mới
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Tạo biểu đồ mới
      chartRef.current = new Chart(canvasRef.current, config);
    };

    // Gọi hàm để fetch dữ liệu và vẽ biểu đồ lần đầu
    fetchAndRenderData();

    // Cập nhật dữ liệu mỗi 5 giây
    const intervalId = setInterval(fetchAndRenderData, 10000);

    // Cleanup khi component bị hủy
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      clearInterval(intervalId);
    };
  }, []);

  const handleCheckboxChange1 = async (event) => {
    const newChecked = event.target.checked;
    const action = newChecked ? "ON" : "OFF";
    const payload = {
      device: "LED",
      action: action,
    };
    const response = await fetch("http://localhost:3000/api/control-device", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Đặt header cho JSON
      },
      body: JSON.stringify(payload), // Chuyển đổi payload thành chuỗi JSON
    });
    if (response.status === 200) {
      // Nếu điều khiển thành công, cập nhật trạng thái
      setIsChecked1(newChecked);
    } else {
      console.error("Failed to control the LED.");
    }
  };
  const handleCheckboxChange2 = async (event) => {
    const newChecked = event.target.checked;
    const action = newChecked ? "ON" : "OFF";
    const payload = {
      device: "FAN",
      action: action,
    };
    const response = await fetch("http://localhost:3000/api/control-device", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Đặt header cho JSON
      },
      body: JSON.stringify(payload), // Chuyển đổi payload thành chuỗi JSON
    });
    if (response.status === 200) {
      // Nếu điều khiển thành công, cập nhật trạng thái
      setIsChecked2(newChecked);
    } else {
      console.error("Failed to control the LED.");
    }
  };

  const handleCheckboxChange3 = async (event) => {
    const newChecked = event.target.checked;
    const action = newChecked ? "ON" : "OFF";
    const payload = {
      device: "CONDITIONER",
      action: action,
    };
    const response = await fetch("http://localhost:3000/api/control-device", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Đặt header cho JSON
      },
      body: JSON.stringify(payload), // Chuyển đổi payload thành chuỗi JSON
    });
    if (response.status === 200) {
      // Nếu điều khiển thành công, cập nhật trạng thái
      setIsChecked3(newChecked);
    } else {
      console.error("Failed to control the LED.");
    }
  };

  return (
    <div style={{ margin: "30px" }}>
      <div className="row" style={{ margin: "5px" }}>
        <div className="col-4 py-3 py-md-0">
          <div
            className="card"
            style={{
              backgroundColor: getColorWithAlpha(temperature, "temperature"),
            }}
          >
            <div className="card-body">
              <div className="">
                <i
                  className="fa-solid fa-temperature-empty"
                  style={{ color: "red" }}
                ></i>
                <span>Temperature</span>
              </div>

              <div className="content">{temperature}</div>
            </div>
          </div>
        </div>

        <div className="col-4 py-3 py-md-0">
          <div
            className="card"
            style={{ backgroundColor: getColorWithAlpha(humidity, "humidity") }}
          >
            <div className="card-body">
              <div className="">
                <i
                  className="fa-solid fa-droplet"
                  style={{ color: "blue" }}
                ></i>
                <span>Humid</span>
              </div>

              <div className="content">{humidity}</div>
            </div>
          </div>
        </div>

        <div className="col-4 py-3 py-md-0">
          <div
            className="card"
            style={{ backgroundColor: getColorWithAlpha(light_level, "light") }}
          >
            <div className="card-body">
              <div className="">
                <i
                  className="fa-regular fa-lightbulb"
                  style={{ color: "yellow" }}
                ></i>
                <span>Light</span>
              </div>

              <div className="content">{light_level}</div>
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
                    <input type="checkbox" onChange={handleCheckboxChange1} />
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
                    <input type="checkbox" onChange={handleCheckboxChange2} />
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
                    <input type="checkbox" onChange={handleCheckboxChange3} />
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
