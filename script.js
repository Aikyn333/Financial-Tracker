const productNameInput = document.getElementById('product_name');
const productPriceInput = document.getElementById('product_price');
const numberOfproduct = document.getElementById('numberofproduct');
const totalMoneyInput = document.getElementById('total_budget');
const addProductButton = document.getElementById('add_product');
const productTableBody = document.querySelector('#product_table tbody');
const totalValue = document.getElementById('total_expenses');
const remainingValue = document.getElementById('remaining_value');
const totalMoney = document.getElementById('total');


let products = [];
let total = 0;
let remaining = 0;
let selectedProductIndex = -1;


const expenseNameInput = document.getElementById('expense_name');
const expenseAmountInput = document.getElementById('expense_amount');
const addExpenseButton = document.getElementById('add_expense');
const expensesTableBody = document.querySelector('#expenses_table tbody');
const totalExpensesValue = document.getElementById('total_expenses');

let expenses = 0;

const ctx = document.getElementById('myChart').getContext('2d');

const myChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: [],
    datasets: [{
      label: 'Expenses',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// new
function addProduct() {
  const name = productNameInput.value.trim();
  const price = parseFloat(productPriceInput.value);
  const number = parseInt(numberOfproduct.value);

  if (name === '' || isNaN(price)) {
    alert('Пожалуйста, введите корректное имя продукта и цену.');
    return;
  }

  products.push({
    name: name,
    TotalProductNum: number,
    price: price,
  });

  total = products.reduce(
    (acc, currentValue) => acc + currentValue.price * currentValue.TotalProductNum,
    0
  );
  remaining = totalMoneyInput.value - total;
  totalMoney.textContent = totalMoneyInput.value;

  updateTable();
  updateTotal();
  updateRemaining();

  productNameInput.value = '';
  productPriceInput.value = '';
  numberOfproduct.value = '';
}

function updateTable() {
  productTableBody.innerHTML = '';

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const priceCell = document.createElement('td');
    const actionsCell = document.createElement('td');

    nameCell.textContent =
      product.name +
      ' ' +
      '(' +
      product.TotalProductNum +
      'x' +
      product.price +
      ')';
    priceCell.textContent = product.price.toFixed(2) * product.TotalProductNum;

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="uil uil-pen"></i>';
    editButton.addEventListener('click', () => {
      selectedProductIndex = i;
      productNameInput.value = product.name;
      productPriceInput.value = product.price.toFixed(2);
      numberOfproduct.value = product.TotalProductNum;
      addProductButton.textContent = 'Save';
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="uil uil-trash-alt"></i>';
    deleteButton.addEventListener('click', () => {
      products.splice(i, 1);
      total = products.reduce(
        (acc, currentValue) => acc + currentValue.price * currentValue.TotalProductNum,
        0
      );
      remaining = totalMoneyInput.value - total;
      updateTable();
      updateTotal();
      updateRemaining();
      productNameInput.value = '';
      productPriceInput.value = '';
      addProductButton.textContent = 'Add Product';
    });

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(actionsCell);
    productTableBody.appendChild(row);
  }

  updateChart();
}

// sum all
function updateTotal() {
  totalValue.textContent = total.toFixed(2);
}

function updateRemaining() {
  remainingValue.textContent = remaining.toFixed(2);
}

function updateChart() {
  const productNames = products.map(product => product.name);
  const expenses = products.map(product => product.price * product.TotalProductNum);

  myChart.data.labels = productNames;
  myChart.data.datasets[0].data = expenses;

  myChart.update();
}

addProductButton.addEventListener('click', () => {
  if (addProductButton.textContent === 'Add Product') {
    addProduct();
  } else if (addProductButton.textContent === 'Save') {
    const selectedProduct = products[selectedProductIndex];
    selectedProduct.name = productNameInput.value.trim();
    selectedProduct.price = parseFloat(productPriceInput.value);
    selectedProduct.TotalProductNum = parseInt(numberOfproduct.value);

    total = products.reduce(
      (acc, currentValue) => acc + currentValue.price * currentValue.TotalProductNum,
      0
    );
    remaining = totalMoneyInput.value - total;

    updateTable();
    updateTotal();
    updateRemaining();

    productNameInput.value = '';
    productPriceInput.value = '';
    numberOfproduct.value = '';
    addProductButton.textContent = 'Add Product';
    selectedProductIndex = -1;
  }
});

document.getElementById('show_chart').addEventListener('click', () => {

  const chartCanvas = document.getElementById('myChart');
  chartCanvas.style.display = chartCanvas.style.display === 'none' ? 'block' : 'none';
});


function addExpense() {
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);

  if (name === '' || isNaN(amount)) {
    alert('Пожалуйста, введите корректное имя расхода и сумму.');
    return;
  }

  expenses += amount;
  totalExpensesValue.textContent = expenses.toFixed(2);

  updateExpensesTable();

  expenseNameInput.value = '';
  expenseAmountInput.value = '';
}

function updateExpensesTable() {
  expensesTableBody.innerHTML = '';

  for (let i = 0; i < products.length; i++) {
    const expense = products[i];
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const amountCell = document.createElement('td');
    const actionsCell = document.createElement('td');

    nameCell.textContent = expense.name;
    amountCell.textContent = expense.amount.toFixed(2);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="uil uil-trash-alt"></i>';
    deleteButton.addEventListener('click', () => {
      expenses -= expense.amount;
      totalExpensesValue.textContent = expenses.toFixed(2);



      
      updateExpensesTable();
    });

    actionsCell.appendChild(deleteButton);
    row.appendChild(nameCell);
    row.appendChild(amountCell);
    row.appendChild(actionsCell);
    expensesTableBody.appendChild(row);
  }

  updateChart();
}

addExpenseButton.addEventListener('click', addExpense);

// show chart btn
document.getElementById('show_chart').addEventListener('click', () => {
  const chartCanvas = document.getElementById('myChart');
  chartCanvas.style.display = chartCanvas.style.display === 'none' ? 'block' : 'none';
});
