// ================================
// Search Functionality
// ================================

let searchIndex = null;
let currentFilter = 'all';
let currentTypeFilter = 'all';

// Load search index
async function loadSearchIndex() {
    try {
        const response = await fetch('/search-index.json');
        searchIndex = await response.json();
        console.log('Search index loaded:',
            searchIndex.issues.length, 'issues,',
            searchIndex.torqueSpecs.length, 'torque specs,',
            searchIndex.guides.length, 'guides,',
            searchIndex.suppliers.length, 'suppliers'
        );
    } catch (error) {
        console.error('Failed to load search index:', error);
    }
}

// Perform search across all content types
function performSearch(query) {
    if (!searchIndex || !query.trim()) {
        return [];
    }

    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);

    if (searchTerms.length === 0) {
        return [];
    }

    let allResults = [];

    // Search issues
    const issueResults = searchIndex.issues.map(item => {
        const score = calculateScore(item, searchTerms, ['model', 'modelName', 'title', 'symptoms', 'keywords', 'description', 'brand']);
        return { item, score, type: 'issue' };
    }).filter(r => r.score > 0);
    allResults = allResults.concat(issueResults);

    // Search torque specs
    const torqueResults = searchIndex.torqueSpecs.map(item => {
        const score = calculateScore(item, searchTerms, ['model', 'modelName', 'component', 'spec', 'keywords', 'category', 'brand', 'notes']);
        return { item, score, type: 'torque' };
    }).filter(r => r.score > 0);
    allResults = allResults.concat(torqueResults);

    // Search guides
    const guideResults = searchIndex.guides.map(item => {
        const score = calculateScore(item, searchTerms, ['model', 'modelName', 'title', 'description', 'keywords', 'brand']);
        return { item, score, type: 'guide' };
    }).filter(r => r.score > 0);
    allResults = allResults.concat(guideResults);

    // Search suppliers
    const supplierResults = searchIndex.suppliers.map(item => {
        const score = calculateScore(item, searchTerms, ['model', 'modelName', 'name', 'notes', 'keywords', 'brand']);
        return { item, score, type: 'supplier' };
    }).filter(r => r.score > 0);
    allResults = allResults.concat(supplierResults);

    // Sort by score
    allResults.sort((a, b) => b.score - a.score);

    // Apply brand filter
    if (currentFilter !== 'all') {
        allResults = allResults.filter(result => result.item.brand === currentFilter);
    }

    // Apply type filter
    if (currentTypeFilter !== 'all') {
        allResults = allResults.filter(result => result.type === currentTypeFilter);
    }

    return allResults;
}

// Calculate relevance score for an item
function calculateScore(item, searchTerms, fields) {
    let score = 0;
    let matchedTerms = 0;

    // Create searchable text from specified fields
    const fieldTexts = {};
    fields.forEach(field => {
        if (item[field]) {
            fieldTexts[field] = item[field].toLowerCase();
        }
    });

    searchTerms.forEach(term => {
        // Exact match in model name gets highest score
        if (fieldTexts.model === term || (fieldTexts.modelName && fieldTexts.modelName.includes(term))) {
            score += 10;
            matchedTerms++;
        }
        // Match in title/component
        else if ((fieldTexts.title && fieldTexts.title.includes(term)) ||
                 (fieldTexts.component && fieldTexts.component.includes(term)) ||
                 (fieldTexts.name && fieldTexts.name.includes(term))) {
            score += 8;
            matchedTerms++;
        }
        // Match in symptoms/description/notes
        else if ((fieldTexts.symptoms && fieldTexts.symptoms.includes(term)) ||
                 (fieldTexts.spec && fieldTexts.spec.includes(term))) {
            score += 6;
            matchedTerms++;
        }
        // Match in keywords
        else if (fieldTexts.keywords && fieldTexts.keywords.includes(term)) {
            score += 5;
            matchedTerms++;
        }
        // Match in description/notes
        else if ((fieldTexts.description && fieldTexts.description.includes(term)) ||
                 (fieldTexts.notes && fieldTexts.notes.includes(term))) {
            score += 3;
            matchedTerms++;
        }
        // Match in category
        else if (fieldTexts.category && fieldTexts.category.includes(term)) {
            score += 4;
            matchedTerms++;
        }
        // Match in brand
        else if (fieldTexts.brand && fieldTexts.brand.includes(term)) {
            score += 2;
            matchedTerms++;
        }
        // General match anywhere
        else {
            const allText = Object.values(fieldTexts).join(' ');
            if (allText.includes(term)) {
                score += 1;
                matchedTerms++;
            }
        }
    });

    // Bonus for matching all terms
    if (matchedTerms === searchTerms.length && matchedTerms > 0) {
        score *= 1.5;
    }

    return score;
}

