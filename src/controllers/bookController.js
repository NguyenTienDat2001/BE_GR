import db from "../models/index";
const moment = require('moment');
const { Op } = require('sequelize');
const bookController = {
  getAllbook: async (req, res) => {
    try {
      const user_id = req.userId;
      const arrbooks = await db.Book.findAll();
      const books = await Promise.all(arrbooks.map(async (item) => {
        const bookmark = await db.Bookmark.findOne({ where: { user_id, book_id: item.id } });
        let isbookmark = false
        if(bookmark) {
          isbookmark = true
        }
        return {
          ...item.toJSON(),
          isbookmark: isbookmark
        };
    }));
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
      const user_id = req.userId;
      const borrow = await db.Borrow.findOne({ where: { book_id: req.params.id, user_id: user_id, end_date: { [Op.gt]: new Date() } } })
      let isborrow = false
      if (borrow) {
        isborrow = true
      } 
        return res.status(200).json({
          message: 'successfull',
          book: book,
          isborrow: isborrow
        });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  getChapter: async (req, res) => {
    try {
      const chapters = await db.Chapter.findAll({ where: { book_id: req.params.id } });
      const book = await db.Book.findOne({ where: { id: req.params.id } })
      return res.status(200).json({
        message: 'successfull',
        chapters: chapters,
        book_name: book.name
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
      const book = await db.Book.findOne({ where: { name: { [Op.like]: `%${req.body.name}%` } } });
      if (book) {
        return res.status(201).json({ message: 'Sach da ton tai' });
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

  addChapter: async (req, res) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(200).json({ message: 'Request body is empty' });
      }
      await db.Chapter.create({
        ...req.body,
      });
      return res.status(200).json({
        message: 'successfull',
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  getBorrowBook: async (req, res) => {
    try {
      const user_id = req.userId;
      const borrows = await db.Borrow.findAll({ where: { user_id, end_date: { [Op.gt]: new Date() } } });
      // return res.status(200).json({data: borrows})
      if (borrows.length > 0) {
        const borrowsWithBooks = await Promise.all(borrows.map(async (item) => {
          const book = await db.Book.findByPk(item.book_id);
          return {
            book_id: book.id,
            name: book.name,
            img: book.img,
            author: book.author,
            start_date: item.createdAt,
            end_date: item.end_date,
          };
        }));
        return res.status(200).json({ books: borrowsWithBooks });
      } else {
        return res.status(201).json({ message: 'Not borrowed' });
      }

    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  addBookmark: async (req, res) => {
    try {
      const user_id = req.userId;
      const { book_id } = req.body;
      if (Object.keys(req.body).length === 0) {
        return res.status(200).json({ message: 'Request body is empty' });
      }
      const bookmark = await db.Bookmark.findOne({ where: { user_id, book_id } });
      if (bookmark) {
        return res.status(201).json({ message: 'Da them yeu thich' });
      }
      await db.Bookmark.create({
        user_id,
        book_id,
      });
      return res.status(200).json({
        message: 'successfull',
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  deleteBookmark: async (req, res) => {
    try {
      const user_id = req.userId;
      await db.Bookmark.destroy({
        where: {
          user_id,
          book_id: req.params.id
        },
      });
      return res.status(200).json({
        message: 'successfull',
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  getBookmark: async (req, res) => {
    try {
      const user_id = req.userId;
      const arrbooks = await db.Bookmark.findAll({ where: { user_id } });
      const books = await Promise.all(arrbooks.map(async (item) => {
        const book = await db.Book.findByPk(item.book_id);
        return {
          book_id: book.id,
          name: book.name,
          price: book.sell_price,
          img: book.img,
          author: book.author,
        };
    }));
      return res.status(200).json({
        message: 'successfull',
        books: books
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  
};

module.exports = bookController;
