import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import viewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB";
import initAuthRoutes from "./routes/auth";
import initBookRoutes from "./routes/book";
import initCartRoutes from "./routes/cart";
import initCouponRoutes from "./routes/coupon";
import initUserRoutes from "./routes/user";
import initPaymentRoutes from "./routes/payment";

import cors from "cors";

require("dotenv").config();

let app = express();
// let session = require('express-session');

// config app
app.use(
  cors({
    origin: process.env.URL_REACT,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(session({
  secret: 'your-secret-key', // Chuỗi bí mật để ký và mã hóa các thông tin session
  resave: false, // Không lưu lại session mỗi khi request gửi lên server
  saveUninitialized: false, // Không tạo session mới nếu không có dữ liệu được lưu
  cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Thời gian sống của cookie session, ở đây là 1 ngày
      secure: false, // Cài đặt secure là false nếu không sử dụng HTTPS
      httpOnly: true, // Cookie không thể truy cập bằng JavaScript
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

viewEngine(app);
initAuthRoutes(app);
initBookRoutes(app);
initCartRoutes(app);
initCouponRoutes(app);
initUserRoutes(app);
initPaymentRoutes(app);
// initProductRouters(app);
// initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log("Backend NodeJS is running on port " + port);
});
