app.post("/api/control-device", (req, res) => {
  const { device, action } = req.body;
  const message = `${device}_${action}`; // Ví dụ: "LED1_ON" hoặc "LED2_OFF"
  // Lấy giờ hiện tại và chuyển đổi sang múi giờ Việt Nam

  mqttClient.publish("home/leds", message, (err) => {
    if (err) {
      return res.status(500).send("Lỗi khi gửi lệnh điều khiển");
    }
    res.status(200).send(`Đã gửi lệnh ${message}`);

    // Lưu lịch sử hành động vào MySQL
    const query =
      "INSERT INTO action_history (device, action,time) VALUES (?, ?, NOW())";
    db.query(query, [device, action], (err) => {
      if (err) {
        console.error("Lỗi khi lưu lịch sử hành động: ", err);
      }
    });
  });
});