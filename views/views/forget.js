async function forgetpassword(e) {
    try {
        e.preventDefault();
        const userDetails = {
            email: e.target.email.value
        }
        const response = await axios.post('http://localhost:3000/password/forgotpassword', userDetails)
        if (response.status === 202) {
            document.body.innerHTML += `<div style="color:red;">Mail Successfully Send</div>`
        }

    } catch (err) {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`
    }
}