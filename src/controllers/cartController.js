import db from "../models/index";
const { Op } = require('sequelize');
const cartController = {
    
    addCart: async (req, res) => {
        try {
            const { user_id, book_id, quantity } = req.body;
            const cart = await db.Order.findOne({ where: { user_id, status: '-1' } });

            if (cart) {
                const order_id = cart.id;
                const existBook = await db.OrderDetail.findOne({ where: { order_id, book_id } });

                if (existBook) {
                    await db.OrderDetail.update({ quantity: existBook.quantity + quantity }, { where: { id: existBook.id } });
                } else {
                    await db.OrderDetail.create({ order_id, book_id, quantity });
                }
                return res.status(200).json({ message: 'update successfully' });
            } else {
                const newCart = await db.Order.create({ user_id, status: '-1' });
                await db.OrderDetail.create({ order_id: newCart.id, book_id, quantity });
                return res.status(200).json({ message: 'new cart' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getCart: async (req, res) => {
        try {
            // const user_id = req.body.user_id;
            // if (!req.session.userId) {
            //     return res.status(401).json({ message: 'Chưa đăng nhập' });
            // }
            const user_id = req.userId;
            const order = await db.Order.findOne({ where: { user_id, status: '-1' } });
    
            if (order) {
                const cart = await db.OrderDetail.findAll({ where: { order_id: order.id } });
                const cartWithBooks = await Promise.all(cart.map(async (item) => {
                    const book = await db.Book.findByPk(item.book_id);
                    return {
                        book_id: book.id,
                        name: book.name,
                        price: book.sell_price,
                        img: book.img,
                        author: book.author,
                        quantity: item.quantity
                    };
                }));
                return res.status(200).json({ data: cartWithBooks });
            } else {
                return res.status(201).json({ message: 'Empty cart' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateCart: async (req, res) => {
        try {
            const book_id = req.params.book_id;
            const scope = req.params.scope;
            const user_id = 1; 
    
            const order = await db.Order.findOne({ where: { user_id, status: '-1' } });
            const bookItem = await db.OrderDetail.findOne({ where: { order_id: order.id, book_id } });
    
            if (scope === 'inc') {
                bookItem.quantity += 1;
            } else {
                bookItem.quantity -= 1;
            }
    
            await bookItem.save();
    
            return res.status(200).json({
                message: 'Successfully updated',
                data: bookItem
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteCart: async (req, res) => {
        try {
            const { book_id } = req.params.book_id;
            const order = await db.Order.findOne({ user_id: 1 });
            const bookItem = await db.OrderDetail.findOne({ order_id: order.id, book_id: book_id });
    
            if (!bookItem) {
                return res.status(404).json({ message: 'Cart item not found' });
            }
    
            await bookItem.destroy();
    
            return res.status(200).json({ message: 'Cart item deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    

};

module.exports = cartController;
