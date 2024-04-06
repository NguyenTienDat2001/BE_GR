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
                return res.status(200).json({ message: 'Request body is empty' });
            }
            const couponCode = couponController.generateRandomCouponCode(8);
            const coupon = await db.Coupon.create({
                code: couponCode,
                type: req.body.type,
                des: req.body.des,
                start_date: req.body.start_date,
                end_date: req.body.end_date
            });
            return res.status(200).json({ message: 'sucessfully', coupon: coupon });


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

    deleteCoupon: async (req, res) => {
        try {
            const coupon = await db.Coupon.findByPk(req.params.coupon_id);
            if (!coupon) {
                return res.status(404).json({
                    message: 'Coupon not found'
                });
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
    }


};

module.exports = couponController;
