import db from "../models/index";
const { Op } = require('sequelize');
const imexportController = {
    addImexport: async (req, res) => {
        try {
            const { type, books } = req.body;
            console.log(type);
            console.log(books);
            let bookIdSet = new Set();
            if (books) {
                for (const book of books) {
                    if (book.book_id && book.quantity) {
                        const bookId = parseInt(book.book_id, 10);
                        const bookitem = await db.Book.findOne({ where: { id: bookId } });
                        if (!bookitem) {
                            return res.status(201).json({ message: `Mã ${bookId} không tồn tại` });
                        }
                    }
                }
                for (const book of books) {
                    if (book.book_id && book.quantity) {
                        const bookId = parseInt(book.book_id, 10);
                        if (bookIdSet.has(bookId)) {
                            return res.status(201).json({ message: `Mã ${bookId} bị trùng ` });
                        }
                        bookIdSet.add(bookId);
                    }
                }
                const newimexport = await db.Imexport.create({
                    type: type,
                    status: "0"
                })
                await Promise.all(books.map(async (book) => {

                    if (book.book_id && book.quantity) {
                        const bookId = parseInt(book.book_id, 10);
                        const quantity = parseInt(book.quantity, 10);
                            await db.ImexportItem.create({
                                imexport_id: newimexport.id,
                                book_id: bookId,
                                quantity: quantity,
                            });
                    }
                }));
                return res.status(200).json({ message: 'sucessfully' });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    export: async (req, res) => {
        try {
            const exports = await db.Imexport.findAll({ where: { type: '1' } });
            return res.status(200).json({
                message: 'Successfully',
                exports: exports
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    import: async (req, res) => {
        try {
            const imports = await db.Imexport.findAll({ where: { type: '0' } });
            return res.status(200).json({
                message: 'Successfully',
                imports: imports
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getDetail: async (req, res) => {
        try {
            const id = req.params.id;
            const arrbooks = await db.ImexportItem.findAll({ where: { imexport_id: id } });
            const books = await Promise.all(arrbooks.map(async (item) => {
                const book = await db.Book.findByPk(item.book_id);

                return {
                    ...item.toJSON(),
                    name: book.name,
                };
            }));
            return res.status(200).json({
                books: books,
                message: 'Successfully',
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { id, status } = req.body;
            const history = await db.Imexport.findOne({ where: { id } });
            if (!history) {
                return res.status(404).json({ message: 'Imexport record not found' });
            }

            if (status === '2') {
                history.status = '2';
            } else {
                history.status = '1';
                const books = await db.ImexportItem.findAll({ where: { imexport_id: id } });

                if (history.type === '0') {
                    for (const book of books) {
                        const bookId = parseInt(book.book_id, 10);
                        const quantity = parseInt(book.quantity, 10);
                        const bookItem = await db.Book.findOne({ where: { id: bookId } });

                        if (bookItem) {
                            bookItem.count += quantity;
                            await bookItem.save();
                        }
                    }
                } else {
                    for (const book of books) {
                        const bookId = parseInt(book.book_id, 10);
                        const quantity = parseInt(book.quantity, 10);
                        const bookItem = await db.Book.findOne({ where: { id: bookId } });
                        if (bookItem) {
                            if (bookItem.count - quantity < 0) {
                                return res.status(201).json({ message: 'Sản phẩm không đủ' });
                            } else {
                                bookItem.count -= quantity;
                                await bookItem.save();
                            }
                        }
                    }
                }
            }
            await history.save();
            return res.status(200).json({ message: 'Successfully' });
        } catch (error) {
            console.error('Error updating status:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

};

module.exports = imexportController;
