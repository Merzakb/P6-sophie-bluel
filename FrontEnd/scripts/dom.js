//fonction pour afficher un work
/**
 * @param {object} work objet d'un seul work
 */
export function showWorks(work) {
    const gallery = document.querySelector(".gallery")
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

export function alertErrors(){
    const alertError = document.createElement("div")
    alertError.classList.add("alertError")
    alertError.innerText = ` Erreur serveur, impossible de charger les élements`
    document.querySelector(".gallery").prepend(alertError)
}

/**MODAL */
export function showWorksOnModal(work) {
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


