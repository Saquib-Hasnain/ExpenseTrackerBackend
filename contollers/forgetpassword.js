const User = require('../models/user')
const SibApiV3Sdk = require('@getbrevo/brevo');
const uuid = require("uuid")
const Forgotpassword = require('../models/forgetpassword');
const bcrypt = require('bcrypt')


const forgotpassword = async (req, res) => {
    try {

        const { email } = req.body;
        const id = uuid.v4();
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        //const userid=user.id;
        await Forgotpassword.create({ id, active: true, UserId: user.id })

        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        let apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = process.env.API_KEY

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.subject = "Forget Password";
        sendSmtpEmail.htmlContent = `<h2> Click on Link To reset Password</h2>
        <a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`;
        sendSmtpEmail.sender = { "name": "Server", "email": "saquibhasnain786@gmail.com" };
        sendSmtpEmail.to = [{ "email": user.email }];
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
        console.log('API called successfully. Returned data: ' + JSON.stringify(data))
        return res.status(202).json({ message: 'Link to reset password sent to your mail ', sucess: true, data: data })


    } catch (err) {
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = async (req, res) => {
    const id = req.params.id;

    try {
        const forgotPasswordRequest = await Forgotpassword.findOne({ where: { id, active: true } });

        if (!forgotPasswordRequest) {
            return res.status(404).send("Password reset request not found or has already been used.");
        }
        //await forgotPasswordRequest.update({ active: false });
        res.status(200).send(`
            <html>
                <head>
                    <title>Reset Password</title>
                </head>
                <body>
                    <form action="/password/updatepassword/${id}" method="get" onsubmit="formSubmitted(event)">
                        <label for="newpassword">Enter New Password:</label>
                        <input name="newpassword" type="password" required></input>
                        <button type="submit">Reset Password</button>
                    </form>
                    <script>
                        function formSubmitted(e) {
                            e.preventDefault();
                    </script>
                </body>
            </html>
        `);

    } catch (error) {
        console.error('Error handling reset password request:', error);
        res.status(500).send("Internal Server Error");
    }
}


const updatepassword = async (req, res) => {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    try {
        const resetPasswordRequest = await Forgotpassword.findOne({ where: { id: resetpasswordid, active: true } });
        if (!resetPasswordRequest) {
            return res.status(404).json({ error: 'Reset password request not found or already processed', success: false });
        }

        const user = await User.findOne({ where: { id: resetPasswordRequest.UserId } });
        if (!user) {
            return res.status(404).json({ error: 'No user exists', success: false });
        }

        const saltrounds = 10;
        const hash_password = await bcrypt.hash(newpassword, saltrounds)

        await user.update({ password: hash_password });

        await resetPasswordRequest.update({ active: false });

        res.status(201).json({ message: 'Successfully updated the new password' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: error.message, success: false });
    }
};



module.exports = {
    forgotpassword: forgotpassword,
    resetpassword: resetpassword,
    updatepassword: updatepassword
}

