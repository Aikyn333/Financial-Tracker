// Получение элементов форм и других элементов страницы
const productNameInput = document.getElementById('product_name');
const productPriceInput = document.getElementById('product_price');
const numberOfproduct = document.getElementById('numberofproduct');
const totalMoneyInput = document.getElementById('total_budget');
const addProductButton = document.getElementById('add_product');
const productTableBody = document.querySelector('#product_table tbody');
const totalValue = document.getElementById('total_expenses');
const remainingValue = document.getElementById('remaining_value');
const totalMoney = document.getElementById('total');

// Массив для хранения продуктов
let products = [];
// Переменные для хранения общей стоимости и оставшегося бюджета
let total = 0;
let remaining = 0;
// Индекс выбранного продукта для редактирования
let selectedProductIndex = -1;

// Получение элементов форм для расходов
const expenseNameInput = document.getElementById('expense_name');
const expenseAmountInput = document.getElementById('expense_amount');
const addExpenseButton = document.getElementById('add_expense');
const expensesTableBody = document.querySelector('#expenses_table tbody');
const totalExpensesValue = document.getElementById('total_expenses');

// Переменная для хранения общей суммы расходов
let expenses = 0;

// Инициализация графика с использованием библиотеки Chart.js
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

// Функция для добавления нового продукта
function addProduct() {
  // Получение данных из формы
  const name = productNameInput.value.trim();
  const price = parseFloat(productPriceInput.value);
  const number = parseInt(numberOfproduct.value);

  // Проверка введенных данных
  if (name === '' || isNaN(price)) {
    alert('Пожалуйста, введите корректное имя продукта и цену.');
    return;
  }

  // Добавление продукта в массив
  products.push({
    name: name,
    TotalProductNum: number,
    price: price,
  });

  // Пересчет общей стоимости и оставшегося бюджета
  total = products.reduce(
    (acc, currentValue) => acc + currentValue.price * currentValue.TotalProductNum,
    0
  );
  remaining = totalMoneyInput.value - total;
  totalMoney.textContent = totalMoneyInput.value;

  // Обновление таблицы, общей стоимости, оставшегося бюджета и графика
  updateTable();
  updateTotal();
  updateRemaining();

  // Очистка полей ввода
  productNameInput.value = '';
  productPriceInput.value = '';
  numberOfproduct.value = '';
}

// Функция для обновления таблицы продуктов
function updateTable() {
  productTableBody.innerHTML = '';

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const priceCell = document.createElement('td');
    const actionsCell = document.createElement('td');

    // Заполнение ячеек таблицы данными о продукте
    nameCell.textContent =
      product.name +
      ' ' +
      '(' +
      product.TotalProductNum +
      'x' +
      product.price +
      ')';
    priceCell.textContent = product.price.toFixed(2) * product.TotalProductNum;

    // Создание кнопок редактирования и удаления
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
      // Удаление продукта из массива
      products.splice(i, 1);
      // Пересчет общей стоимости и оставшегося бюджета
      total = products.reduce(
        (acc, currentValue) => acc + currentValue.price * currentValue.TotalProductNum,
        0
      );
      remaining = totalMoneyInput.value - total;
      // Обновление таблицы, общей стоимости, оставшегося бюджета и графика
      updateTable();
      updateTotal();
      updateRemaining();
      // Очистка полей ввода
      productNameInput.value = '';
      productPriceInput.value = '';
      addProductButton.textContent = 'Add Product';
    });

    // Добавление кнопок в ячейку "Действия"
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    // Добавление ячеек в строку таблицы
    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(actionsCell);
    // Добавление строки в тело таблицы
    productTableBody.appendChild(row);
  }

  // Обновление графика
  updateChart();
}

// Функция для обновления общей стоимости
function updateTotal() {
  totalValue.textContent = total.toFixed(2);
}

