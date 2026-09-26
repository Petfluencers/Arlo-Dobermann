// Two-stage tap on gallery images: the first tap zooms, the second opens the
// modal. Keeps a stray tap on a phone from throwing the lightbox open.
document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".gallery-item img");
    images.forEach(image => {
        let tapped = false;
        image.addEventListener("click", function (event) {
            if (!tapped) {
                event.preventDefault();
                images.forEach(img => img.classList.remove("active"));
                this.classList.add("active");
                tapped = true;
                setTimeout(() => { tapped = false; }, 400);
            } else {
                this.classList.remove("active");
            }
        });
    });
});
