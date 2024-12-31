const expenseForm = document.getElementById('expense-form');
const expenseInput = document.getElementById('expense-input');
const amountInput = document.getElementById('amount-input');
const categoryInput = document.getElementById('category-input');
const transactionList = document.getElementById('transaction-list');
const totalExpense = document.getElementById('total-expense');
const totalIncome = document.getElementById('total-income');
const balance = document.getElementById('balance');

expenseForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const description = expenseInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    const category = categoryInput.value;

    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid description and amount.');
        return;
    }

    addTransaction(description, amount, category);
    updateSummary();
    clearInputs();
});

function addTransaction(description, amount, category) {
    const transaction = { description, amount, category };
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    renderTransaction(transaction);
}

function renderTransaction({ description, amount, category }) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${description}</td>
        <td>${category}</td>
        <td>${amount.toFixed(2)}</td>
        <td><button class="delete-btn">Delete</button></td>
    `;

    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        row.remove();
        removeTransaction(description, amount, category);
        updateSummary();
    });

    transactionList.appendChild(row);
}

function updateSummary() {
    let totalExpenses = 0;
    let totalIncomes = 0;

    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.forEach(({ amount, category }) => {
        if (category === 'Income') {
            totalIncomes += amount;
        } else {
            totalExpenses += amount;
        }
    });

    totalExpense.textContent = totalExpenses.toFixed(2);
    totalIncome.textContent = totalIncomes.toFixed(2);

    const currentBalance = totalIncomes - totalExpenses;
    balance.textContent = currentBalance.toFixed(2);

    balance.classList.toggle('positive', currentBalance >= 0);
    balance.classList.toggle('negative', currentBalance < 0);
}

function removeTransaction(description, amount, category) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(
        t => t.description !== description || t.amount !== amount || t.category !== category
    );
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function clearInputs() {
    expenseInput.value = '';
    amountInput.value = '';
    categoryInput.value = 'Expense';
}

function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.forEach(renderTransaction);
    updateSummary();
}

window.addEventListener('load', loadTransactions);
