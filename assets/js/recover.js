firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = "home.html";
    }
}) //impede o usuário logado de acessar a tela de redefinir sem deslogar

document.addEventListener("keypress", function(e) {
  if(e.key === 'Enter') {
    var btn = document.querySelector("#recover-password-button");
    btn.click();
  }
}); //quando clicar no enter, ativar botão de redefinir


function onChangeEmail() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
}

function recoverPassword() {
    firebase.auth().sendPasswordResetEmail(form.email().value).then(() => {
        alert('Email enviado com sucesso');
    }).catch(error => {
        alert(getErrorMessage(error));
    });
}

function getErrorMessage(error) {
    if (error.code == "auth/user-not-found") {
        return "Usuário não encontrado";
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

function login() {
	window.location.href = "../index.html";
}

function register() {
	window.location.href = "register.html";
}

const form = {
    email: () => document.getElementById("email"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error")
}
