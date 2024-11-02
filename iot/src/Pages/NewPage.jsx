import React, { useState, useEffect, useRef } from "react";
import bulbImage from "../Assets/bulb.jpeg";
import bulbGif from "../Assets/bulb.gif";
import Chart from "chart.js/auto";

const NewPage = () => {
  const [randomSensor, setRandomSensor] = useState(30);
  const [isChecked1, setIsChecked1] = useState(false);
  const [count, setCount] = useState(0);
  const [color, setColor] = useState("");

  const fetchLatestSensorData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/get-latest-sensor-data"
      );
      const data = await response.json();
      setRandomSensor(data.randomSensor);
      if (data.randomSensor > 70) {
        setColor("red");
      } else {
        setColor("");
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  const fectchcount = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/count");
      const data = await response.json();
      setCount(data.count);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

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

  useEffect(() => {
    fetchLatestSensorData();
    fectchcount();

    // Gọi API liên tục mỗi 5 giây để cập nhật dữ liệu cảm biến
    const intervalId = setInterval(fetchLatestSensorData, 2000);
    const intervalId1 = setInterval(fectchcount, 2000);

    // Cleanup interval khi component bị hủy
    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId1);
    };
  }, []);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAndRenderData = async () => {
      // Lấy dữ liệu từ API
      const sensorData = await fetchSensorData();

      if (sensorData.length === 0) return;

      // Lấy ra thời gian và các dữ liệu cảm biến từ API
      const labels = sensorData.map((item) => item.time).reverse();
      const randomData = sensorData.map((item) => item.randomSensor).reverse();

      const data = {
        labels: labels,
        datasets: [
          {
            label: "Random",
            backgroundColor: "green",
            borderColor: "green",
            data: randomData,
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
    const intervalId = setInterval(fetchAndRenderData, 2000);

    // Cleanup khi component bị hủy
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      clearInterval(intervalId);
    };
  }, []);

  const getColorWithAlpha = (value, type) => {
    let baseColor;
    if (type === "temperature") baseColor = "255, 0, 0"; // Màu đỏ cho nhiệt độ
    else if (type === "humidity")
      baseColor = "30,144,255"; // Màu xanh cho độ ẩm
    else if (type === "light")
      baseColor = "255,255,153"; // Màu vàng cho ánh sáng
    else if (type === "randomSensor") baseColor = "124,252,0";

    // Tăng alpha dựa trên giá trị cảm biến, giá trị càng cao alpha càng lớn
    const alpha = Math.min(1, value / 100); // Chỉ số alpha từ 0 đến 1
    return `rgba(${baseColor}, ${alpha})`; // Trả về màu với alpha
  };
  const handleCheckboxChange1 = async (event) => {
    const newChecked = event.target.checked;
    const action = newChecked ? "ON" : "OFF";
    const payload = {
      device: "WARNING",
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

  return (
    <div>
      <div className="col-4 py-3 py-md-0">
        <div
          className="card"
          style={{
            backgroundColor: getColorWithAlpha(randomSensor, "randomSensor"),
          }}
        >
          <div className="card-body">
            <div className="">
              <span>randomSensor</span>
            </div>

            <div className="content">{randomSensor}</div>
          </div>
        </div>
      </div>

      <div className="col-4" style={{ backgroundColor: color }}>
        {isChecked1 ? (
          <img src={bulbGif} alt="Animated Fan" style={{ height: "100px" }} />
        ) : (
          <img src={bulbImage} alt="Static Fan" style={{ height: "100px" }} />
        )}
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
      <div>Số lần cảnh báo</div>
      <div>{count}</div>
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
    </div>
  );
};

export default NewPage;
