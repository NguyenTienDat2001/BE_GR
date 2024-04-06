import db from "../models/index";
const jwt = require("jsonwebtoken");

const permissionPage = {
    checkPermission: (permission) => {
        return async (req, res, next) => {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ message: 'Token is missing' });
            }
            // const user_id = req.session.userId;
            // Xác minh tính hợp lệ của token
            const decoded = jwt.verify(token, ' ');
            // Lấy userId từ decoded
            const user_id = decoded.userId;
            try {
                let permiss = await db.PermissUser.findOne({
                    where: { user_id: user_id, permiss_id: permission },
                });
                if (permiss) {
                    next();
                } else {
                    return res.status(201).json({ message: 'No permission' });
                }
            } catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        };
    },

    // Middleware để xác minh JWT
    verifyToken: (req, res, next) => {
        // Lấy token từ header của request
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Token is missing' });
        }
        try {
            // Xác minh tính hợp lệ của token
            const decoded = jwt.verify(token, ' ');
            // Lấy userId từ decoded
            const userId = decoded.userId;
            // Gắn userId vào request để sử dụng trong các xử lý sau này
            req.userId = userId;
            // Tiếp tục xử lý request
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Token is invalid' });
        }
    },
};

module.exports = permissionPage;
