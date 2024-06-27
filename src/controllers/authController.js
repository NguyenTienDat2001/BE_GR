const jwt = require("jsonwebtoken");
import authService from "../services/authService";
import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
const { Op } = require('sequelize');

const authController = {
  handleLogin: async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        errorCode: 1,
        message: "Missing inputs parameter!",
      });
    }

    let message = await authService.handleUserLogin(email, password);
    if (message.errorCode !== 0) {
      return res.status(201).json(message);
    }
    const userId = message.data.id
    const token = jwt.sign({ userId: userId }, ' ', { expiresIn: '3d' });
    return res.status(200).json({
      errorCode: message.errorCode,
      message: message.message,
      data: { ...message.data },
      token: token
    });
  },

  // generateAccessToken: (data) => {
  //   return jwt.sign(
  //     {
  //       id: data.id,
  //       // admin: data.is_admin,
  //       role: data.role,
  //     },
  //     process.env.JWT_ACCESS_KEY,
  //     { expiresIn: "1h" }
  //   );
  // },

  // generateRefreshToken: (data) => {
  //   return jwt.sign(
  //     {
  //       id: data.id,
  //       admin: data.is_admin,
  //     },
  //     process.env.JWT_REFRESH_KEY,
  //     { expiresIn: "365d" }
  //   );
  // },

  handleCreateNewUser: async (req, res) => {
    let message = await authService.handleCreateNewUser(req.body);
    if (message.errorCode === 0) return res.status(200).json(message);
    else return res.status(201).json(message);
  },

  logout: async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to logout' });
      }
      return res.status(200).json({ message: 'Logout successful' });
    });
  },

  changePassword: async (req, res) => {
    try {

      const { email, password, newpass } = req.body;
      const user = await db.User.findOne({
        where: { email: email }
      });
      if (user) {
        const checkPassword = await bcrypt.compareSync(password, user.password);
        if (checkPassword) {
          let hashPassword = await bcrypt.hashSync(newpass, salt);
          user.password = hashPassword;
          user.save();
          return res.status(200).json({ message: 'Đổi thành công' });
        }
        else {
          return res.status(201).json({ message: 'Sai mật khẩu cũ' });
        }

      } else {
        return res.status(201).json({ message: 'Not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  test: async (req, res) => {
    const arrorder = await db.Order.findAll();
    await Promise.all(arrorder.map(async (item) => {
      const books = await db.OrderDetail.findAll({ where: { order_id: item.id } });
      let total = 0;
      await Promise.all(books.map(async (item) => {

        const book = await db.Book.findByPk(item.book_id);
        if (book) {
          total = total + book.sell_price * item.quantity;
        }
      }));
      item.account = total;
      item.save();
    }));
    return res.status(200).json({ message: "successfully" })
  },

  verifyUser: async (req, res) => {
    const accessToken = req.cookies.token;
    if (!accessToken) {
      return res.status(404).json({
        message: "you need access token"
      })
    }
    else {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, decoded) => {
        if (err) {
          return res.status(404).json({
            message: "Authen error"
          })
        } else {
          return res.status(200).json({
            message: "success",
            userId: decoded.id
          })
        }
      })
    }
  }



  // requestRefreshToken: async (req, res) => {
  //     const refreshToken = req.cookies.refreshToken;
  //     if (!refreshToken) {
  //         return res.status(401).json({
  //             message: "You're not authenticated",
  //         });
  //     }
  //     jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
  //         if (err) {
  //             return res.status(401).json({
  //                 message: "Refresh token is not valid",
  //             });
  //         }
  //         const newAccessToken = authController.generateAccessToken(user);
  //         return res.status(200).json({ accessToken: newAccessToken });
  //     });
  // },

  // handleLogout: async (req, res) => {
  //     res.clearCookie("refreshToken");
  //     return res.status(200).json({ message: "Logout successfully!" });
  // },
};

module.exports = authController;
