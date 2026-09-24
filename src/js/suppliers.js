// Supplier category filter on car pages (partials/supplier-list.njk)
document.addEventListener('DOMContentLoaded', function() {
    const categoryBtns = document.querySelectorAll('.supplier-category-btn');
    const supplierCards = document.querySelectorAll('.supplier-card');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;

            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter cards
            supplierCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
