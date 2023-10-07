//fonction pour afficher un work
/**
 * @param {object} work objet d'un seul work
 */
export function showWorks(work) {
    const gallery = document.querySelector(".gallery")
    const figure = document.createElement("figure")
    const workImage = document.createElement("img")
    const workTitle = document.createElement("figcaption")
   
    workImage.classList.add(".work-image")
    workTitle.classList.add(".work-title")
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


