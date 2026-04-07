const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('#nav-links a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
        }
    });
});

// --- AJAX & MODAL LOGIC ---

$(document).ready(function() {
    // Array to store the fetched data globally so our modal can access it
    let fetchedProducts = [];

    // 1. AJAX Call to fetch data
    $.ajax({
        url: 'https://fakestoreapi.com/products?limit=4',
        method: 'GET',
        success: function(data) {
            fetchedProducts = data; // Store data for the modal
            const $productGrid = $('#dynamic-products');

            // 2. Loop through the data and build the HTML cards
            data.forEach(product => {
                // We truncate the title so it doesn't break the layout
                const shortTitle = product.title.length > 25 ? product.title.substring(0, 25) + "..." : product.title;
                
                const cardHTML = `
                    <div class="product-card">
                        <div class="product-image-container" style="background-color: #fff; padding: 15px;">
                            <img src="${product.image}" alt="${shortTitle}" class="product-image" style="object-fit: contain;">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">${shortTitle}</h3>
                            <p class="product-price">$${product.price.toFixed(2)}</p>
                            
                            <button class="quick-view-btn" data-id="${product.id}">Quick View</button>
                            
                            <button class="add-to-cart-btn">
                                <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                `;
                // Inject the card into the grid
                $productGrid.append(cardHTML);
            });
        },
        error: function(error) {
            console.error("Error fetching products:", error);
            $('#dynamic-products').html('<p>Failed to load featured deals. Please try again later.</p>');
        }
    });

    // 3. Open Modal Logic (Using Event Delegation because buttons are dynamic)
    $('#dynamic-products').on('click', '.quick-view-btn', function() {
        // Find which product was clicked using the data-id
        const productId = $(this).data('id');
        const product = fetchedProducts.find(p => p.id === productId);

        if (product) {
            // Build the modal inner HTML
            const modalHTML = `
                <img src="${product.image}" alt="${product.title}" class="modal-product-img">
                <h3 class="modal-product-title">${product.title}</h3>
                <p class="modal-product-rating">
                    <i class="fa-solid fa-star" style="color: #FFD43B;"></i> ${product.rating.rate} / 5 (${product.rating.count} Reviews)
                </p>
                <p class="modal-product-desc">${product.description}</p>
                <p class="modal-product-price">$${product.price.toFixed(2)}</p>
            `;
            
            // Inject into modal and show it
            $('#modal-body-content').html(modalHTML);
            $('#quickViewModal').fadeIn(300);
        }
    });

    // 4. Close Modal Logic
    // Close when the X is clicked
    $('.close-btn').on('click', function() {
        $('#quickViewModal').fadeOut(300);
    });

    // Close when clicking anywhere outside the white modal box
    $(window).on('click', function(event) {
        if ($(event.target).is('#quickViewModal')) {
            $('#quickViewModal').fadeOut(300);
        }
    });
});