const sequelize = require("../util/database");
const Expense = require("../models/expense")
const User = require("../models/user")
const FileUrlModel = require("../models/fileUrl")
const S3Service = require('../Services/S3services')


const downloadexpense = async (req, res) => {
    try {
        if (!req.user.ispremiumuser) {
            return res.status(401).json({ success: false, message: 'User is not a premium User' })
        }
        console.log(req.user)
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });

        const stringifedExpenses = JSON.stringify(expenses)
        console.log(req.user.id)

        const filename = `Expense${req.user.id}/${new Date()}.txt`;
        const fileUrl = await S3Service.uploadToS3(stringifedExpenses, filename)

        const fileDownloadLink = await FileUrlModel.create({ FileUrl: fileUrl, UserId: req.user.id })

        res.status(200).json({ fileUrl, fileDownloadLink, success: true })
    } catch (err) {
        return res.status(402).json({ error: err, success: false })
    }
}

const addexpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {

        const { expenseamount, description, category } = req.body;
        if (expenseamount == undefined || expenseamount.length === 0) {
            return res.status(400).json({ success: false, message: 'Parameters missing' })
        }
        const expense = await Expense.create({ expenseamount, description, category, UserId: req.user.id }, { transaction: t })
        const totalExpense = Number(req.user.totalExpense) + Number(expenseamount)

        await User.update({ totalExpense: totalExpense }, { where: { id: req.user.id }, transaction: t })
        await t.commit()
        return res.status(201).json({ expense, success: true });

    } catch (err) {
        await t.rollback()
        res.status(500).json(err)

    }
}
const getexpense = async (req, res) => {

    const ITEMS_PER_PAGE = 2
    try {
        const page = +req.query.page || 1;
        let totalItems;
        const total = await Expense.count()
        totalItems = total
        const expenses = await Expense.findAll({
            where: { userId: req.user.id },
            offset: (page - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE
        });
        return res.status(200).json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        })

    } catch (err) {
        return res.status(402).json({ error: err, success: false })
    }
}
const deleteexpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {

        const expenseid = req.params.expenseid;
        if (expenseid == undefined || expenseid.length === 0) {
            return res.status(400).json({ success: false, })
        }
        const expense = await Expense.findOne({
            where: {
                id: expenseid,
                UserId: req.user.id
            },
            transaction: t
        });
        await Expense.destroy({ where: { id: expenseid, UserId: req.user.id }, transaction: t })
        const totalExpense = Number(req.user.totalExpense) - Number(expense.expenseamount);
        await User.update({ totalExpense: totalExpense }, { where: { id: req.user.id }, transaction: t })
        await t.commit()
        return res.status(200).json({ success: true, message: "Delete Successfully" })


    } catch (err) {
        await t.rollback()

        return res.status(500).json({ error: err, success: false })

    }
}

module.exports = {
    addexpense: addexpense,
    getexpense: getexpense,
    deleteexpense: deleteexpense,
    downloadexpense: downloadexpense
}
