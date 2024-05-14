import db from "../models/index";
const moment = require('moment');
const { Op, JSON } = require('sequelize');
const orderController = {
    getOrder: async (req, res) => {
        try {
            const user_id = req.userId;
            const orders = await db.Order.findAll({ where: { user_id } });
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
            const books = await Promise.all(arrbooks.map(async (item) => {
                const book = await db.Book.findByPk(item.book_id);
                return {
                    ...book.toJSON(),
                    quantity: item.quantity
                };
            }));
            return res.status(200).json({
                message: 'successfull',
                books: books,
              });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

};

module.exports = orderController;
