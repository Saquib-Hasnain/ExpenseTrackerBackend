console.log("Script loaded");


const login=async function login(e) {    
    try {
       e.preventDefault();


        const loginDetails = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        
        console.log(loginDetails)
        const response = await axios.post("http://51.20.177.197:3000/user/login", loginDetails)
        alert(response.data.message)
        localStorage.setItem('token', response.data.token)
        window.location.href = "./expense.html"


    } catch (err) {
        document.body.innerHTML += `<div style="color:red;">${err}</div>`;

    }

}
const form = document.querySelector('form');
    form.addEventListener('submit', login);
