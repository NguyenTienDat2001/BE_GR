import db from "../models/index";
const { Op } = require('sequelize');
const couponController = {

    generateRandomCouponCode: (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        let couponCode = '';
        for (let i = 0; i < length; i++) {
            couponCode += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return couponCode;
    },

    addCoupon: async (req, res) => {
        try {
            if (Object.keys(req.body).length === 0) {
                return res.status(201).json({ message: 'Request body is empty' });
            }
            for (let i = 0; i < req.body.number; i++) {
                const couponCode = couponController.generateRandomCouponCode(8);
                const coupon = await db.Coupon.create({
                    code: couponCode,
                    type: req.body.type,
                    des: req.body.des,
                    value: req.body.value,
                    point: req.body.point,
                    status: req.body.status,
                    condition: req.body.condition,
                    
                });
            }
            return res.status(200).json({ message: 'sucessfully' });


        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllCoupons: async (req, res) => {
        try {
            const coupons = await db.Coupon.findAll();
            return res.status(200).json({
                message: 'Successfully',
                coupon: coupons
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getMycoupon: async (req, res) => {
        try {
            const user_id = req.userId;

            const arrcoupons = await db.UserCoupon.findAll({ where: { user_id: user_id } });
            const coupons = await Promise.all(arrcoupons.map(async (item) => {
                const coupon = await db.Coupon.findByPk(item.coupon_id);
                return {
                    ...coupon.toJSON(),
                };
            }));
            return res.status(200).json({
                message: 'Successfully',
                coupon: coupons
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getGift: async (req, res) => {
        try {
            const coupons = await db.Coupon.findAll({ where: { status: "0" } });
            return res.status(200).json({
                message: 'Successfully',
                coupon: coupons
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    exchangeCoupon: async (req, res) => {
        try {
            const user = await db.User.findOne({ where: { id: req.userId } });
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: 'User not found',
                });
            }
            const mypoint = user.point;
            const coupon = await db.Coupon.findOne({ where: { id: req.body.coupon_id } });
            if (!coupon) {
                return res.status(404).json({
                    status: 404,
                    message: 'Coupon not found',
                });
            }
            const point = coupon.point;
            if (mypoint < point) {
                return res.status(400).json({
                    status: 400,
                    message: 'Not enough points',
                });
            } else {
                user.point -= point;
                await user.save();
                await db.UserCoupon.create({
                    user_id: user.id,
                    coupon_id: req.body.coupon_id,
                });
                coupon.status = '1';
                coupon.save();
                return res.status(200).json({
                    status: 200,
                    message: 'Exchange successful',
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                message: 'Internal server error',
            });
        }
    },


    deleteCoupon: async (req, res) => {
        try {
            const coupon = await db.Coupon.findByPk(req.params.coupon_id);
            if (!coupon) {
                return res.status(404).json({
                    message: 'Coupon not found'
                });
            }
            const usercoupon = await db.UserCoupon.findOne({ where: { coupon_id: req.params.coupon_id } });
            if (usercoupon) {
                await usercoupon.destroy();
            }
            await coupon.destroy();
            return res.status(200).json({
                status: 200,
                message: 'Delete successfully'
            });
        } catch (error) {
            console.error('Error deleting coupon:', error);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    },

    applyCoupon: async (req, res) => {

        try {
            const { price, code } = req.body;
            if (code && price) {
                const coupon = await db.Coupon.findOne({ where: { code } });

                if (!coupon) {
                    return res.status(201).json({
                        message: 'Mã không hợp lệ',
                    });
                }

                if (coupon.status !== '2') {
                    let newPrice = price;
                    if (coupon.condition) {
                        if (price >= coupon.condition) {
                            switch (coupon.type) {
                                case '1': // giam theo %
                                    newPrice = price * (1 - coupon.value / 100);
                                    break;
                                case '2': // giam theo tien
                                    newPrice = price - coupon.value;
                                    break;
                                default:
                                    break;
                            }

                            // await coupon.update({ status: '2' });

                            return res.status(200).json({
                                message: 'Successfully',
                                price: newPrice,
                            });
                        } else {
                            return res.status(202).json({
                                message: 'Không đủ điều kiện',
                            });
                        }
                    } else {
                        switch (coupon.type) {
                            case '1': // giam theo %
                                newPrice = price * (1 - coupon.value / 100);
                                break;
                            case '2': // giam theo tien
                                newPrice = price - coupon.value;
                                break;
                            default:
                                break;
                        }

                        // await coupon.update({ status: '2' });

                        return res.status(200).json({
                            message: 'Successfully',
                            price: newPrice,
                        });
                    }
                } else {
                    return res.status(203).json({
                        message: 'Đã được sử dụng',
                    });
                }
            } else {
                return res.status(204).json({
                    message: 'Trống mã',
                });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Internal Server Error',
            });
        }
    },
};

module.exports = couponController;
