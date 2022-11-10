firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = "home.html";
    }
}) //impede o usuário logado de acessar a tela de cadastro sem deslogar

document.addEventListener("keypress", function(e) {
  if(e.key === 'Enter') {
    var btn = document.querySelector("#login-button");
    btn.click();
  }
}); //quando clicar no enter, ativar botão de login

function onChangeEmail() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
}

function onChangePassword() { 
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
}

function login() {   
    if (form.email().value == "" || form.password().value == "") {
        alert("Preencha todos os campos");
    } else {
        
        firebase.auth().signInWithEmailAndPassword(
        form.email().value, form.password().value
            ).then(response => {
                //showLoading();
                window.location.href = "home.html"; //se o usuário for encontrado, abrir o home
            }).catch(error => {
                alert(getErrorMessage(error));
        }); 
    }
}

function getErrorMessage(error) {
    if (error.code == "auth/user-not-found") {
        return "Usuário não encontrado";
    }
    if (error.code == "auth/wrong-password") {
        return "Senha inválida";
    }
    if (error.code == "auth/invalid-email") {
        return "Email inválido";
    }
    return error.message;
}

function isEmailValid() {
    const email = form.email().value;
    if (!email) {
        return false;
    }
    return validateEmail(email);
}

function register() {
    window.location.href = "register.html";
}

function recoverPassword() {
    window.location.href = "recover.html";
}

const form = {
    email: () => document.getElementById("email"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    password: () => document.getElementById("password"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    recoverPassword: () => document.getElementById("recover-password-button")
}