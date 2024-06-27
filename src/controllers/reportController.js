import db from "../models/index";
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const reportController = {
    getLine: async (req, res) => {
        try {
            // Lấy tổng account của các đơn hàng theo từng tháng của năm 2024
            const monthlyOrders1 = await db.Order.findAll({
                attributes: [
                    [Sequelize.literal('MONTH(createdAt)'), 'month'], // Lấy tháng từ trường createdAt
                    [Sequelize.fn('SUM', Sequelize.col('account')), 'totalAccounts'] // Tính tổng số lượng đơn hàng
                ],
                where: {
                    createdAt: {
                        [Op.between]: [new Date('2023-01-01'), new Date('2023-12-31')]
                    }
                },
                group: Sequelize.literal('MONTH(createdAt)'), // Nhóm theo tháng
                raw: true // Lấy dữ liệu dạng plain JSON, không phải instance của Model
            });
            const monthlyOrders2 = await db.Order.findAll({
                attributes: [
                    [Sequelize.literal('MONTH(createdAt)'), 'month'], // Lấy tháng từ trường createdAt
                    [Sequelize.fn('SUM', Sequelize.col('account')), 'totalAccounts'] // Tính tổng số lượng đơn hàng
                ],
                where: {
                    createdAt: {
                        [Op.between]: [new Date('2024-01-01'), new Date('2024-12-31')]
                    }
                },
                group: Sequelize.literal('MONTH(createdAt)'), // Nhóm theo tháng
                raw: true // Lấy dữ liệu dạng plain JSON, không phải instance của Model
            });

            // Tạo mảng kết quả để trả về
            const result1 = Array.from({ length: 12 }, (_, i) => {
                const monthData = monthlyOrders1.find(item => item.month === (i + 1));
                return monthData ? parseInt(monthData.totalAccounts) : 0;
            });
            const result2 = Array.from({ length: 12 }, (_, i) => {
                const monthData = monthlyOrders2.find(item => item.month === (i + 1));
                return monthData ? parseInt(monthData.totalAccounts) : 0;
            });

            return res.status(200).json({
                message: 'Successfully',
                monthlyOrders2023: result1,
                monthlyOrders2024: result2,
            });
        } catch (error) {
            console.error('Error retrieving monthly orders:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getColumn: async (req, res) => {
        try {
            const { year } = req.body;
            // Đếm số lượng đơn hàng theo từng tháng của năm 2024
            const monthlyOrders = await db.Order.findAll({
                attributes: [
                    [Sequelize.literal('MONTH(createdAt)'), 'month'], // Lấy tháng từ trường createdAt
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'orderCount'] // Đếm số lượng đơn hàng
                ],
                where: {
                    createdAt: {
                        [Op.between]: [new Date(`${year}-01-01`), new Date(`${year}-12-31`)]
                    }
                },
                group: Sequelize.literal('MONTH(createdAt)'), // Nhóm theo tháng
                raw: true // Lấy dữ liệu dạng plain JSON, không phải instance của Model
            });

            // Tạo mảng kết quả chỉ chứa số lượng đơn hàng của từng tháng
            const result = Array.from({ length: 12 }, (_, i) => {
                const monthData = monthlyOrders.find(item => item.month === (i + 1));
                return monthData ? parseInt(monthData.orderCount) : 0;
            });

            return res.status(200).json({
                message: 'Successfully',
                data: result
            });
        } catch (error) {
            console.error('Error retrieving monthly orders:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAge: async (req, res) => {
        try {
            const users = await db.User.findAll({ where: { role: "2" } });
            const currentYear = new Date().getFullYear();
            let under18 = 0;
            let between18And30 = 0;
            let over30 = 0;
            users.forEach(user => {
                if (user.DOB) {
                    const birthYear = new Date(user.DOB).getFullYear();
                    const age = currentYear - birthYear;

                    if (age < 18) {
                        under18++;
                    } else if (age <= 30) {
                        between18And30++;
                    } else {
                        over30++;
                    }
                } else {
                    between18And30++;
                }
            });
            return res.status(200).json({
                message: 'Successfully',
                data: [under18, between18And30, over30],
            });
        } catch (error) {
            console.error('Error retrieving monthly orders:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getNumber: async (req, res) => {
        try {
            const count1 = await db.User.count({
                where: {
                    role: "2"
                }
            });
            const count2 = await db.Order.count();
            const totalAmount = await db.Order.sum('account', {
                where: {
                    status: "0"
                }
            });
            return res.status(200).json({
                message: 'Successfully',
                user: count1,
                order: count2,
                total: totalAmount
            });
        } catch (error) {
            console.error('Error retrieving monthly orders:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

};

module.exports = reportController;
