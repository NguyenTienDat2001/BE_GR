import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const authService = {
    handleUserLogin: (email, password) => {
      return new Promise(async (resolve, reject) => {
        try {
          const user = await authService.checkUserEmail(email);
          if (user) {
            // compare password
            let checkPassword = await bcrypt.compareSync(password, user.password);
            if (checkPassword) {
              const { password, ...data } = user;
              resolve({
                errorCode: 0,
                message: "Ok",
                data: data,
              });
            } else {
              resolve({
                errorCode: 1,
                message: "Wrong password",
                data: {},
              });
            }
          } else {
            resolve({
              errorCode: 2,
              message:
                "Your's email isn't exist in your system. Please try other email!",
              data: {},
            });
          }
        } catch (e) {
          reject(e);
        }
      });
    },

  checkUserEmail: (userEmail) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db.User.findOne({
          where: { email: userEmail },
          raw: true,
        });
        if (user) {
          resolve(user);
        } else {
          resolve(false);
        }
      } catch (e) {
        reject(e);
      }
    });
  },

  handleCreateNewUser: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await authService.checkUserEmail(data.email);
        if (user) {
          resolve({
            errorCode: 1,
            message: "Email is existed in system",
          });
        } else {
          let hashPasswordFromBcrypt = await authService.hashUserPassword(
            data.password
          );
          await db.User.create({
            ...data,
            password: hashPasswordFromBcrypt,
          });
          resolve({
            errorCode: 0,
            message: "OK",
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  },

  hashUserPassword: (password) => {
    return new Promise(async (resolve, reject) => {
      try {
        let hashPassword = await bcrypt.hashSync(password, salt);
        resolve(hashPassword);
      } catch (e) {
        reject(e);
      }
    });
  },
};

module.exports = authService;
