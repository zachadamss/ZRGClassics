// Invoice Creator - ZRG Classics
// Pure JavaScript, no dependencies

(function() {
    'use strict';

    const STORAGE_KEY = 'invoiceTemplates';

    // DOM Elements
    const form = document.getElementById('invoice-form');
    const partsBody = document.getElementById('parts-body');
    const laborBody = document.getElementById('labor-body');
    const templateSelect = document.getElementById('template-select');
    const templateModal = document.getElementById('template-modal');
    const templateNameInput = document.getElementById('template-name');

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        generateInvoiceNumber();
        setTodayDate();
        loadTemplateList();
        attachEventListeners();
        calculateTotals();
    }

    function attachEventListeners() {
        // Form input changes trigger recalculation
        form.addEventListener('input', handleFormInput);

        // Template controls
        document.getElementById('save-template-btn').addEventListener('click', openSaveModal);
        document.getElementById('load-template-btn').addEventListener('click', loadSelectedTemplate);
        document.getElementById('delete-template-btn').addEventListener('click', deleteSelectedTemplate);

        // Modal controls
        document.getElementById('cancel-template-btn').addEventListener('click', closeSaveModal);
        document.getElementById('confirm-save-btn').addEventListener('click', saveTemplate);

        // Action buttons
        document.getElementById('clear-btn').addEventListener('click', clearForm);
        document.getElementById('print-btn').addEventListener('click', printInvoice);

        // Close modal on outside click
        templateModal.addEventListener('click', function(e) {
            if (e.target === templateModal) {
                closeSaveModal();
            }
        });

        // Tax rate display sync
        document.getElementById('tax-rate').addEventListener('input', function() {
            document.getElementById('tax-rate-display').textContent = this.value || '0';
        });
    }

    function handleFormInput(e) {
        const target = e.target;

        // Recalculate if it's a numeric input in parts or labor
        if (target.classList.contains('qty-input') ||
            target.classList.contains('price-input') ||
            target.classList.contains('hours-input') ||
            target.classList.contains('rate-input') ||
            target.id === 'tax-rate') {
            calculateTotals();
        }
    }

    // Generate invoice number based on date and random suffix
    function generateInvoiceNumber() {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

        document.getElementById('invoice-number').value = `INV-${year}${month}${day}-${random}`;
    }

    // Set today's date as default
    function setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('invoice-date').value = today;
    }

    // Add a new part row
    window.addPartRow = function() {
        const newRow = document.createElement('tr');
        newRow.className = 'part-row';
        newRow.innerHTML = `
            <td><input type="text" name="partName[]" placeholder="Part description"></td>
            <td><input type="text" name="partNumber[]" placeholder="ABC123"></td>
            <td><input type="number" name="partQty[]" value="1" min="1" class="qty-input"></td>
            <td><input type="number" name="partPrice[]" value="0.00" step="0.01" min="0" class="price-input"></td>
            <td class="line-total">$0.00</td>
            <td class="no-print"><button type="button" class="remove-row-btn" onclick="removePartRow(this)">×</button></td>
        `;
        partsBody.appendChild(newRow);
    };

    // Remove a part row
    window.removePartRow = function(btn) {
        const rows = partsBody.querySelectorAll('.part-row');
        if (rows.length > 1) {
            btn.closest('tr').remove();
            calculateTotals();
        }
    };

    // Add a new labor row
    window.addLaborRow = function() {
        const newRow = document.createElement('tr');
        newRow.className = 'labor-row';
        newRow.innerHTML = `
            <td><input type="text" name="laborDesc[]" placeholder="Labor description"></td>
            <td><input type="number" name="laborHours[]" value="1" step="0.25" min="0" class="hours-input"></td>
            <td><input type="number" name="laborRate[]" value="85.00" step="0.01" min="0" class="rate-input"></td>
            <td class="line-total">$85.00</td>
            <td class="no-print"><button type="button" class="remove-row-btn" onclick="removeLaborRow(this)">×</button></td>
        `;
        laborBody.appendChild(newRow);
        calculateTotals();
    };

    // Remove a labor row
    window.removeLaborRow = function(btn) {
        const rows = laborBody.querySelectorAll('.labor-row');
        if (rows.length > 1) {
            btn.closest('tr').remove();
            calculateTotals();
        }
    };

    // Calculate all totals
    function calculateTotals() {
        let partsTotal = 0;
        let laborTotal = 0;

        // Calculate parts
        const partRows = partsBody.querySelectorAll('.part-row');
        partRows.forEach(row => {
            const qty = parseFloat(row.querySelector('.qty-input').value) || 0;
            const price = parseFloat(row.querySelector('.price-input').value) || 0;
            const lineTotal = qty * price;
            row.querySelector('.line-total').textContent = formatCurrency(lineTotal);
            partsTotal += lineTotal;
        });

        // Calculate labor
        const laborRows = laborBody.querySelectorAll('.labor-row');
        laborRows.forEach(row => {
            const hours = parseFloat(row.querySelector('.hours-input').value) || 0;
            const rate = parseFloat(row.querySelector('.rate-input').value) || 0;
            const lineTotal = hours * rate;
            row.querySelector('.line-total').textContent = formatCurrency(lineTotal);
            laborTotal += lineTotal;
        });

        // Calculate tax (on parts only)
        const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
        const taxAmount = partsTotal * (taxRate / 100);

        // Calculate grand total
        const grandTotal = partsTotal + laborTotal + taxAmount;

        // Update display
        document.getElementById('parts-subtotal').textContent = formatCurrency(partsTotal);
        document.getElementById('labor-subtotal').textContent = formatCurrency(laborTotal);
        document.getElementById('tax-amount').textContent = formatCurrency(taxAmount);
        document.getElementById('grand-total').textContent = formatCurrency(grandTotal);
    }

    // Format number as currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2);
    }

    // Template Management
    function getTemplates() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error reading templates:', e);
            return {};
        }
    }

    function saveTemplates(templates) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        } catch (e) {
            console.error('Error saving templates:', e);
            alert('Failed to save template. localStorage may be full or disabled.');
        }
    }

    function loadTemplateList() {
        const templates = getTemplates();
        const names = Object.keys(templates);

        // Clear existing options except the default
        templateSelect.innerHTML = '<option value="">-- Select Template --</option>';

        names.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            templateSelect.appendChild(option);
        });
    }

    function openSaveModal() {
        templateNameInput.value = document.getElementById('shop-name').value || '';
        templateModal.classList.add('active');
        templateNameInput.focus();
    }

    function closeSaveModal() {
        templateModal.classList.remove('active');
    }

    function saveTemplate() {
        const name = templateNameInput.value.trim();
        if (!name) {
            alert('Please enter a template name.');
            return;
        }

        const templates = getTemplates();

        // Check if overwriting
        if (templates[name]) {
            if (!confirm(`Template "${name}" already exists. Overwrite?`)) {
                return;
            }
        }

        templates[name] = {
            shopName: document.getElementById('shop-name').value,
            shopAddress: document.getElementById('shop-address').value,
            shopPhone: document.getElementById('shop-phone').value,
            shopEmail: document.getElementById('shop-email').value,
            taxRate: document.getElementById('tax-rate').value,
            notes: document.getElementById('invoice-notes').value
        };

        saveTemplates(templates);
        loadTemplateList();
        closeSaveModal();

        // Select the newly saved template
        templateSelect.value = name;
    }

    function loadSelectedTemplate() {
        const name = templateSelect.value;
        if (!name) {
            alert('Please select a template to load.');
            return;
        }

        const templates = getTemplates();
        const template = templates[name];

        if (!template) {
            alert('Template not found.');
            return;
        }

        document.getElementById('shop-name').value = template.shopName || '';
        document.getElementById('shop-address').value = template.shopAddress || '';
        document.getElementById('shop-phone').value = template.shopPhone || '';
        document.getElementById('shop-email').value = template.shopEmail || '';
        document.getElementById('tax-rate').value = template.taxRate || '8.25';
        document.getElementById('tax-rate-display').textContent = template.taxRate || '8.25';
        document.getElementById('invoice-notes').value = template.notes || '';

        calculateTotals();
    }

    function deleteSelectedTemplate() {
        const name = templateSelect.value;
        if (!name) {
            alert('Please select a template to delete.');
            return;
        }

        if (!confirm(`Are you sure you want to delete template "${name}"?`)) {
            return;
        }

        const templates = getTemplates();
        delete templates[name];
        saveTemplates(templates);
        loadTemplateList();
    }

    // Clear the entire form
    function clearForm() {
        if (!confirm('Clear all form data? This cannot be undone.')) {
            return;
        }

        form.reset();

        // Reset parts table to one row
        partsBody.innerHTML = `
            <tr class="part-row">
                <td><input type="text" name="partName[]" placeholder="Part description"></td>
                <td><input type="text" name="partNumber[]" placeholder="ABC123"></td>
                <td><input type="number" name="partQty[]" value="1" min="1" class="qty-input"></td>
                <td><input type="number" name="partPrice[]" value="0.00" step="0.01" min="0" class="price-input"></td>
                <td class="line-total">$0.00</td>
                <td class="no-print"><button type="button" class="remove-row-btn" onclick="removePartRow(this)">×</button></td>
            </tr>
        `;

        // Reset labor table to one row
        laborBody.innerHTML = `
            <tr class="labor-row">
                <td><input type="text" name="laborDesc[]" placeholder="Labor description"></td>
                <td><input type="number" name="laborHours[]" value="1" step="0.25" min="0" class="hours-input"></td>
                <td><input type="number" name="laborRate[]" value="85.00" step="0.01" min="0" class="rate-input"></td>
                <td class="line-total">$85.00</td>
                <td class="no-print"><button type="button" class="remove-row-btn" onclick="removeLaborRow(this)">×</button></td>
            </tr>
        `;

        generateInvoiceNumber();
        setTodayDate();
        document.getElementById('tax-rate').value = '8.25';
        document.getElementById('tax-rate-display').textContent = '8.25';
        calculateTotals();
    }

    // Print the invoice
    function printInvoice() {
        window.print();
    }

})();
