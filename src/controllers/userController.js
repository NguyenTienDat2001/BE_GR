import db from "../models/index";
const { Op } = require('sequelize');
const userController = {

    getUser: async (req, res) => {
        try {
            const users = await db.User.findAll({ where: { role: "2" } });
            return res.status(200).json({ message: 'successfully', users: users });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAdmin: async (req, res) => {
        try {
            const admins = await db.User.findAll({ where: { role: "1" } });
            const adminWithPermiss = await Promise.all(admins.map(async (admin) => {
                const permissarr = await db.PermissUser.findAll({ where: { user_id: admin.id } });
                const permissIds = permissarr.map(permiss => permiss.permiss_id);
                return {
                    ...admin.toJSON(),
                    permiss: permissIds
                };
            }));
            return res.status(200).json({ message: 'successfully', admins: adminWithPermiss });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    updatePermiss: async (req, res) => {
        try {
            const { userId, permiss } = req.body;
            const permissarr = await db.PermissUser.findAll({ where: { user_id: userId } });
            const oldpermiss = permissarr.map(permiss => permiss.permiss_id);
            const rolesToAdd = permiss.filter(role => !oldpermiss.includes(role));
            const rolesToRemove = oldpermiss.filter(role => !permiss.includes(role));
            await Promise.all(rolesToAdd.map(async (item) => {
                try {
                    // Thêm quyền mới vào cơ sở dữ liệu
                    await db.PermissUser.create({
                        user_id: userId,
                        permiss_id: item,
                    });
                    console.log(`Thêm quyền ${item} cho người dùng ${userId} vào cơ sở dữ liệu thành công`);
                } catch (error) {
                    console.error(`Lỗi khi thêm quyền ${item} cho người dùng ${userId} vào cơ sở dữ liệu:`, error);
                }
            }));
            await Promise.all(rolesToRemove.map(async (item) => {
                try {
                    // Thêm quyền mới vào cơ sở dữ liệu
                    await db.PermissUser.destroy({
                        where: {
                            user_id: userId,
                            permiss_id: item,
                        },
                    });
            
                } catch (error) {
                    console.error(`Lỗi khi xoa quyền ${item} cho người dùng ${userId} khoi cơ sở dữ liệu:`, error);
                }
            }));
            return res.status(200).json({ message: 'successfully'});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

};

module.exports = userController;
