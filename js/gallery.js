// script.js

function openModal(image) {
    let modal = document.getElementById("myModal");
    let modalImg = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImg.src = image.src;
}

function closeModal() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}
