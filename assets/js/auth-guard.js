//apenas usuários autenticados podem acessar a página "home"
firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "index.html";
    }
})