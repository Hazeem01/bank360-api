require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');
const util = require('../utils/utils');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    signup: async (req, res) => {
        let { firstName, lastName, password, phone, email, username, secretQuestion, secretAnswer, dob, home, city, postalCode, state } = req.body;
        const requiredField = [
            'firstName', 'lastName',
            'dob', 'home',
            'city', 'postalCode',
            'state', 'phone',
            'email', 'username',
            'secretQuestion', 'secretAnswer',
            'password'];
        const receivedFields = Object.keys(req.body);
        if (!util.validateFields(requiredField, receivedFields)) {
            util.setError(400, `Please, provide complete details!`);
            return util.send(res);
        };
        if (password.length < 8) {
            util.setError(400, `Password too small, it should be a minimum of 8 characters!`);
            return util.send(res);
        }

        password = await util.encryptData(password);
        secretAnswer = await util.encryptData(secretAnswer);

        const dataToSave = new util.saveToDb({
            firstName, lastName, password, phone, email, username, secretQuestion, secretAnswer, dob, home, city, postalCode, state
        }, User);
        try {
            await dataToSave.save();
            util.setSuccess(200, `User: ${username} Created Successfully!`)
            return util.send(res);
        } catch (error) {
            if (error.code == 11000) {
                const errorInfo = error.keyValue
                if (errorInfo.username) {
                    util.setSuccess(400, `Username: ${errorInfo.username} is already taken!`)
                    return util.send(res);
                } else if (errorInfo.email) {
                    util.setSuccess(400, `A user with Email: ${errorInfo.email} already exists!`)
                    return util.send(res);
                } else {
                    util.setSuccess(400, `A user with Phone: ${errorInfo.phone} already exists!`)
                    return util.send(res);
                }
            }
            console.log(error);
            util.setSuccess(400, 'Error while signing up! Please contact admin')
            return util.send(res);
        }
    },

    login: async (req, res) => {
        const { password, id } = req.body;
        const requiredField = ["id", "password"];
        const receivedFields = Object.keys(req.body);
        if (!util.validateFields(requiredField, receivedFields)) {
            util.setError(400, `Please, provide complete details!`);
            return util.send(res);
        };

        const userValidation = await util.validateUser(id, password)
        if (!userValidation) {
            util.setError(400, `Invalid username/password`);
            return util.send(res);
        }

        if (userValidation) {
            const token = util.tokenGenerator(id);
            const user = await User.findOne({ id });
            const userId = user._id
            try {
                const saveToken = new util.saveToDb({ userId, accessToken: token }, Token);
                try {
                    await saveToken.save();
                } catch (error) {
                    if (error.code == 11000) {
                        try {
                            await Token.updateOne({ userId },
                                { $set: { accessToken: token } });
                        } catch (error) {
                            console.error(error);
                            util.setSuccess(400, 'Unable to signin at the moment... Try again later')
                            return util.send(res);
                        }
                    } else {
                        console.error(error);
                        util.setError(400, 'Error while signing in! Please contact admin')
                        return util.send(res)
                    }
                }
                util.setSuccess(200, user)
                return util.send(res);
            }
            catch (error) {
                util.setError(400, 'Error while logging in! Please contact admin');
                console.log(error.message);
                return util.send(res);
            }
        }
    },

    reset: async (req, res) => {
        const { id, password, secretAnswer } = req.body;
        const requiredField = ["id", "password", "secretAnswer"];
        const receivedFields = Object.keys(req.body);
        if (!util.validateFields(requiredField, receivedFields)) {
            util.setError(400, `Please, provide complete details!`);
            return util.send(res);
        }

        if (await util.validateUser(id, password) == null) {
            util.setError(400, `User: ${id} does not exist !`);
            return util.send(res);
        }
        const user = await User.findOne({ id });
        const userId = user._id;
        if (await util.validateEncryption(secretAnswer, user.secretAnswer)) {
            const newPassword = await util.encryptData(password);
            try {
                await User.updateOne({ userId },
                    { $set: { password: newPassword } });
            } catch (error) {
                console.error(error.message);
                util.setError(400, 'Error while reseting password! Please contact admin')
                return util.send(res);
            }
            util.setSuccess(200, `Password Updated Successfully !`);
            return util.send(res);
        }
        util.setError(400, `The informations you provided do not match with the user: ${id} !`);
        return util.send(res);
    },

    logout: async (req, res) => {
        const user = req.header;
        try {
            new util.deleteInDb(user, Token).delete();
        } catch (error) {
            util.setError(400, error)
            return util.send(res)
        }  
        util.setSuccess(200, `User Logged Out !`)
        return util.send(res)
    },

    tokenAuthenticator: async (req, res, next) => {
        try {
            const browserToken = req.header('Authorization').split(' ')[1];
            const decoded = jwt.verify(browserToken, JWT_SECRET);
            const decodedUserId = decoded.id
            const dbUser = await Token.findOne({ decodedUserId });

            if (dbUser.token == browserToken) {
                req.user = dbUser;
                req.token = dbToken;
                next();
            } else {
                util.setSuccess(400, `Error while authenticating user`);
                return util.send(res);
            }
        } catch (error) {
            util.setSuccess(400, `Authentication failed!`);
            return util.send(res)
        }
    },

    fetchProfile: async (req, res) => {
        const user = req.user;
        try {
            util.setSuccess(200, user);
            util.send(res)
        } catch (error) {
            util.setSuccess(400, `Profile data not available right now...Try again later.`);
            return util.send(res);
        }
    }
}