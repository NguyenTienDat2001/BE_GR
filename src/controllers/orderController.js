import db from "../models/index";
const moment = require('moment');
const { Op } = require('sequelize');
const orderController = {
    getOrder: async (req, res) => {
        try {
            const user_id = req.userId;
            const orderarr = await db.Order.findAll({
                where: {
                    user_id,
                    status: {
                        [Op.ne]: '-1'
                    }
                }
            });
            const orders = await Promise.all(orderarr.map(async (item) => {
                const transaction = await db.Transaction.findOne({ where: { order_id: item.id } });
                if (transaction) {
                    return {
                        ...item.toJSON(),
                        ispay: true
                    };
                } else {
                    return {
                        ...item.toJSON(),
                        ispay: false
                    };
                }
            }));
            return res.status(200).json({
                message: 'successfull',
                orders: orders,
            });
        } catch (error) {
            return res.status(500).send(error);
        }
    },
    addOrder: async (req, res) => {
        try {
            const { order_id, address, receiver, phone_number, account, code } = req.body;
            await db.Order.update(
                { address, receiver, phone_number, account, status: "1" },
                {
                    where: { id: order_id }
                }
            );
            if (code) {
                const coupon = await db.Coupon.findOne({ where: { code } });
                if(coupon){
                    await coupon.update({ status: '2' });
                }
            }
            return res.status(200).json({
                message: 'successfull',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
    cancelOrder: async (req, res) => {
        try {
            const { order_id } = req.body;
            await db.Order.update(
                { status: "2" },
                {
                    where: { id: order_id }
                }
            );
            return res.status(200).json({
                message: 'successfull',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },
    checkOrder: async (req, res) => {
        try {
            const { order_id } = req.body;
            const order = await db.Order.findOne({ where: { id: order_id } });
            if (order) {
                await order.update({ status: "0" });
            }
            else {
                return res.status(401).json({
                    message: 'Not found',
                });
            }
            const events = await db.Event.findAll({ where: { status: '1' } });
            let point = 0;
            await Promise.all(events.map(async (item) => {
                point = point + order.account / item.value * item.point;
            }));
            const user = await db.User.findOne({ where: { id: order.user_id } });
            user.point += Math.floor(point);
            user.save();
            return res.status(200).json({
                message: 'successfull',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },



    getAllOrder: async (req, res) => {
        try {
            const orderarr = await db.Order.findAll({
                where: {
                    status: {
                        [Op.ne]: '-1'
                    }
                }
            });
            const orders = await Promise.all(orderarr.map(async (item) => {
                const user = await db.User.findByPk(item.user_id);
                return {
                    ...item.toJSON(),
                    email: user.email
                };
            }));
            return res.status(200).json({
                message: 'successfull',
                orders: orders,
            });
        } catch (error) {
            return res.status(500).send(error);
        }
    },

    getOrderDetail: async (req, res) => {
        try {
            const arrbooks = await db.OrderDetail.findAll({ where: { order_id: req.params.id } });
            const tran = await db.Transaction.findOne({ where: { order_id: req.params.id } });
            const books = await Promise.all(arrbooks.map(async (item) => {
                const book = await db.Book.findByPk(item.book_id);

                return {
                    ...book.toJSON(),
                    quantity: item.quantity,
                };
            }));
            return res.status(200).json({
                message: 'successfull',
                books: books,
                transaction: tran
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

};

module.exports = orderController;
