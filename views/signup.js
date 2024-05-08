

const signup=async function signup(e) {
    try {
        e.preventDefault();
        console.log(e.target.email.value);

        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
        console.log(signupDetails)
        const response = await axios.post("http://51.20.177.197:3000/user/signup", signupDetails)
        window.location.href = "./login.html"



    } catch (err) {
        document.body.innerHTML += `<div style="color:red;">${err}</div>`;

    }

}
const form = document.querySelector('form');
    form.addEventListener('submit', signup);
