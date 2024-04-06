const bookController = {
  getAllBooks: (req, res) => {
    res.send("Trả về tất cả sách");
  },

  createBook: (req, res) => {
    res.send("Tạo mới sách");
  },

  updateBook: (req, res) => {
    res.send("Cập nhật sách");
  },

  deleteBook: (req, res) => {
    res.send("Xóa sách");
  },
};

export default bookController;
