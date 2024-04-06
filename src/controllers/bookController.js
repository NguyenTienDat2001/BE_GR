import db from "../models/index";
const { Op } = require('sequelize');
const bookController = {
  getAllbook: async (req, res) => {
    try {
      const books = await db.Book.findAll();
      return res.status(200).json({
        message: 'successfull',
        books: books
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  getBook: async (req, res) => {
    try {
      const book = await db.Book.findOne({ where: { id: req.params.id } });
      return res.status(200).json({
        message: 'successfull',
        book: book
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  addBook: async (req, res) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(200).json({ message: 'Request body is empty' });
    }
      await db.Book.create({
        ...req.body,
      });
      return res.status(200).json({
        message: 'successfull',
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  searchBook: async (req, res) => {
    try {
      const { cate, age, price, book_name } = req.body;
      if (book_name) {
        const books = await db.Book.findAll({ where: { name: { [Op.like]: `%${book_name}%` } } });
        return res.status(200).json({ message: 'success', books: books });
      } else {
        let query = {};
        if (cate !== '0') {
          query.category = cate;
        }
        if (age !== '0') {
          query.age = age;
        }
        if (price !== '0') {
          switch (price) {
            case '1':
              query.sell_price = { [Op.lt]: 50000 };
              break;
            case '2':
              query.sell_price = { [Op.gte]: 50000, [Op.lt]: 100000 };
              break;
            case '3':
              query.sell_price = { [Op.gte]: 100000, [Op.lt]: 200000 };
              break;
            case '4':
              query.sell_price = { [Op.gte]: 200000, [Op.lt]: 400000 };
              break;
            case '5':
              query.sell_price = { [Op.gte]: 400000, [Op.lt]: 1000000 };
              break;
            case '6':
              query.sell_price = { [Op.gte]: 1000000 };
              break;
            default:
              break;
          }
        }
        const books = await db.Book.findAll({ where: query });
        return res.status(200).json({ message: 'success', books: books });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },


  deleteBook: async (req, res) => {
    try {
      await db.Book.destroy({
        where: {
          id: req.params.id
        },
      });
      return res.status(200).json({
        message: 'successfull',
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

};

module.exports = bookController;
