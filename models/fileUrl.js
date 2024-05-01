const Sequelize = require('sequelize')
const sequelize = require("../util/database")

const fileUrl = sequelize.define('fileUrl', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    FileUrl: {
        type: Sequelize.STRING
    }
})

module.exports = fileUrl
