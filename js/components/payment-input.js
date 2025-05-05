import { CalcDong } from '../utils/CalcDong.js';

export class PaymentInput {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.rows = [
            { name: '', payed: 0, personQty: 1 },
            { name: '', payed: 0, personQty: 1 }
        ];
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <h2>Payment Calculator</h2>
            <table class="input-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount Paid</th>
                        <th>Person Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.rows.map((row, index) => this.renderRow(row, index)).join('')}
                </tbody>
            </table>
            <button id="add-row-btn">+ Add Row</button>
            <button id="calculate-btn">Calculate Payments</button>
            <div id="results-container"></div>
        `;

        document.getElementById('add-row-btn')
            .addEventListener('click', () => {
                this.rows.push({ name: '', payed: 0, personQty: 1 });
                this.render();
            });

        document.getElementById('calculate-btn')
            .addEventListener('click', this.handleCalculate.bind(this));

        // Add event listeners to all remove buttons
        document.querySelectorAll('.remove-row').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.rows.splice(index, 1);
                this.render();
            });
        });

        // Add event listeners to all inputs
        document.querySelectorAll('.input-table input').forEach(input => {
            input.addEventListener('change', this.handleInputChange.bind(this));
        });
    }

    renderRow(row, index) {
        return `
            <tr>
                <td><input type="text" data-index="${index}" data-field="name" value="${row.name}"></td>
                <td><input type="number" data-index="${index}" data-field="payed" value="${row.payed}"></td>
                <td><input type="number" data-index="${index}" data-field="personQty" value="${row.personQty}" min="1"></td>
                <td>
                    ${index >= 2 ? `<button class="remove-row" data-index="${index}">×</button>` : ''}
                </td>
            </tr>
        `;
    }

    handleInputChange(event) {
        const index = parseInt(event.target.dataset.index);
        const field = event.target.dataset.field;
        const value = field === 'name' 
            ? event.target.value 
            : parseFloat(event.target.value);

        this.rows[index][field] = value;
    }

    handleCalculate() {
        try {
            // Validate all rows have names
            if (this.rows.some(row => !row.name.trim())) {
                throw new Error("Please enter names for all rows");
            }

            // Convert to Payer_t instances for CalcDong
            const payers = this.rows.map(row => 
                new Payer_t(row.name, row.personQty, row.payed)
            );

            const transactions = CalcDong(payers);
            this.displayResults(transactions);
        } catch (error) {
            alert(`Calculation error: ${error.message}`);
        }
    }

    displayResults(transactions) {
        const resultsContainer = document.getElementById('results-container');
        
        resultsContainer.innerHTML = `
            <h3>Payment Results</h3>
            <ul style="list-style-type: none; padding: 0;">
                ${transactions.map(t => `
                    <li style="padding: 8px; border-bottom: 1px solid #eee;">
                        ${t.payer} should pay ${t.receiver} $${t.amount.toFixed(2)}
                    </li>
                `).join('')}
            </ul>
        `;
    }
}

// Define Payer_t class if not already imported
class Payer_t {
    constructor(name, qty, pay) {
        this.name = name;
        this.qty = qty;
        this.pay = pay;
    }
}