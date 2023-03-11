let loginbtn = document.getElementById('loginbtn')
let account = document.getElementById('inputac')
let password = document.getElementById('inputpw')

loginbtn.addEventListener('click', function () {
    loginbtn.disabled = true
    getAuth()
    setTimeout(()=>{
        loginbtn.disabled = false
    },2000)
})
function getAuth() {
    axios.post('/admin/api.auth', {
        account: account.value,
        password: password.value
    }).then((res) => {
        let auth = res.data.auth
        if (auth) {
            window.location.href = "/admin"
        } else {
            let alert = document.getElementById('alert')
            alert.innerHTML = '管理帳號或密碼錯誤'
            loginbtn.disabled = false

        }
    }).catch((err) => {
        console.log(err);
    })
}


window.addEventListener('keydown', function (e) {
    if (e.code == 'Enter') {
        loginbtn.click()
    }
})