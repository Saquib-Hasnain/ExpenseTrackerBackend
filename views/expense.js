const form = document.querySelector('form');
    form.addEventListener('submit', addNewExpense);



async function addNewExpense(e) {
    try {
        e.preventDefault();
        const expenseDetails = {
            expenseamount: e.target.expenseamount.value,
            description: e.target.description.value,
            category: e.target.category.value,
        }
        const token = localStorage.getItem('token')
        const response = await axios.post("https://51.20.177.197:3000/expense/addexpense", expenseDetails, { headers: { "Authorization": token } })
        addNewExpensetoUI(response.data.expense)
        e.target.expenseamount.value = '';
        e.target.description.value = '';
        e.target.category.value = '';
    } catch (err) {
        document.body.innerHTML += `<div style="color:red;">${err}</div>`;

    }
}
function addNewExpensetoUI(expense) {
    const parentElement = document.getElementById("expenseList");
    let listItem = document.createElement('li');
    listItem.id = `expense-${expense.id}`;
    listItem.innerHTML = `
        <b>Expense Amount</b>: ${expense.expenseamount} -
        <b>Category</b>: ${expense.category} -
        <b>Description</b>: ${expense.description}
    `;
    
    // Create a new button for deleting the expense
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Expense';
    deleteButton.addEventListener('click', function(event) {
        deleteExpense(expense.id);
    });

    listItem.appendChild(deleteButton);
    
    
    parentElement.appendChild(listItem);
}
function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "<b>You are a premium user</b>"
    document.getElementById('message').style.display = "block"
    document.getElementById('downloadexpense').style.display = "block"



}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
const page = 1

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('token')
        const decodeToken = parseJwt(token)
        console.log(decodeToken)
        const ispremiumuser = decodeToken.ispremiumuser
        if (ispremiumuser) {
            showPremiumuserMessage()
            showLeaderboard()
        }
        const response = await axios.get(`https://51.20.177.197:3000/expense/getexpense?page=${page}`, { headers: { "Authorization": token } });

        response.data.expenses.forEach(expense => {
            addNewExpensetoUI(expense)

        });
        showPagination(response.data)
    } catch (err) {
        document.body.innerHTML += `<div style="color:red;">${err}</div>`;
    }
})
async function deleteExpense( expenseid) {

    try {
        const token = localStorage.getItem('token')
        const result = await axios.delete(`https://51.20.177.197:3000/expense/deleteexpense/${expenseid}`, { headers: { "Authorization": token } })
        removeExpenseFromUI(expenseid)

    } catch (err) {
        document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
    }
}
function removeExpenseFromUI(expenseId) {
    const expenseElemId = `expense-${expenseId}`;
    document.getElementById(expenseElemId).remove()
}
function showLeaderboard() {
    const inputEle = document.createElement('input')
    inputEle.type = "button"
    inputEle.value = "Show LeaderBoard"
    inputEle.onclick = async () => {

        const token = localStorage.getItem('token')

        const userLeaderBoardArray = await axios.get('https://51.20.177.197:3000/premium/showLeaderBoard', { headers: { "Authorization": token } })
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li> <b>Name :</b> ${userDetails.name} - <b> Total Expense : </b> ${userDetails.totalExpense || 0} </li>`
        })
        urlLink()
    }

    document.getElementById("message").appendChild(inputEle)

}

async function urlLink() {
    const token = localStorage.getItem('token')
    const downloadedLink = await axios.get('https://51.20.177.197:3000/premium/fileurl', { headers: { "Authorization": token } })

    var url = document.getElementById('urlLink')
    url.innerHTML += '<h1> Prevoius Expense List </h1>'
    downloadedLink.data.link.forEach((link) => {
        url.innerHTML += `<li> <b> Download link :</b> <a href="${link.FileUrl}">${link.createdAt}</a>  </li>`
    })
}




async function download() {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get('https://51.20.177.197:3000/expense/download', { headers: { "Authorization": token } })
        if (response.status === 200) {
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        }
    } catch (err) {
        document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
    }
}
document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response = await axios.get('https://51.20.177.197:3000/purchase/premiummembership', { headers: { "Authorization": token } });
    console.log(response)

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post('https://51.20.177.197:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })
            console.log(res)
            alert('You are a Premium User Now')
            document.getElementById('rzp-button1').style.visibility = "hidden"
            document.getElementById('message').innerHTML = "<b>You are a premium user</b>"
            document.getElementById('message').style.display = "block",
                localStorage.setItem('token', res.data.token)
            showLeaderboard()
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment.failed', function (response) {
        console.log(response)
        alert('Something Went wrong')
    })

}
async function getProducts(page) {
    const token = localStorage.getItem('token')
    const response = await axios.get(`https://51.20.177.197:3000/expense/getexpense?page=${page}`, { headers: { "Authorization": token } })


    console.log(response)
    response.data.expenses.forEach(expense => {
        addNewExpensetoUI(expense)
        showPagination(response.data)




    });


}

function showPagination({
    currentPage,
    hasNextPage,
    hasPreviousPage,
    lastPage,
    nextPage,
    previousPage

}) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear existing pagination buttons

    // Button to go to the first page
    if (currentPage > 1) {
        const firstPageBtn = document.createElement('button');
        firstPageBtn.innerHTML = 'First';
        firstPageBtn.onclick = () => getProducts(1);
        pagination.appendChild(firstPageBtn);
    }

    // Button to go to the previous page
    if (hasPreviousPage) {
        const prevPageBtn = document.createElement('button');
        prevPageBtn.innerHTML = previousPage;
        prevPageBtn.onclick = () => getProducts(previousPage);
        pagination.appendChild(prevPageBtn);
    }

    // Current page button or indicator
    const currentPageBtn = document.createElement('button');
    currentPageBtn.innerHTML = `<strong>${currentPage}</strong>`;
    currentPageBtn.disabled = true; // Make it disabled or styled differently to indicate active state
    pagination.appendChild(currentPageBtn);

    // Button to go to the next page
    if (hasNextPage) {
        const nextPageBtn = document.createElement('button');
        nextPageBtn.innerHTML = nextPage;
        nextPageBtn.onclick = () => getProducts(nextPage);
        pagination.appendChild(nextPageBtn);
    }

    // Button to go to the last page
    if (currentPage < lastPage) {
        const lastPageBtn = document.createElement('button');
        lastPageBtn.innerHTML = 'Last';
        lastPageBtn.onclick = () => getProducts(lastPage);
        pagination.appendChild(lastPageBtn);
    }
}


