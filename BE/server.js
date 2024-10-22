const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const mqtt = require("mqtt");
const cors = require("cors");

const app = express();
const port = 3000;

// Cấu hình kết nối đến MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "iot_db", // Tên cơ sở dữ liệu của bạn
});
app.use(cors());
// Kết nối đến MySQL
db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối cơ sở dữ liệu: ", err);
  } else {
    console.log("Kết nối đến MySQL thành công");
  }
});

// Sử dụng body-parser để đọc dữ liệu JSON
app.use(bodyParser.json());

// Cấu hình kết nối MQTT với broker của bạn
const mqttOptions = {
  host: "192.168.1.10", // Địa chỉ IP của broker
  port: 1886, // Port broker
  username: "thao", // Tài khoản MQTT
  password: "b21dccn684", // Mật khẩu MQTT
};

// Kết nối tới MQTT broker
const mqttClient = mqtt.connect(mqttOptions); // Thay localhost bằng địa chỉ của MQTT broker nếu cần

// Khi kết nối thành công với MQTT broker
mqttClient.on("connect", () => {
  console.log("Đã kết nối đến MQTT broker");

  // Subscribe vào topic mà cảm biến gửi dữ liệu (ví dụ: 'home/sensor-data')
  mqttClient.subscribe("sensor/data", (err) => {
    if (err) {
      console.error("Lỗi khi đăng ký nhận dữ liệu từ  topic home/sensor-data");
    } else {
      console.log("Đã đăng ký nhận dữ liệu từ topic home/sensor-data");
    }
  });

  mqttClient.subscribe("LED",(err)=>{
    if (err) {
      console.error("Lỗi khi đăng ký nhận dữ liệu từ  topic LED");
    } else {
      console.log("Đã đăng ký nhận dữ liệu từ topic LED");
    }
  })

  mqttClient.subscribe("FAN",(err)=>{
    if (err) {
      console.error("Lỗi khi đăng ký nhận dữ liệu từ  topic FAN");
    } else {
      console.log("Đã đăng ký nhận dữ liệu từ topic FAN");
    }
  })
  mqttClient.subscribe("CONDITIONER",(err)=>{
    if (err) {
      console.error("Lỗi khi đăng ký nhận dữ liệu từ  topic CONDITIONER");
    } else {
      console.log("Đã đăng ký nhận dữ liệu từ topic CONDITIONER");
    }
  })

});

//Lắng nghe khi có dữ liệu gửi từ MQTT broker (từ topic 'home/sensor-data')
mqttClient.on("message", (topic, message) => {
  if (topic === "sensor/data") {
    // Chuyển message từ buffer thành JSON
    const sensorData = JSON.parse(message.toString());

    // Lưu dữ liệu vào cơ sở dữ liệu MySQL
    const { temperature, humidity, lightLevel } = sensorData;
    const query =
      "INSERT INTO datasensor (temperature, humidity, light_level, time) VALUES (?, ?, ?, NOW())";

    db.query(query, [temperature, humidity, lightLevel], (err) => {
      if (err) {
        console.error("Lỗi khi lưu dữ liệu cảm biến: ", err);
      } else {
        console.log("Dữ liệu cảm biến đã được lưu vào cơ sở dữ liệu");
      }
    });
  }
});

