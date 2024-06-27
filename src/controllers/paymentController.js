import db from "../models/index";
// import dateFormat from "dateformat";
const { Op } = require('sequelize');
const crypto = require('crypto');
const moment = require("moment");
const paymentController = {
  processpayment: async (req, res) => {
    process.env.TZ = "Asia/Ho_Chi_Minh";
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = "TC59NATY";
    let secretKey = "QUKDKKNOATQJURXAADEBNAZDBMVVOSPF";
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    let returnUrl = "";
    let orderId = req.body.order_id;
    // let book_id = req.body.book_id;
    if (req.body.hasOwnProperty('book_id')) {
      returnUrl = "http://localhost:3000/payment/infor" + "?book_id=" + req.body.book_id + "&user_id=" + req.body.user_id + "&duration=" + req.body.duration;

    } else {
      returnUrl = "http://localhost:3000/payment/infor" + "?order_id=" + orderId + "&code=" + req.body.code + "&history_id=" + req.body.history_id;

    }
    let amount = req.body.total_price;
    let bankCode = "";

    let locale = "vn";
    if (locale === null || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = paymentController.sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    // let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    res.set("Content-Type", "text/html");
    res.send(JSON.stringify(vnpUrl));
  },

  sortObject: (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  },

  getinfor: async (req, res) => {
    const { vnp_TxnRef, vnp_BankCode, vnp_Amount, vnp_TransactionNo, vnp_PayDate, vnp_ResponseCode } = req.query;

    const transactionCode = vnp_TxnRef;
    const bankCode = vnp_BankCode;
    const money = parseInt(vnp_Amount) / 100;
    const vnpTranId = vnp_TransactionNo;
    const vnpPayDate = vnp_PayDate;
    let status = '';

    if (vnp_ResponseCode === "00") {
      status = "successful";
      // Tạo transaction ở đây
    } else {
      status = "failed";
    }

    res.redirect(`https://localhost:3000/detail?payment_code=${transactionCode}&money=${money}&status=${status}`);
  },

  createTran: async (req, res) => {
    try {
      const { order_id, bank_code, amount, infor, user_id, duration } = req.body;
      if (req.body.hasOwnProperty('book_id')) {
        let book_id = req.body.book_id;
        const borrow = await db.Borrow.findOne({ where: { book_id: book_id, user_id: user_id, end_date: { [Op.gt]: new Date() } } })
        if (borrow) {
          return res.status(201).json({
            message: 'Da dat sach',
          });
        }
        const calculateReturnDate = (borrowedDate, borrowDuration) => {
          const borrowedMoment = moment(borrowedDate);
          const returnDate = borrowedMoment.add(borrowDuration, 'months');
          return returnDate;
        };
        const borrowedDate = moment();
        const borrowDuration = duration;
        const end_date = calculateReturnDate(borrowedDate, borrowDuration);
        const newborrow = await db.Borrow.create({
          user_id,
          book_id,
          end_date,
        });
        await db.BorrowPayment.create({
          borrow_id: newborrow.id,
          bank_code,
          amount,
          infor,
        });
        return res.status(200).json({
          message: 'successfull',
        });

      }
      else {
      const { code, history_id } = req.body;
        await db.Transaction.create({
          order_id: history_id,
          type: 'bank',
          infor,
          bank_code,
          amount,
        });
        // await db.Order.updateOne({ _id: order_id }, { status: '0' });
        // const order = await db.Order.findOne({ where: { id: history_id } });
        // const coupon = await db.Coupon.findOne({ where: { code } });
        // await order.update({ status: '0' });
        // await coupon.update({ status: '2' });
        return res.status(200).json({
          message: 'successfully',
        });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },





};

module.exports = paymentController;
