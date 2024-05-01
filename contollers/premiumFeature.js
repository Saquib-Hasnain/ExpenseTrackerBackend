const User = require('../models/user')
const FileUrlModel = require('../models/fileUrl')

const getUserLeaderBoard = async (req, res) => {
    try {
        // Brute Force Way to solve this
        /**  const users= await User.findAll();
         const expenses = await Expense.findAll();
         const userAggregatedExpense={}
         expenses.forEach((expense) => {
             if(userAggregatedExpense[expense.UserId]){
                 userAggregatedExpense[expense.UserId]= userAggregatedExpense[expense.UserId] + expense.expenseamount
             }else{
                 userAggregatedExpense[expense.UserId]=expense.expenseamount
             }
         });
         console.log(userAggregatedExpense)
         //res.status(200).json(userAggregatedExpense)
         var userLeaderBoardDetails=[]
         users.forEach((user)=>{
             userLeaderBoardDetails.push({name:user.name,total_cost: userAggregatedExpense[user.id] || 0})
 
         })
         userLeaderBoardDetails.sort((a, b)=> b.total_cost- a.total_cost)
         console.log(userLeaderBoardDetails)
         res.status(200).json(userLeaderBoardDetails) **/
        const leaderboardofusers = await User.findAll({

            order: [['totalExpense', 'DESC']]

        })

        res.status(200).json(leaderboardofusers)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
const FileUrlLink = async (req, res) => {
    try {
        const link = await FileUrlModel.findAll({
            where: { userId: req.user.id },
            order: [['FileUrl', 'DESC']]
        });
        return res.status(200).json({ link, success: true })

    } catch (err) {
        return res.status(402).json({ error: err, success: false })
    }
}
module.exports = {
    getUserLeaderBoard,
    FileUrlLink
}