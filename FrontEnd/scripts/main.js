
/*************************************
*********** initialisation************
**************************************/
const urlWorks = `http://localhost:5678/api/works`
const gallery = document.querySelector(".gallery")
let works
const BtnsCategories = document.querySelector("#btns-categories") //élement qui contient tous les boutons catégories
const btnTous = document.createElement("button")//bouton tous
let btnCategoryFilter // les autres boutons des catégories
const loginBtn =  document.querySelector(".log-in-out")//btn login/logout
const btnEdit = document.querySelector(".edit")
//edit
const userId = localStorage.getItem('userId')
const token = localStorage.getItem('token')
//modal
let modal
const btnExit = document.querySelector(".modal-wrapper-exit")
let btnsDeleteWork
const deleteErrorMessage = document.getElementById("delete-error-message")
const deleteSuccessMessage = document.getElementById("delete-success-message")

//fonction principale
function main(){
    getWorks()
    getCategories()
    login()
}
main()

/******************************************************************************************/
/*AFFICHER LES WORKS ET FILTRER PAR CATEGORIE*/ 
/******************************************************************************************/
/**
 * @returns {Array} de tous les works
 */
async function getWorks() {
    try {
        gallery.innerHTML = ""
      // on récupère les projets de l'API
      const response = await fetch(urlWorks)
      // convertir la reponse en json et la retourner
    	works = await response.json()
        displayWorks(works)
        displayWorksByCategory()
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

//fonction pour afficher un work
/**
 * @param {object} work objet d'un seul work
 */
function showWorks(work) {
    const figure = document.createElement("figure")
    const workImage = document.createElement("img")
    const workTitle = document.createElement("figcaption")
   
    workImage.classList.add("work-image")
    workTitle.classList.add("work-title")
    workImage.src = work.imageUrl
    workImage.alt = work.title
    workTitle.innerText = work.title

    gallery.append(figure)
    figure.append(workImage)
    figure.append(workTitle)
}

//focntion pour afficher les erreurs serveurs
function alertErrors(){
    const alertError = document.createElement("div")
    alertError.classList.add("alertError")
    alertError.innerText = ` Erreur serveur, impossible de charger les élements`
    document.querySelector(".gallery").prepend(alertError)
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


/******************************************************************************************/
/*MODE EDITION - CONNEXION ET DECONNEXION*/
/******************************************************************************************/
//fonction pour exécuter le mode édition
function login(){
	//récupérer le token 
	if (token) {
		loginBtn.textContent = 'logout'//changer le text du bouton login en logout
		editionMode()
		logOut()
        displayModal()
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
    btnEdit.classList.add("active")
	
}

//fonction pour se déconnecter
function logOut() {
	loginBtn.addEventListener('click', (e) => {
        e.preventDefault()
		localStorage.removeItem('userId')
		localStorage.removeItem('token')
		window.location.href = 'index.html'
	})
}

/******************************************************************************************/
/********* Modal 1 - OUVRIR ET FERMER LA MODALE ET SUPPRIMER UN WORK********/
/******************************************************************************************/
function displayModal() {
    btnEdit.addEventListener("click", (e) => {
        e.preventDefault()
        //condition pour créer et afficher une seule une instance de la modal
        if (!modal) {
            modal  = document.querySelector("#modal") 
            displayModalWorks()//afficher les photos des works dans la modal
            maskModal()//fermer la modal
            deleteWork()//supprimer un work
            openModalAdd()//ouvrir le formulaire pour ajouter un work
            backToInitialModal()//revenir vers la modale initiale
            maskFormModal()//fermer la modale à partir du formulaire d'ajout d'un work
        }
        modal.classList.add("active")
    })
}

//fonction pour fermer la modal
function maskModal() {
    //fermer la modal via le bouton X
    btnExit.addEventListener("click", (e) => {
        if (modal) {
            e.preventDefault()
            e.stopPropagation()
            closeModal()
        }
    })
    //fermer la modal en cliquant en dehors de la div modal-wrapper
    window.addEventListener("click", (e) => {
        e.preventDefault()
        if (e.target === modal) {
            closeModal()
        }
    })
    //fermer la modal avec le clavier "echap"
    window.addEventListener("keydown", (e) => {
        e.preventDefault()
        if (e.key === "Escape" || e.key === "ESC") {
            closeModal()
        }
    })
}
function closeModal(){
    modal.classList.remove("active")
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    document.body.classList.remove('no-scroll')
    deleteSuccessMessage.textContent = ""
    deleteErrorMessage.textContent = ""
    modalAdd.classList.add("desactive")
    modalAdd.classList.remove("active")
}

//afficher les photos des works sur la modal
async function displayModalWorks() {
    try {
        for (const work of works) {
            showWorksOnModal(work)
        }
    } catch (error) {
        alertErrors(error)
    }
}

function showWorksOnModal(work) {
    const modalGallery = document.querySelector(".modal-wrapper-gallery")
    const modalFigure = document.createElement("div")
    const modalWorkImage = document.createElement("img")
    const deleteWork = document.createElement("i")
   
    modalFigure.classList.add("img-container")
    deleteWork.classList.add("fa-solid", "fa-trash-can")
    deleteWork.dataset.id = work.id
    modalWorkImage.src = work.imageUrl
    modalWorkImage.alt = work.title

    modalGallery.appendChild(modalFigure)
    modalFigure.appendChild(modalWorkImage)
    modalFigure.appendChild(deleteWork)
}

//supprimer un works
function deleteWork() {
    btnsDeleteWork = document.querySelectorAll(".fa-trash-can")
    btnsDeleteWork.forEach(btn => {
        //on récupère l'id du btn delete qui correspond à l'id du work
        let btnDataId = btn.getAttribute('data-id')
        btn.addEventListener("click", (e) => {
            deleteRequest(btnDataId)
            e.preventDefault()
        })
    }) 
}

/**
 * @param {Number} id 
 */
function deleteRequest(id) {
    const urlDelete = `http://localhost:5678/api/works/${id}`
    fetch(urlDelete, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
        throw new Error(`Erreur serveur, statut : ${response.status}`)
        }
        getWorks()
        return response.json()
    })
    .then(data => {
        deleteSuccessMessage.textContent = `L'élément avec l'id: ${id} est supprimé avec succès`
        console.log(`L'élément avec l'id: ${id} est supprimé avec succès`)
    })
    .catch(error => {
        deleteSuccessMessage.textContent = `Erreur lors de la suppression de l\'élément avec l'id: ${id}, erreur : ${error}`
    })
}
/******************************************************************************************/
/********* Modal 2 - OUVRIR ET FERMER LA MODALE ET AJOUTER UN WORK********/
/******************************************************************************************/
const modalDelete = document.getElementById("modal-delete")
const modalAdd = document.getElementById("modal-add")
const btnAddPicture = document.getElementById("add-picture")
const btnModalBack = document.querySelector(".fa-arrow-left")
const btnCloseFormModal = document.querySelector(".fa-x")

//fonction pour ouvrir le formulaire ajout d'une image
function openModalAdd() {
    btnAddPicture.addEventListener("click", (e) => {
        e.preventDefault()
        modalAdd.classList.remove("desactive")
        modalAdd.classList.add("active")
        modalDelete.classList.add("desactive")
        modalDelete.classList.remove("desactive")
    })
}

//fonction pour fermer le formulaire et revenir vers le modal initial
function backToInitialModal() {
    btnModalBack.addEventListener("click", (e) => {
        e.preventDefault()
        modalAdd.classList.add("desactive")
        modalAdd.classList.remove("active")
    })
}

//fermer totalement la modal
function maskFormModal(){
    btnCloseFormModal.addEventListener("click", (e) => {
        if (modal) {
            e.preventDefault()
            e.stopPropagation()
            closeModal()
        }
    })
}

/************** Ajouter un work ***************/
//ajouter les catégories via l'api à l'input select
async function getCategories() {
    try {
      const response = await fetch("http://localhost:5678/api/categories")
    	const categories = await response.json()
        displayCategories(categories)
        return categories
    } catch (error) {
        alertErrors(error)
    }
}


async function displayCategories(categories) {
    try {
      for (const category of categories) {
		const categoryOption = document.createElement("option")
        categoryOption.setAttribute("value", category.id)
        categoryOption.textContent = category.name
        document.querySelector("#category-select").appendChild(categoryOption)
      }
    } catch (error) {
       console.error()
    }
}


/**form test */
const formNewWork = document.getElementById("add-work")
const newImageFile = document.querySelector("#file") 
const newImageTitle =  document.querySelector("#title")
const newImageCategory =  document.querySelector("#category-select")
const btnSubmitNewWork = document.querySelector(".btn-valid")
const uploadedFileLabel = document.querySelector(".custom-upload-btn")
const imgMiniature = document.createElement("img")
imgMiniature.classList.add("img-miniature")

//fonction pour voir si les champs sont remplis ou non
function checkFieldsFull() {
    const imgFiled = newImageFile.value !== ''
    const titleField = newImageTitle.value !== ''
    const selectField = newImageCategory.value !== ''

    return  titleField && selectField && imgFiled
}

//fonction pour activer ou désactiver le bouton submit
function activeSubmitBtn() {
    btnSubmitNewWork.disabled = !checkFieldsFull();
    btnSubmitNewWork.style.backgroundColor = checkFieldsFull() ? '#1D6154' : '#A7A7A7'
}

/*******Ajoutez des écouteurs d'événements à tous les champs******/
//focntion pour afficher l'image uploadée avant de l'envoyer
newImageFile.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgMiniature.src = e.target.result
        }
        uploadedFileLabel.textContent = ""
        uploadedFileLabel.appendChild(imgMiniature)
        reader.readAsDataURL(file);
        activeSubmitBtn()
    }
    return file
})


newImageTitle.addEventListener('input', () => {
    const titleField = newImageTitle.value
    console.log(titleField + "input title");
    activeSubmitBtn()
})

newImageCategory.addEventListener('change', () => {
    activeSubmitBtn()
})

//envoyer le work

formNewWork.addEventListener("submit", (e)=>{
    e.preventDefault()
    console.log("form work");
    createWork()
})


//fonction pour créer un nouveau work

function createWork() {
    const formData = new FormData();
    formData.append('image', newImageFile.files[0])
    formData.append('title', newImageTitle.value)
    formData.append('category', newImageCategory.value)

    fetch(urlWorks, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur serveur, statut ${response.status}`)
        }
        console.log(response.json());
        getWorks()
    })
    .then(data => {
        console.log('work ajouté avec succès:', data)
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi du work:', error)
    })
}

