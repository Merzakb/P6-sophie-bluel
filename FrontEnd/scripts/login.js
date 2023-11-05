//fonction pour se connecter
function submitLogin() {
    const form = document.querySelector("#login")
    form.addEventListener("submit", (e)=> {
        e.preventDefault()
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        adminLogin(email, password)
    })
}
submitLogin()


/**
 * fonction pour envoyer une requete fetch avec la méthode POST au serveur
 * @param {string} email 
 * @param {string} password 
 */
function adminLogin (email, password) {
    const urlLogin = "http://localhost:5678/api/users/login"
    const data = {
        email : email,
        password : password
    }
    
    fetch(urlLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(response => {
        //afficher un message d'erreur si réponse pas OK
        if(!response.ok) {
            throw new Error("Vos coordonnées ne sont pas correctes")
        }
        return response.json()
    })
    .then(data => {
        let userId = data.userId
        let token = data.token
        //stocker le token dans le sessionStorage
        sessionStorage.setItem('userId', userId)
        sessionStorage.setItem('token', token)

        // Rediriger vers la page d'acceuil
        window.location.href = './index.html'
    }).catch(error => {
        //afficher le message d'erreur sur le navigateur
        let errorMessage = document.getElementById("error-login")
        errorMessage.textContent = error.message
    })
}
