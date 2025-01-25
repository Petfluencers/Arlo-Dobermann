<script>
    let currentPage = 1;
    const itemsPerPage = 15;  // Adjust as needed
    const totalItems = 105;   // Total number of items in your Etsy store
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    function loadEtsyPage(page) {
        const offset = (page - 1) * itemsPerPage;
        document.getElementById('etsy-items').innerHTML = ''; // Clear current items

        let etsyScript = document.createElement('script');
        etsyScript.src = 'https://www.etsy.com/assets/js/etsy_mini_shop.js';
        document.getElementById('etsy-items').appendChild(etsyScript);

        etsyScript.onload = () => {
            new Etsy.Mini(54874655, 'gallery', 5, 3, offset, 'https://www.etsy.com');
        };

        document.getElementById('pageInfo').innerText = `Page ${page} of ${totalPages}`;
        document.getElementById('prevPage').disabled = page === 1;
        document.getElementById('nextPage').disabled = page === totalPages;
    }

    function changePage(step) {
        currentPage += step;
        loadEtsyPage(currentPage);
    }

    // Load the first page on page load
    document.addEventListener('DOMContentLoaded', function () {
        loadEtsyPage(currentPage);
    });
</script>
