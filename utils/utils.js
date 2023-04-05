const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET;

// const tokenAuthenticator = async (browserToken, dbToken) => {

// }

// Save to the database
class saveToDb {
    constructor(dataToSave, modelName) {
        this.dataToSave = dataToSave;
        this.modelName = modelName;
    }

    save = async () => {
        const data = new this.modelName(this.dataToSave);
        await data.save();
    }
}

// Delete Data In Database
class deleteInDb {
    constructor(id, modelName) {
        this.id = id;
        this.modelName = modelName;
    }

    delete = async () => {
        try {
            await this.modelName.findOneAndDelete(this.id);
        } catch (error) {
            console.error(error.message);
            return error.message;
        }
    }
}

// Encryption Verifier
const validateEncryption = async (provided, original) => {
    return await bcrypt.compare(provided, original)
}

module.exports = {

    // <---- Status code and message handlers
    setSuccess: (statusCode, message, data) => {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.type = 'success';
    },

    setError: (statusCode, message) => {
        this.statusCode = statusCode;
        this.message = message;
        this.type = 'error';
    },

    send: (res) => {
        const result = {
            status: this.type,
            message: this.message,
            data: this.data,
            statusCode: this.statusCode,
        };

        if (this.type === 'success') {
            return res.status(this.statusCode).json(result);
        }
        return res.status(this.statusCode).json({
            status: this.type,
            message: this.message,
            statusCode: this.statusCode,
        });
    },
    // Status code and message handlers ---->

    // Check if required fields are provided
    validateFields: (requiredField, recievedField) => {
        let required = requiredField;
        for (let field in required) {
            if (!recievedField.includes(required[field])) {
                return false;
            }
        }
        return true;
    },

    // Generate token for users
    tokenGenerator: (id) => {
        const token = jwt.sign({ id }, JWT_SECRET);
        return token
    },

    // Data encryption
    encryptData: async (dataToEncrypt) => {
        const encrypted = await bcrypt.hash(dataToEncrypt, 10)
        return encrypted
    },

    // Validate user Login details
    validateUser: async (id, password) => {
        const user = await User.findOne({ id })
        if (!user) {
            return false
        } else if (!await validateEncryption(password, user.password)) {
            return false
        } else {
            return true
        }
    },
    deleteInDb,
    saveToDb,
    validateEncryption
};