// API để điều khiển bật/tắt thiết bị (LED)
// app.post("/api/control-device", (req, res) => {
//   const { device, action } = req.body;
//   const message = `${device}_${action}`; // Ví dụ: "LED1_ON" hoặc "LED2_OFF"
//   mqttClient.publish("home/leds", message, (err) => {
//     if (err) {
//       return res.status(500).send("Lỗi khi gửi lệnh điều khiển");
//     }
//     mqttClient.on("message", (topic, message) => {
//       if (topic === device) {
//         const status = message.toString();
//         if (status == action) {
//           res.status(200).send(`success`);
//           // Lưu lịch sử hành động vào MySQL
//           const query =
//             "INSERT INTO action_history (device, action,time) VALUES (?, ?, NOW())";
//           db.query(query, [device, action], (err) => {
//             if (err) {
//               console.error("Lỗi khi lưu lịch sử hành động: ", err);
//             }
//           });
//         }
//       }
//     });
//   });
// });
app.post("/api/control-device", (req, res) => {
  const { device, action } = req.body;
  const message = `${device}_${action}`; // Ví dụ: "LED_ON" hoặc "LED_OFF"

  mqttClient.publish("home/leds", message, (err) => {
    if (err) {
      return res.status(500).send("Lỗi khi gửi lệnh điều khiển");
    }

    // Tạo một listener tạm thời để lắng nghe phản hồi từ MQTT
    const mqttListener = (topic, mqttMessage) => {
      if (topic === device) {
        // chỉ lắng nghe topic của thiết bị cụ thể
        const status = mqttMessage.toString(); // Lấy trạng thái ("ON", "OFF")
        console.log(status)
        if (status === action) {
          // So sánh với hành động yêu cầu
          res.status(200).send(`Thành công: ${device} đã ${status}`);

          // Xóa listener sau khi đã nhận được phản hồi
          mqttClient.removeListener("message", mqttListener);

          // Lưu lịch sử hành động vào MySQL
          const query =
            "INSERT INTO action_history (device, action, time) VALUES (?, ?, NOW())";
          db.query(query, [device, action], (err) => {
            if (err) {
              console.error("Lỗi khi lưu lịch sử hành động: ", err);
            }
          });
        }
      }
    };

    // Lắng nghe thông báo từ MQTT cho thiết bị
    mqttClient.on("message", mqttListener);
  });
});

// API lấy dữ liệu cảm biến với phân trang và tìm kiếm
app.get("/api/get-all-sensor-data", (req, res) => {
  // Lấy tham số page và pagesize từ query string, với giá trị mặc định nếu không có
  const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
  const pagesize = parseInt(req.query.pagesize) || 10; // Số lượng bản ghi mỗi trang (mặc định là 10)

  // Lấy tham số tìm kiếm từ query string
  const temperatureSearch = req.query.temperature || ""; // Từ khóa tìm kiếm cho temperature
  const humiditySearch = req.query.humidity || ""; // Từ khóa tìm kiếm cho humidity
  const lightSearch = req.query.light || ""; // Từ khóa tìm kiếm cho light
  const timeSearch = req.query.time || ""; // Từ khóa tìm kiếm cho time
  const allSearch = req.query.all || ""; // Từ khóa tìm kiếm trên tất cả các trường

  const offset = (page - 1) * pagesize; // Tính toán vị trí bắt đầu lấy dữ liệu

  // Tạo truy vấn SQL
  let query = `SELECT id, temperature,humidity, light_level, DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') AS time FROM datasensor`;
  let countQuery = "SELECT COUNT(*) as totalRecords FROM datasensor";
  let conditions = [];

  // Nếu allSearch có giá trị, tìm kiếm trên tất cả các trường
  if (allSearch) {
    conditions.push(
      `(temperature LIKE ? OR humidity LIKE ? OR light_level LIKE ? OR time LIKE ?)`
    );
  } else {
    // Thêm điều kiện tìm kiếm nếu có tham số riêng lẻ
    if (temperatureSearch) {
      conditions.push(`temperature LIKE ?`);
    }
    if (humiditySearch) {
      conditions.push(`humidity LIKE ?`);
    }
    if (lightSearch) {
      conditions.push(`light_level LIKE ?`);
    }
    if (timeSearch) {
      conditions.push(`time LIKE ?`);
    }
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
    countQuery += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY time DESC LIMIT ? OFFSET ?";

  // Tạo mảng giá trị cho các tham số trong truy vấn
  const values = [];

  // Nếu allSearch có giá trị, thêm các giá trị tìm kiếm cho tất cả các trường
  if (allSearch) {
    values.push(
      `%${allSearch}%`,
      `%${allSearch}%`,
      `%${allSearch}%`,
      `%${allSearch}%`
    );
  } else {
    if (temperatureSearch) {
      values.push(`%${temperatureSearch}%`);
    }
    if (humiditySearch) {
      values.push(`%${humiditySearch}%`);
    }
    if (lightSearch) {
      values.push(`%${lightSearch}%`);
    }
    if (timeSearch) {
      values.push(`%${timeSearch}%`);
    }
  }

  // Thêm giá trị cho số lượng bản ghi và vị trí bắt đầu
  values.push(pagesize, offset);

  // Thực hiện truy vấn để lấy dữ liệu
  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send("Lỗi khi lấy dữ liệu cảm biến");
    }

    // Thực hiện truy vấn để lấy tổng số bản ghi
    db.query(countQuery, values.slice(0, -2), (err, countResult) => {
      if (err) {
        return res.status(500).send("Lỗi khi lấy tổng số bản ghi");
      }

      const totalRecords = countResult[0].totalRecords; // Tổng số bản ghi
      const totalPages = Math.ceil(totalRecords / pagesize); // Tính tổng số trang

      // Trả về dữ liệu và thông tin phân trang
      res.status(200).json({
        data: result, // Dữ liệu cảm biến trong trang hiện tại
        totalRecords, // Tổng số bản ghi
        totalPages, // Tổng số trang
        currentPage: page, // Trang hiện tại
      });
    });
  });
});

