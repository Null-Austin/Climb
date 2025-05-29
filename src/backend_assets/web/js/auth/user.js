let page = window.location.pathname;
if (page.endsWith('login')){
    page = 'login';
} else if (page.endsWith('signup')){
    page = 'signup';
}
window.addEventListener('DOMContentLoaded',e=>{ /* webstorm, for the love of god, i will use e and not (), if i have 500 differnet listeners thats 500 saved chars. or almost 4000 bits :O*/
    let login = document.querySelector('#login');
    let signup = document.querySelector('#register');

    login.disabled = false
    signup.disabled = false

    if (page === 'login'){
        signup.addEventListener('click',()=>{
            window.location.href='/auth/signup'
        })
    } else if (page === 'signup'){
        login.addEventListener('click',()=>{
            window.location.href='/auth/login'
        })
    }
})