// Функция для обновления оставшегося бюджета
function updateRemaining() {
  remainingValue.textContent = remaining.toFixed(2);
}

// Функция для обновления графика
function updateChart() {
  const productNames = products.map(product => product.name);
  const expenses = products.map(product => product.price * product.TotalProductNum);

  myChart.data.labels = productNames;
  myChart.data.datasets[0].data = expenses;

  myChart.update();
}

// Обработчик события для кнопки "Add Product"
addProductButton.addEventListener('click', () => {
  if (addProductButton.textContent === 'Add Product') {
    addProduct();
  } else if (addProductButton.textContent === 'Save') {
    // Редактирование выбранного продукта
    const selectedProduct = products[selectedProductIndex];
    selectedProduct.name = productNameInput.value.trim();
    selectedProduct.price = parseFloat(productPriceInput.value);
    selectedProduct.TotalProductNum = parseInt(numberOfproduct.value);

    // Пересчет общей стоимости и оставшегося бюджета
    total = products.reduce(
      (acc, currentValue) => acc + currentValue.price * currentValue.TotalProductNum,
      0
    );
    remaining = totalMoneyInput.value - total;

    // Обновление таблицы, общей стоимости, оставшегося бюджета и графика
    updateTable();
    updateTotal();
    updateRemaining();

    // Очистка полей ввода
    productNameInput.value = '';
    productPriceInput.value = '';
    numberOfproduct.value = '';
    addProductButton.textContent = 'Add Product';
    selectedProductIndex = -1;
  }
});

// Обработчик события для кнопки "Show Chart"
document.getElementById('show_chart').addEventListener('click', () => {
  // Переключение видимости графика
  const chartCanvas = document.getElementById('myChart');
  chartCanvas.style.display = chartCanvas.style.display === 'none' ? 'block' : 'none';
});

// Функция для добавления нового расхода
function addExpense() {
  // Получение данных из формы
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);

  // Проверка введенных данных
  if (name === '' || isNaN(amount)) {
    alert('Пожалуйста, введите корректное имя расхода и сумму.');
    return;
  }

  // Добавление расхода
  expenses += amount;
  totalExpensesValue.textContent = expenses.toFixed(2);

  // Обновление таблицы расходов и графика
  updateExpensesTable();

  // Очистка полей ввода
  expenseNameInput.value = '';
  expenseAmountInput.value = '';
}

// Функция для обновления таблицы расходов
function updateExpensesTable() {
  expensesTableBody.innerHTML = '';

  for (let i = 0; i < products.length; i++) {
    const expense = products[i];
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const amountCell = document.createElement('td');
    const actionsCell = document.createElement('td');

    // Заполнение ячеек таблицы данными о расходе
    nameCell.textContent = expense.name;
    amountCell.textContent = expense.amount.toFixed(2);

    // Создание кнопки удаления
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="uil uil-trash-alt"></i>';
    deleteButton.addEventListener('click', () => {
      // Уменьшение общей суммы расходов
      expenses -= expense.amount;
      totalExpensesValue.textContent = expenses.toFixed(2);
      // Обновление таблицы расходов и графика
      updateExpensesTable();
    });

    // Добавление кнопки в ячейку "Действия"
    actionsCell.appendChild(deleteButton);
    // Добавление ячеек в строку таблицы
    row.appendChild(nameCell);
    row.appendChild(amountCell);
    row.appendChild(actionsCell);
    // Добавление строки в тело таблицы
    expensesTableBody.appendChild(row);
  }

  // Обновление графика
  updateChart();
}

// Обработчик события для кнопки "Add Expense"
addExpenseButton.addEventListener('click', addExpense);

// Обработчик события для кнопки "Show Chart"
document.getElementById('show_chart').addEventListener('click', () => {
  // Переключение видимости графика
  const chartCanvas = document.getElementById('myChart');
  chartCanvas.style.display = chartCanvas.style.display === 'none' ? 'block' : 'none';
});
