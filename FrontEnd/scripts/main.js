import { alertErrors, showWorks } from "./dom.js"


//initialisation
const works = await getWorks() //[] de work
const BtnsCategories = document.querySelector("#btns-categories") //élement qui contient tous les boutons catégories
const btnTous = document.createElement("button")//bouton tous
let btnCategoryFilter // les autres boutons des catégories
const loginBtn =  document.querySelector(".log-in-out")//btn login/logout

//fonction principale
function main(){
	displayWorks(works)
	displayWorksByCategory()
}
main()


/**
 * @returns {Array} de tous les works
 */
async function getWorks() {
    try {
      // on récupère les projets de l'API
      const response = await fetch(`http://localhost:5678/api/works`)
      // convertir la reponse en json et la retourner
    	const works = await response.json();
      return works;
    } catch (error) {
        alertErrors(error)
    }
}

/**
 * fonction pour afficher les works
 * @param {Array} array selon les boutons des catégories
 */
async function displayWorks(array) {
    try {
      for (const work of array) {
		showWorks(work)
      }
    } catch (error) {
       console.error()
    }
}

//fonction pour afficher les works par catégorie
function displayWorksByCategory() {
	creatBtnTous()//bouton "Tous"
	createBtnCategories()//boutons catégories

	btnCategoryFilter = document.querySelectorAll(".btn-category")
	let arrayBtnCategoryFilter = Array.from(btnCategoryFilter)

	for (let j = 0; j < arrayBtnCategoryFilter.length; j++) {
		arrayBtnCategoryFilter[j].addEventListener("click", ()=>{
			let dataId = arrayBtnCategoryFilter[j].getAttribute('data-id')
			let currentBtn = arrayBtnCategoryFilter[j]
			//on supprime la class "selected" pour tous les boutons
			btnTous.classList.remove( "btn-category-selected")
			btnCategoryFilter.forEach(function(element) {
				element.classList.remove('btn-category-selected')
			});
			//on ajoute cette class au bouton cliqué
			currentBtn.classList.add("btn-category-selected")
			//on crée filtre nos works par catégorie
			const worksFiltered = works.filter(item => item.categoryId == dataId)
			//on supprime tous les works
			document.querySelector(".gallery").innerHTML = ""
			//on affiche les works de la catégorie correspondante
			displayWorks(worksFiltered)
		})	
	}
}

//créer le bouton "tous" pour afficher tous les works
function creatBtnTous(){
	btnTous.classList.add("btn-category-filter", "btn-tous", "btn-category-selected")
	btnTous.innerText = "Tous"
	btnTous.setAttribute("data-id", `0`)
	BtnsCategories.prepend(btnTous)

	btnTous.addEventListener("click", ()=>{
		//on supprime la class "selected" pour les autres boutons
		btnCategoryFilter.forEach(function(element) {
			element.classList.remove('btn-category-selected')
		});
		//et on la rajoute au bouton "tous"
		btnTous.classList.add( "btn-category-selected")
		//on supprime les works par catégorie
		document.querySelector(".gallery").innerHTML = ""
		//et on affiche tous le works
		displayWorks(works)
	})
}

//création des boutons filtres par catégories
function createBtnCategories(){
	const CategoryIdArray = categoryListId()//liste des id des catégories
	const CategoryNameArray = categoryListName()//liste des nmae des catégories
	for (let i = 0; i < CategoryIdArray.length; i++) {
		let btnCategory = document.createElement("button")
		btnCategory.classList.add("btn-category-filter", "btn-category")
		btnCategory.innerText = CategoryNameArray[i]
		btnCategory.setAttribute("data-id", `${CategoryIdArray[i]}`)
		
		BtnsCategories.append(btnCategory)
	}
}

/*fonction pour récupérer les catégories à partir du tableau works */
/**
 * @returns {Array} des id des catégories présents dans la liste works
 */
function categoryListId(){
	const categoryIdSet = new Set();
	works.forEach(item => {
		categoryIdSet.add(item.category.id)
	})
	return Array.from(categoryIdSet)
}
/**
 * @returns {Array} des name des catégories présents dans la liste works
 */
function categoryListName(){
	const categoryNameSet = new Set()
	works.forEach(item => {
		categoryNameSet.add(item.category.name)
	})
	return Array.from(categoryNameSet)
}


/*************************/
/*MODE EDITION */
/*************************/
//fonction pour exécuter le mode édition
window.onload = () => {
	//récupérer le token
	let userId = localStorage.getItem('userId')
	let token = localStorage.getItem('token')
	if (userId && token) {
		loginBtn.textContent = 'logout'//changer le text du bouton login en logout
		editionMode()
		logOut()
	}
}

//afficher le mode édition
function editionMode() {
	loginBtn.textContent = 'logout'
	const bannerEdit = document.createElement("div")
	bannerEdit.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>  Mode édition`
	bannerEdit.classList.add("banner-edit")
	document.body.prepend(bannerEdit)
	BtnsCategories.innerHTML = ``
	document.querySelector("#projects").innerHTML = `<div class="edit-project"><h2>Mes Projets</h2> <span class="edit"><i class="fa-regular fa-pen-to-square"></i>  Modifier</span></div>`
}

//fonction pour se déconnecter
function logOut() {
	loginBtn.addEventListener('click', () => {
		localStorage.removeItem('userId')
		localStorage.removeItem('token')
		window.location.href = 'login.html'
	})
}

