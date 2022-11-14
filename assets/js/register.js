firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = "home.html";
    }
}) //impede o usuário logado de acessar a tela de cadastro sem deslogar

document.addEventListener("keypress", function(e) {
  if(e.key === 'Enter') {
    var btn = document.querySelector("#register-button");
    btn.click();
  }
}); //quando clicar no enter, ativar botão de cadastrar

function onChangeEmail() {
	const email = form.email().value; 
	form.emailRequiredError().style.display = email ? "none" : "block"; //email obrigatório
	form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block"; //email inválido
}

function onChangePassword() {
	const password = form.password().value;
	form.passwordRequiredError().style.display = password ? "none" : "block"; //senha obrigatória
	form.passwordMinLengthError().style.display = password.length >= 6 ? "none" : "block"; //senha deve ter no min 6 caracteres
	validatePasswordMatch(); //validar se as senhas são iguais
}

function onChangeConfirmPassword() {
	validatePasswordMatch(); 
}

function register() {
	const email = form.email().value;
	const password = form.password().value;
	const confirmPassword = form.confirmPassword().value;
	if (email == "" || password == "" || confirmPassword.value == "") {
		alert("Preencha todos os campos");
	} else if (password == confirmPassword)  {
		firebase.auth().createUserWithEmailAndPassword(
		email, password
		).then(() => {
			window.location.href = "home.html"; //se o usuário for cadastrado, abrir o home
		}).catch(error => {
			alert(getErrorMessage(error));
		});
	}
	
}

function getErrorMessage(error) {
	if (error.code == "auth/weak-password") {
		return "A senha deve ter no mínimo 6 caracteres";
	}
	if (error.code == "auth/email-already-in-use") {
		return "Email já está em uso";
	}
	if (error.code == "auth/invalid-email") {
        return "Email inválido";
    }
	return error.message;
}

function validatePasswordMatch() {
	const password = form.password().value;
	const confirmPassword = form.confirmPassword().value;
	form.confirmPasswordDoesntMatchError().style.display =
		password == confirmPassword ? "none" : "block"; //senhas devem ser iguais
}

function login() {
	window.location.href = "../index.html";
}

const form = {
	confirmPassword: () => document.getElementById("confirmPassword"),
	confirmPasswordDoesntMatchError: () => document.getElementById("password-doesnt-match-error"),
	email: () => document.getElementById("email"),
	emailInvalidError: () => document.getElementById("email-invalid-error"),
	emailRequiredError: () => document.getElementById("email-required-error"),
	password: () => document.getElementById("password"),
	passwordRequiredError: () => document.getElementById("password-required-error"),
	passwordMinLengthError: () => document.getElementById("password-min-length-error")
}