// Highlight search terms in text
function highlightTerms(text, query) {
    if (!query.trim() || !text) return text || '';

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
        resultsContainer.innerHTML = '<p class="search-placeholder">Enter a search term to find issues, torque specs, guides, and parts suppliers.</p>';
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
                    <li>Component (cylinder head, wheel lug, spark plug, etc.)</li>
                    <li>Torque specs (head bolts, caliper, drain plug, etc.)</li>
                </ul>
            </div>
        `;
        return;
    }

    // Group results by type for count display
    const typeCounts = {
        issue: results.filter(r => r.type === 'issue').length,
        torque: results.filter(r => r.type === 'torque').length,
        guide: results.filter(r => r.type === 'guide').length,
        supplier: results.filter(r => r.type === 'supplier').length
    };

    const resultsHTML = results.map(result => {
        switch(result.type) {
            case 'issue':
                return renderIssueResult(result.item, query);
            case 'torque':
                return renderTorqueResult(result.item, query);
            case 'guide':
                return renderGuideResult(result.item, query);
            case 'supplier':
                return renderSupplierResult(result.item, query);
            default:
                return '';
        }
    }).join('');

    resultsContainer.innerHTML = `
        <div class="results-summary">
            <div class="results-count">${results.length} result${results.length === 1 ? '' : 's'} found</div>
            <div class="results-breakdown">
                ${typeCounts.issue > 0 ? `<span class="type-count issue">${typeCounts.issue} issues</span>` : ''}
                ${typeCounts.torque > 0 ? `<span class="type-count torque">${typeCounts.torque} torque specs</span>` : ''}
                ${typeCounts.guide > 0 ? `<span class="type-count guide">${typeCounts.guide} guides</span>` : ''}
                ${typeCounts.supplier > 0 ? `<span class="type-count supplier">${typeCounts.supplier} suppliers</span>` : ''}
            </div>
        </div>
        ${resultsHTML}
    `;
}

// Render issue result card
function renderIssueResult(issue, query) {
    return `
        <article class="search-result-card result-issue">
            <div class="result-header">
                <span class="result-type-badge issue">Issue</span>
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
}

// Render torque spec result card
function renderTorqueResult(spec, query) {
    return `
        <article class="search-result-card result-torque">
            <div class="result-header">
                <span class="result-type-badge torque">Torque Spec</span>
                <span class="result-badge ${spec.brand.toLowerCase()}">${spec.brand}</span>
                <span class="result-model">${spec.modelName} (${spec.years})</span>
            </div>
            <h3 class="result-title">
                <a href="${spec.url}">${highlightTerms(spec.component, query)}</a>
            </h3>
            <div class="torque-spec-value">
                <span class="spec-category">${spec.category}</span>
                <span class="spec-value">${highlightTerms(spec.spec, query)}</span>
            </div>
            ${spec.notes ? `<p class="result-notes"><strong>Note:</strong> ${highlightTerms(spec.notes, query)}</p>` : ''}
            <a href="${spec.url}" class="result-link">View all ${spec.modelName} torque specs &rarr;</a>
        </article>
    `;
}

// Render guide result card
function renderGuideResult(guide, query) {
    const typeLabel = guide.type === 'diy' ? 'DIY Guide' : 'Restoration Guide';
    return `
        <article class="search-result-card result-guide">
            <div class="result-header">
                <span class="result-type-badge guide">${typeLabel}</span>
                <span class="result-badge ${guide.brand.toLowerCase()}">${guide.brand}</span>
                <span class="result-model">${guide.modelName} (${guide.years})</span>
            </div>
            <h3 class="result-title">
                <a href="${guide.url}">${highlightTerms(guide.title, query)}</a>
            </h3>
            <p class="result-description">${highlightTerms(guide.description, query)}</p>
            <div class="guide-meta">
                <span class="guide-difficulty ${guide.difficulty.toLowerCase()}">${guide.difficulty}</span>
                <span class="guide-time">${guide.time}</span>
            </div>
            <a href="${guide.url}" class="result-link">View all ${guide.modelName} guides &rarr;</a>
        </article>
    `;
}

// Render supplier result card
function renderSupplierResult(supplier, query) {
    return `
        <article class="search-result-card result-supplier">
            <div class="result-header">
                <span class="result-type-badge supplier">Parts Supplier</span>
                <span class="result-badge ${supplier.brand.toLowerCase()}">${supplier.brand}</span>
                <span class="result-model">${supplier.modelName}</span>
            </div>
            <h3 class="result-title">
                <a href="${supplier.url}">${highlightTerms(supplier.name, query)}</a>
            </h3>
            <p class="result-description">${highlightTerms(supplier.notes, query)}</p>
            <span class="supplier-type ${supplier.type}">${supplier.type.toUpperCase()}</span>
            <a href="${supplier.url}" class="result-link">View all ${supplier.modelName} suppliers &rarr;</a>
        </article>
    `;
}

// Truncate text to specified length
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const typeFilterBtns = document.querySelectorAll('.type-filter-btn');

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

    // Brand filter buttons
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

    // Type filter buttons
    typeFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            typeFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update filter
            currentTypeFilter = btn.dataset.typeFilter;

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
