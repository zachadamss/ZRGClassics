/**
 * Invoice Creator - ZRG Classics
 * Uses Supabase for persistence, requires authentication
 */

(function() {
    'use strict';

    // State
    let currentUser = null;
    let templates = [];
    let savedInvoices = [];
    let currentInvoiceId = null;
    let defaultLaborRate = 85.00;

    // DOM Elements (set after DOM ready)
    let form, partsBody, laborBody, templateSelect, templateModal, templateNameInput;
    let invoiceListPanel, invoiceListBody;

    // ============================================
    // Authentication
    // ============================================

    async function checkAuth() {
        try {
            currentUser = await Auth.getUser();
            if (!currentUser) {
                showLoginRequired();
                return false;
            }
            return true;
        } catch (error) {
            console.error('Auth check failed:', error);
            showLoginRequired();
            return false;
        }
    }

    function showLoginRequired() {
        // Replace the entire page layout with centered auth message
        const pageLayout = document.querySelector('.invoice-page-layout');
        pageLayout.innerHTML = `
            <div class="auth-required">
                <div class="auth-icon">🔐</div>
                <h2>Login Required</h2>
                <p>You need to be logged in to use the Invoice Creator.</p>
                <p>Sign up is completely free and your invoices and templates are saved to your account.</p>
                <div class="auth-actions">
                    <a href="/account/login/?redirect=/tools/invoice/" class="btn btn-primary">Log In</a>
                    <a href="/account/register/?redirect=/tools/invoice/" class="btn btn-secondary">Create Free Account</a>
                </div>
            </div>
        `;
        // Override layout styles for centering
        pageLayout.style.display = 'flex';
        pageLayout.style.justifyContent = 'center';
        pageLayout.style.alignItems = 'center';
        pageLayout.style.minHeight = '60vh';
    }

    // ============================================
    // Initialization
    // ============================================

    async function init() {
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) return;

        // Get DOM elements
        form = document.getElementById('invoice-form');
        partsBody = document.getElementById('parts-body');
        laborBody = document.getElementById('labor-body');
        templateSelect = document.getElementById('template-select');
        templateModal = document.getElementById('template-modal');
        templateNameInput = document.getElementById('template-name');
        invoiceListPanel = document.getElementById('invoice-list-panel');
        invoiceListBody = document.getElementById('invoice-list-body');

        // Check for edit parameter
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');

        await loadTemplates();
        await loadSavedInvoices();

        if (editId) {
            await loadInvoiceForEdit(editId);
        } else {
            await initializeNewInvoice();
        }

        attachEventListeners();
        calculateTotals();
    }

    async function initializeNewInvoice() {
        currentInvoiceId = null;

        // Generate invoice number
        try {
            const invoiceNumber = await Garage.generateInvoiceNumber();
            document.getElementById('invoice-number').value = invoiceNumber;
        } catch (error) {
            console.error('Failed to generate invoice number:', error);
            generateLocalInvoiceNumber();
        }

        setTodayDate();

        // Load default template if exists
        try {
            const defaultTemplate = await Garage.getDefaultInvoiceTemplate();
            if (defaultTemplate) {
                applyTemplate(defaultTemplate);
            }
        } catch (error) {
            console.error('Failed to load default template:', error);
        }

        updateFormTitle('New Invoice');
    }

    function generateLocalInvoiceNumber() {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        document.getElementById('invoice-number').value = `INV-${year}${month}${day}-${random}`;
    }

    function setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('invoice-date').value = today;
    }

    function updateFormTitle(title) {
        const titleEl = document.querySelector('.invoice-title');
        if (titleEl) titleEl.textContent = title;
    }

    // ============================================
    // Template Management
    // ============================================

    async function loadTemplates() {
        try {
            templates = await Garage.getInvoiceTemplates();
            renderTemplateDropdown();
        } catch (error) {
            console.error('Failed to load templates:', error);
            templates = [];
        }
    }

    function renderTemplateDropdown() {
        templateSelect.innerHTML = '<option value="">-- Select Template --</option>';
        templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.id;
            option.textContent = template.name + (template.is_default ? ' (Default)' : '');
            templateSelect.appendChild(option);
        });
    }

    function applyTemplate(template) {
        document.getElementById('shop-name').value = template.shop_name || '';
        document.getElementById('shop-address').value = template.shop_address || '';
        document.getElementById('shop-phone').value = template.shop_phone || '';
        document.getElementById('shop-email').value = template.shop_email || '';
        document.getElementById('tax-rate').value = template.default_tax_rate || 8.25;
        document.getElementById('tax-rate-display').textContent = template.default_tax_rate || 8.25;
        document.getElementById('invoice-notes').value = template.default_notes || '';
        defaultLaborRate = template.default_labor_rate || 85.00;

        // Update all existing labor rows with template's rate
        const laborRows = laborBody.querySelectorAll('.labor-row');
        laborRows.forEach(row => {
            const rateInput = row.querySelector('.rate-input');
            if (rateInput) {
                rateInput.value = defaultLaborRate.toFixed(2);
            }
        });

        calculateTotals();
    }

    async function loadSelectedTemplate() {
        const templateId = templateSelect.value;
        if (!templateId) {
            alert('Please select a template to load.');
            return;
        }

        const template = templates.find(t => t.id === templateId);
        if (template) {
            applyTemplate(template);
        }
    }

    function openSaveTemplateModal() {
        templateNameInput.value = document.getElementById('shop-name').value || '';
        document.getElementById('template-default').checked = false;

        // Populate labor rate from current default or first labor row
        const firstLaborRow = laborBody.querySelector('.labor-row');
        const currentRate = firstLaborRow ?
            parseFloat(firstLaborRow.querySelector('.rate-input').value) || defaultLaborRate :
            defaultLaborRate;
        document.getElementById('template-labor-rate').value = currentRate.toFixed(2);

        templateModal.classList.add('active');
        templateNameInput.focus();
    }

    function closeSaveTemplateModal() {
        templateModal.classList.remove('active');
    }

    async function saveTemplate() {
        const name = templateNameInput.value.trim();
        if (!name) {
            alert('Please enter a template name.');
            return;
        }

        const isDefault = document.getElementById('template-default').checked;

        const templateData = {
            name,
            shopName: document.getElementById('shop-name').value,
            shopAddress: document.getElementById('shop-address').value,
            shopPhone: document.getElementById('shop-phone').value,
            shopEmail: document.getElementById('shop-email').value,
            taxRate: parseFloat(document.getElementById('tax-rate').value) || 8.25,
            laborRate: parseFloat(document.getElementById('template-labor-rate').value) || 85.00,
            notes: document.getElementById('invoice-notes').value,
            isDefault
        };

        try {
            // Check if template with this name exists
            const existing = templates.find(t => t.name.toLowerCase() === name.toLowerCase());
            if (existing) {
                if (!confirm(`Template "${name}" already exists. Overwrite?`)) {
                    return;
                }
                await Garage.updateInvoiceTemplate(existing.id, templateData);
            } else {
                await Garage.addInvoiceTemplate(templateData);
            }

            // Update the default labor rate for new rows
            defaultLaborRate = templateData.laborRate;

            await loadTemplates();
            closeSaveTemplateModal();

            // Select the saved template
            const saved = templates.find(t => t.name === name);
            if (saved) templateSelect.value = saved.id;

            showSaveIndicator('Template saved');
        } catch (error) {
            console.error('Failed to save template:', error);
            alert('Failed to save template: ' + error.message);
        }
    }

    async function deleteSelectedTemplate() {
        const templateId = templateSelect.value;
        if (!templateId) {
            alert('Please select a template to delete.');
            return;
        }

        const template = templates.find(t => t.id === templateId);
        if (!confirm(`Are you sure you want to delete template "${template?.name}"?`)) {
            return;
        }

        try {
            await Garage.deleteInvoiceTemplate(templateId);
            await loadTemplates();
            showSaveIndicator('Template deleted');
        } catch (error) {
            console.error('Failed to delete template:', error);
            alert('Failed to delete template: ' + error.message);
        }
    }

    // ============================================
    // Invoice Management
    // ============================================

    async function loadSavedInvoices() {
        try {
            savedInvoices = await Garage.getInvoices({ limit: 20 });
            renderInvoiceList();
        } catch (error) {
            console.error('Failed to load invoices:', error);
            savedInvoices = [];
        }
    }

    function renderInvoiceList() {
        if (!invoiceListBody) return;

        if (savedInvoices.length === 0) {
            invoiceListBody.innerHTML = '<div class="empty-state">No saved invoices yet</div>';
            return;
        }

        invoiceListBody.innerHTML = savedInvoices.map(invoice => `
            <div class="invoice-list-item ${invoice.id === currentInvoiceId ? 'active' : ''}" data-id="${invoice.id}">
                <div class="invoice-list-info">
                    <span class="invoice-list-number">${invoice.invoice_number}</span>
                    <span class="invoice-list-customer">${invoice.customer_name || 'No customer'}</span>
                    <span class="invoice-list-date">${formatDate(invoice.invoice_date)}</span>
                </div>
                <div class="invoice-list-total">$${parseFloat(invoice.grand_total).toFixed(2)}</div>
                <div class="invoice-list-actions">
                    <button type="button" class="btn-icon edit-invoice" title="Edit">&#9998;</button>
                    <button type="button" class="btn-icon delete-invoice" title="Delete">&times;</button>
                </div>
            </div>
        `).join('');

        // Attach event listeners
        invoiceListBody.querySelectorAll('.invoice-list-item').forEach(item => {
            item.querySelector('.edit-invoice').addEventListener('click', (e) => {
                e.stopPropagation();
                loadInvoiceForEdit(item.dataset.id);
            });
            item.querySelector('.delete-invoice').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteInvoice(item.dataset.id);
            });
        });
    }

    async function loadInvoiceForEdit(invoiceId) {
        try {
            const invoice = await Garage.getInvoice(invoiceId);
            if (!invoice) {
                alert('Invoice not found');
                return;
            }

            currentInvoiceId = invoiceId;

            // Populate form
            document.getElementById('invoice-number').value = invoice.invoice_number;
            document.getElementById('invoice-date').value = invoice.invoice_date;
            document.getElementById('tax-rate').value = invoice.tax_rate;
            document.getElementById('tax-rate-display').textContent = invoice.tax_rate;

            document.getElementById('shop-name').value = invoice.shop_name || '';
            document.getElementById('shop-address').value = invoice.shop_address || '';
            document.getElementById('shop-phone').value = invoice.shop_phone || '';
            document.getElementById('shop-email').value = invoice.shop_email || '';

            document.getElementById('customer-name').value = invoice.customer_name || '';
            document.getElementById('customer-address').value = invoice.customer_address || '';
            document.getElementById('customer-phone').value = invoice.customer_phone || '';
            document.getElementById('customer-email').value = invoice.customer_email || '';

            document.getElementById('vehicle-year').value = invoice.vehicle_year || '';
            document.getElementById('vehicle-make').value = invoice.vehicle_make || '';
            document.getElementById('vehicle-model').value = invoice.vehicle_model || '';
            document.getElementById('vehicle-vin').value = invoice.vehicle_vin || '';
            document.getElementById('vehicle-mileage').value = invoice.vehicle_mileage || '';

            document.getElementById('invoice-notes').value = invoice.notes || '';

            // Populate parts
            const parts = invoice.parts || [];
            partsBody.innerHTML = '';
            if (parts.length === 0) {
                addPartRow();
            } else {
                parts.forEach(part => {
                    addPartRow(part);
                });
            }

            // Populate labor
            const labor = invoice.labor || [];
            laborBody.innerHTML = '';
            if (labor.length === 0) {
                addLaborRow();
            } else {
                labor.forEach(item => {
                    addLaborRow(item);
                });
            }

            calculateTotals();
            updateFormTitle(`Edit Invoice: ${invoice.invoice_number}`);
            renderInvoiceList(); // Update active state

            // Update URL without reload
            window.history.replaceState({}, '', `/tools/invoice/?edit=${invoiceId}`);
        } catch (error) {
            console.error('Failed to load invoice:', error);
            alert('Failed to load invoice');
        }
    }

    function getFormData() {
        // Collect parts
        const parts = [];
        partsBody.querySelectorAll('.part-row').forEach(row => {
            const name = row.querySelector('[name="partName[]"]').value.trim();
            const number = row.querySelector('[name="partNumber[]"]').value.trim();
            const qty = parseFloat(row.querySelector('.qty-input').value) || 0;
            const price = parseFloat(row.querySelector('.price-input').value) || 0;
            if (name || number || qty > 0 || price > 0) {
                parts.push({ name, number, qty, price, total: qty * price });
            }
        });

        // Collect labor
        const labor = [];
        laborBody.querySelectorAll('.labor-row').forEach(row => {
            const desc = row.querySelector('[name="laborDesc[]"]').value.trim();
            const hours = parseFloat(row.querySelector('.hours-input').value) || 0;
            const rate = parseFloat(row.querySelector('.rate-input').value) || 0;
            if (desc || hours > 0) {
                labor.push({ description: desc, hours, rate, total: hours * rate });
            }
        });

        const partsSubtotal = parts.reduce((sum, p) => sum + p.total, 0);
        const laborSubtotal = labor.reduce((sum, l) => sum + l.total, 0);
        const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
        const taxAmount = partsSubtotal * (taxRate / 100);
        const grandTotal = partsSubtotal + laborSubtotal + taxAmount;

        return {
            invoiceNumber: document.getElementById('invoice-number').value,
            invoiceDate: document.getElementById('invoice-date').value,
            status: 'final',
            shopName: document.getElementById('shop-name').value,
            shopAddress: document.getElementById('shop-address').value,
            shopPhone: document.getElementById('shop-phone').value,
            shopEmail: document.getElementById('shop-email').value,
            customerName: document.getElementById('customer-name').value,
            customerAddress: document.getElementById('customer-address').value,
            customerPhone: document.getElementById('customer-phone').value,
            customerEmail: document.getElementById('customer-email').value,
            vehicleYear: document.getElementById('vehicle-year').value ? parseInt(document.getElementById('vehicle-year').value) : null,
            vehicleMake: document.getElementById('vehicle-make').value,
            vehicleModel: document.getElementById('vehicle-model').value,
            vehicleVin: document.getElementById('vehicle-vin').value,
            vehicleMileage: document.getElementById('vehicle-mileage').value ? parseInt(document.getElementById('vehicle-mileage').value) : null,
            parts,
            labor,
            partsSubtotal,
            laborSubtotal,
            taxRate,
            taxAmount,
            grandTotal,
            notes: document.getElementById('invoice-notes').value
        };
    }

    async function saveInvoice() {
        const data = getFormData();

        if (!data.invoiceNumber || !data.invoiceDate) {
            alert('Invoice number and date are required');
            return;
        }

        // Check for duplicate invoice number
        const duplicate = savedInvoices.find(inv =>
            inv.invoice_number === data.invoiceNumber && inv.id !== currentInvoiceId
        );
        if (duplicate) {
            alert(`Invoice number "${data.invoiceNumber}" already exists. Please use a different number.`);
            document.getElementById('invoice-number').focus();
            return;
        }

        try {
            const saved = await Garage.saveInvoice(data, currentInvoiceId);
            currentInvoiceId = saved.id;
            await loadSavedInvoices();
            updateFormTitle(`Edit Invoice: ${saved.invoice_number}`);
            window.history.replaceState({}, '', `/tools/invoice/?edit=${saved.id}`);
            showSaveIndicator('Invoice saved');
        } catch (error) {
            console.error('Failed to save invoice:', error);
            alert('Failed to save invoice: ' + error.message);
        }
    }

    async function deleteInvoice(invoiceId) {
        const invoice = savedInvoices.find(i => i.id === invoiceId);
        if (!confirm(`Delete invoice ${invoice?.invoice_number}?`)) {
            return;
        }

        try {
            await Garage.deleteInvoice(invoiceId);

            // If we deleted the current invoice, start a new one
            if (invoiceId === currentInvoiceId) {
                await initializeNewInvoice();
                clearFormFields();
            }

            await loadSavedInvoices();
            showSaveIndicator('Invoice deleted');
        } catch (error) {
            console.error('Failed to delete invoice:', error);
            alert('Failed to delete invoice');
        }
    }

    // ============================================
    // Parts & Labor Row Management
    // ============================================

    window.addPartRow = function(data = null) {
        const newRow = document.createElement('tr');
        newRow.className = 'part-row';
        newRow.innerHTML = `
            <td data-label="Part Name"><input type="text" name="partName[]" placeholder="Part description" value="${data?.name || ''}"></td>
            <td data-label="Part #"><input type="text" name="partNumber[]" placeholder="ABC123" value="${data?.number || ''}"></td>
            <td data-label="Qty"><input type="number" name="partQty[]" value="${data?.qty || 1}" min="1" class="qty-input"></td>
            <td data-label="Price"><input type="number" name="partPrice[]" value="${(data?.price || 0).toFixed(2)}" step="0.01" min="0" class="price-input"></td>
            <td data-label="Total" class="line-total">$${(data?.total || 0).toFixed(2)}</td>
            <td class="no-print"><button type="button" class="remove-row-btn" onclick="removePartRow(this)">×</button></td>
        `;
        partsBody.appendChild(newRow);
        calculateTotals();
    };

    window.removePartRow = function(btn) {
        const rows = partsBody.querySelectorAll('.part-row');
        if (rows.length > 1) {
            btn.closest('tr').remove();
            calculateTotals();
        }
    };

    window.addLaborRow = function(data = null) {
        const newRow = document.createElement('tr');
        newRow.className = 'labor-row';
        const rate = data?.rate || defaultLaborRate;
        const hours = data?.hours || 1;
        newRow.innerHTML = `
            <td data-label="Description"><input type="text" name="laborDesc[]" placeholder="Labor description" value="${data?.description || ''}"></td>
            <td data-label="Hours"><input type="number" name="laborHours[]" value="${hours}" step="0.25" min="0" class="hours-input"></td>
            <td data-label="Rate"><input type="number" name="laborRate[]" value="${rate.toFixed(2)}" step="0.01" min="0" class="rate-input"></td>
            <td data-label="Total" class="line-total">$${(hours * rate).toFixed(2)}</td>
            <td class="no-print"><button type="button" class="remove-row-btn" onclick="removeLaborRow(this)">×</button></td>
        `;
        laborBody.appendChild(newRow);
        calculateTotals();
    };

    window.removeLaborRow = function(btn) {
        const rows = laborBody.querySelectorAll('.labor-row');
        if (rows.length > 1) {
            btn.closest('tr').remove();
            calculateTotals();
        }
    };

    // ============================================
    // Calculations
    // ============================================

    function calculateTotals() {
        let partsTotal = 0;
        let laborTotal = 0;

        // Calculate parts
        partsBody.querySelectorAll('.part-row').forEach(row => {
            const qty = parseFloat(row.querySelector('.qty-input').value) || 0;
            const price = parseFloat(row.querySelector('.price-input').value) || 0;
            const lineTotal = qty * price;
            row.querySelector('.line-total').textContent = formatCurrency(lineTotal);
            partsTotal += lineTotal;
        });

        // Calculate labor
        laborBody.querySelectorAll('.labor-row').forEach(row => {
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

    function formatCurrency(amount) {
        return '$' + amount.toFixed(2);
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // ============================================
    // Form Actions
    // ============================================

    function clearFormFields() {
        // Reset parts table
        partsBody.innerHTML = '';
        addPartRow();

        // Reset labor table
        laborBody.innerHTML = '';
        addLaborRow();

        // Clear customer and vehicle
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-address').value = '';
        document.getElementById('customer-phone').value = '';
        document.getElementById('customer-email').value = '';
        document.getElementById('vehicle-year').value = '';
        document.getElementById('vehicle-make').value = '';
        document.getElementById('vehicle-model').value = '';
        document.getElementById('vehicle-vin').value = '';
        document.getElementById('vehicle-mileage').value = '';

        calculateTotals();
    }

    async function startNewInvoice() {
        if (currentInvoiceId) {
            if (!confirm('Start a new invoice? Make sure your current invoice is saved.')) {
                return;
            }
        }

        window.history.replaceState({}, '', '/tools/invoice/');
        await initializeNewInvoice();
        clearFormFields();
        renderInvoiceList();
    }

    function printInvoice() {
        // Prepare for printing - hide empty fields
        const emptyElements = [];

        // Hide empty input fields and their labels
        document.querySelectorAll('.invoice-section input, .invoice-section textarea').forEach(input => {
            if (!input.value || input.value.trim() === '') {
                input.classList.add('print-hidden');
                emptyElements.push(input);

                // Also hide the label
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    label.classList.add('print-hidden');
                    emptyElements.push(label);
                }
            }
        });

        // Hide empty part rows (only name field empty)
        document.querySelectorAll('.part-row').forEach(row => {
            const nameInput = row.querySelector('[name="partName[]"]');
            if (nameInput && !nameInput.value.trim()) {
                row.classList.add('print-hidden');
                emptyElements.push(row);
            }
        });

        // Hide empty labor rows (only description field empty)
        document.querySelectorAll('.labor-row').forEach(row => {
            const descInput = row.querySelector('[name="laborDesc[]"]');
            if (descInput && !descInput.value.trim()) {
                row.classList.add('print-hidden');
                emptyElements.push(row);
            }
        });

        // Print
        window.print();

        // Restore hidden elements after print
        emptyElements.forEach(el => el.classList.remove('print-hidden'));
    }

    function showSaveIndicator(message) {
        const indicator = document.getElementById('save-indicator');
        if (indicator) {
            indicator.textContent = message;
            indicator.classList.add('show');
            setTimeout(() => indicator.classList.remove('show'), 2000);
        }
    }

    // ============================================
    // Event Listeners
    // ============================================

    function attachEventListeners() {
        // Form input changes trigger recalculation
        form.addEventListener('input', handleFormInput);

        // Template controls
        document.getElementById('save-template-btn').addEventListener('click', openSaveTemplateModal);
        document.getElementById('delete-template-btn').addEventListener('click', deleteSelectedTemplate);

        // Auto-load template on dropdown change
        templateSelect.addEventListener('change', function() {
            if (this.value) {
                loadSelectedTemplate();
            }
        });

        // Modal controls
        document.getElementById('cancel-template-btn').addEventListener('click', closeSaveTemplateModal);
        document.getElementById('confirm-save-btn').addEventListener('click', saveTemplate);

        // Action buttons
        document.getElementById('new-invoice-btn').addEventListener('click', startNewInvoice);
        document.getElementById('save-invoice-btn').addEventListener('click', saveInvoice);
        document.getElementById('print-btn').addEventListener('click', printInvoice);

        // Close modal on outside click
        templateModal.addEventListener('click', function(e) {
            if (e.target === templateModal) {
                closeSaveTemplateModal();
            }
        });

        // Tax rate display sync
        document.getElementById('tax-rate').addEventListener('input', function() {
            document.getElementById('tax-rate-display').textContent = this.value || '0';
        });

        // Toggle invoice list panel
        const toggleBtn = document.getElementById('toggle-invoice-list');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                invoiceListPanel.classList.toggle('collapsed');
            });
        }
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

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
