// Reveals .story-text as it scrolls into view. The CSS ships these at
// opacity:0 / translateY(30px); adding .visible transitions them in, so
// without this script the story text never appears at all.
document.addEventListener("DOMContentLoaded", () => {
    const storyElements = document.querySelectorAll(".story-text");
    if (!storyElements.length) return;

    // No IntersectionObserver (or reduced motion): show everything immediately
    // rather than leaving the text invisible.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || prefersReduced) {
        storyElements.forEach(el => el.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    storyElements.forEach(el => observer.observe(el));
});
