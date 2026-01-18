// ================================
// Search Functionality
// ================================

let searchIndex = null;
let currentFilter = 'all';

// Load search index
async function loadSearchIndex() {
    try {
        const response = await fetch('search-index.json');
        searchIndex = await response.json();
        console.log('Search index loaded:', searchIndex.issues.length, 'issues');
    } catch (error) {
        console.error('Failed to load search index:', error);
    }
}

// Perform search
function performSearch(query) {
    if (!searchIndex || !query.trim()) {
        return [];
    }

    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);

    if (searchTerms.length === 0) {
        return [];
    }

    const results = searchIndex.issues.map(issue => {
        // Create searchable text from all fields
        const searchableText = [
            issue.brand,
            issue.model,
            issue.modelName,
            issue.years,
            issue.title,
            issue.symptoms,
            issue.description,
            issue.keywords
        ].join(' ').toLowerCase();

        // Calculate relevance score
        let score = 0;
        let matchedTerms = 0;

        searchTerms.forEach(term => {
            // Exact match in model name gets highest score
            if (issue.model.toLowerCase() === term ||
                issue.modelName.toLowerCase().includes(term)) {
                score += 10;
                matchedTerms++;
            }
            // Match in title
            else if (issue.title.toLowerCase().includes(term)) {
                score += 8;
                matchedTerms++;
            }
            // Match in symptoms
            else if (issue.symptoms.toLowerCase().includes(term)) {
                score += 6;
                matchedTerms++;
            }
            // Match in keywords
            else if (issue.keywords.toLowerCase().includes(term)) {
                score += 5;
                matchedTerms++;
            }
            // Match in description
            else if (issue.description.toLowerCase().includes(term)) {
                score += 3;
                matchedTerms++;
            }
            // Match in brand
            else if (issue.brand.toLowerCase().includes(term)) {
                score += 2;
                matchedTerms++;
            }
            // General match anywhere
            else if (searchableText.includes(term)) {
                score += 1;
                matchedTerms++;
            }
        });

        // Bonus for matching all terms
        if (matchedTerms === searchTerms.length) {
            score *= 1.5;
        }

        return { issue, score, matchedTerms };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score);

    // Apply brand filter
    if (currentFilter !== 'all') {
        return results.filter(result => result.issue.brand === currentFilter);
    }

    return results;
}

// Highlight search terms in text
function highlightTerms(text, query) {
    if (!query.trim()) return text;

    const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);
    let highlightedText = text;

    terms.forEach(term => {
        const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });

    return highlightedText;
}

// Escape special regex characters
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Render search results
function renderResults(results, query) {
    const resultsContainer = document.getElementById('search-results');

    if (!query.trim()) {
        resultsContainer.innerHTML = '<p class="search-placeholder">Enter a search term to find related issues and solutions.</p>';
        return;
    }

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No results found</h3>
                <p>Try different keywords or check your spelling. You can search by:</p>
                <ul>
                    <li>Model name (E30, 944, 996, etc.)</li>
                    <li>Issue type (timing belt, cooling, electrical, etc.)</li>
                    <li>Symptoms (overheating, rough idle, oil leak, etc.)</li>
                </ul>
            </div>
        `;
        return;
    }

    const resultsHTML = results.map(result => {
        const issue = result.issue;
        return `
            <article class="search-result-card">
                <div class="result-header">
                    <span class="result-badge ${issue.brand.toLowerCase()}">${issue.brand}</span>
                    <span class="result-model">${issue.modelName} (${issue.years})</span>
                </div>
                <h3 class="result-title">
                    <a href="${issue.url}#${issue.id}">${highlightTerms(issue.title, query)}</a>
                </h3>
                <p class="result-symptoms">
                    <strong>Symptoms:</strong> ${highlightTerms(issue.symptoms, query)}
                </p>
                <p class="result-description">${highlightTerms(truncateText(issue.description, 200), query)}</p>
                <a href="${issue.url}" class="result-link">View all ${issue.modelName} issues &rarr;</a>
            </article>
        `;
    }).join('');

    resultsContainer.innerHTML = `
        <div class="results-count">${results.length} result${results.length === 1 ? '' : 's'} found</div>
        ${resultsHTML}
    `;
}

// Truncate text to specified length
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (!searchInput) return; // Not on search page

    // Load index
    loadSearchIndex();

    // Search on input (debounced)
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const results = performSearch(searchInput.value);
            renderResults(results, searchInput.value);
        }, 300);
    });

    // Search on button click
    searchBtn.addEventListener('click', () => {
        const results = performSearch(searchInput.value);
        renderResults(results, searchInput.value);
    });

    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const results = performSearch(searchInput.value);
            renderResults(results, searchInput.value);
        }
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update filter
            currentFilter = btn.dataset.filter;

            // Re-run search if there's a query
            if (searchInput.value.trim()) {
                const results = performSearch(searchInput.value);
                renderResults(results, searchInput.value);
            }
        });
    });

    // Focus search input on page load
    searchInput.focus();

    // Check for URL parameters (for linking to search)
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    if (queryParam) {
        searchInput.value = queryParam;
        // Wait for index to load, then search
        setTimeout(() => {
            const results = performSearch(queryParam);
            renderResults(results, queryParam);
        }, 500);
    }
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', initSearch);
