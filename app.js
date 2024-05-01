const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser");
const sequelize = require("./util/database")
const userRouter = require("./routes/user")
const expenseRouter = require("./routes/expense")
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require('./routes/premiumFeature')
const forgetpasswordRoutes = require("./routes/forgetpassword")
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet')



const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const Forgotpassword = require('./models/forgetpassword');
const FileUrlModel = require('./models/fileUrl')


app.use(cors())
app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/expense', expenseRouter)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeatureRoutes)
app.use('/password', forgetpasswordRoutes)
app.use(helmet())




User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(FileUrlModel);
FileUrlModel.belongsTo(User);


sequelize
    .sync().then(res => {
        console.log("Table Created Successful")
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server is running on port 3000")
        })
    }).catch(err => {
        console.log(err)
    })