// API để lấy dữ liệu cảm biến mới nhất
app.get("/api/get-latest-sensor-data", (req, res) => {
  const query = "SELECT * FROM datasensor ORDER BY time DESC LIMIT 1";

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send("Lỗi khi lấy dữ liệu cảm biến");
    }
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).send("Không tìm thấy dữ liệu cảm biến");
    }
  });
});

// ACTION history
app.get("/api/get-action-history", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const pagesize = parseInt(req.query.pagesize) || 10; // Số lượng bản ghi trên mỗi trang, mặc định là 10
    const timeKeyword = req.query.searchTerm || ""; // Từ khóa tìm kiếm thời gian, đã sửa thành searchTerm

    // Tính toán offset dựa trên trang hiện tại và số bản ghi trên mỗi trang
    const offset = (page - 1) * pagesize;

    // Truy vấn để lấy tổng số bản ghi dựa theo thời gian
    let countQuery = `SELECT COUNT(*) as totalRecords FROM action_history WHERE time LIKE ?`;

    // Truy vấn để lấy các bản ghi dựa theo thời gian và phân trang
    let dataQuery = `SELECT id, device, action, DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') AS time 
                     FROM action_history 
                     WHERE time LIKE ? 
                     ORDER BY time DESC 
                     LIMIT ? OFFSET ?`;

    // Chuẩn bị giá trị từ khóa thời gian cho truy vấn
    const timeKeywordPattern = `%${timeKeyword}%`; // Đảm bảo chứa từ khóa

    // Thực hiện truy vấn tổng số bản ghi trước
    db.query(countQuery, [timeKeywordPattern], (err, countResult) => {
      if (err) {
        return res.status(500).send("Lỗi khi lấy tổng số bản ghi");
      }

      const totalRecords = countResult[0].totalRecords; // Lấy tổng số bản ghi

      // Sau đó, thực hiện truy vấn lấy dữ liệu của trang hiện tại
      db.query(
        dataQuery,
        [timeKeywordPattern, pagesize, offset],
        (err, dataResult) => {
          if (err) {
            return res.status(500).send("Lỗi khi lấy lịch sử hành động");
          }

          // Trả về dữ liệu và tổng số bản ghi
          res.status(200).json({
            data: dataResult, // Dữ liệu của các bản ghi theo trang
            totalRecords, // Tổng số bản ghi để tính số trang trên Frontend
            timeKeyword,
            page,
            pagesize,
          });
        }
      );
    });
  } catch (err) {
    res.status(500).send("Đã xảy ra lỗi hệ thống");
  }
});

// Bắt đầu server
app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
