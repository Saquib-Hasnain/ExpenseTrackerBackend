const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const { defaultValueSchemable } = require("sequelize/lib/utils");


const User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ispremiumuser: Sequelize.BOOLEAN,
    totalExpense: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    }
});
module.exports = User
