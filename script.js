const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    //     id: 1,
    //     name: 'salary',
    //     amount: 5000,
    //     date: new Date(),
    //     type: 'income'
    // },
    
    // {
    //     id: 2,
    //     name: 'haircut',
    //     amount: 100,
    //     date: new Date(),
    //     type: 'expense'
    // },
    
    // {
    //     id: 3,
    //     name: 'concert ticket',
    //     amount: 700,
    //     date: new Date(),
    //     type: 'expense'
    // },
const formatter = new Intl.NumberFormat("india", {
  style: "currency",
  currency: "INR",
  signDisplay: "always",
});

const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const status = document.getElementById("status");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const budgetMessage = document.getElementById("budget-message");
// const remainingBudgetSpan = document.getElementById("remaining-budget");

let budget = 0;
let remainingBudget = 0;
let savingsAmount = 0;

document.getElementById("total-amount-button").addEventListener("click", setBudget);
// income.addEventListener("input", updateRemainingBudget);

function setBudget() {
  budget = parseFloat(document.getElementById("total-amount").value);
  // remainingBudgetSpan.textContent = formatter.format(0).substring(1);
  remainingBudget = budget;
  updateRemainingBudget();


  budgetMessage.textContent = `BUDGET SET:- ${formatter.format(budget).substring(1)}`;

  if (income.textContent !== "Rs.0") {
    savingsAmount = income.textContent.substring(3) - budget;
    savings.textContent = `Savings: ${formatter.format(savingsAmount)}`;
}
}

// function setBudget() {
//   budget = parseFloat(document.getElementById("total-amount").value);
//   remainingBudgetSpan.textContent = formatter.format(0).substring(1); 
//   updateRemainingBudget(); 
// }

form.addEventListener("submit", addTransaction);

function updateTotal() {
  const incomeTotal = transactions
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount, 0);

  const expenseTotal = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total + trx.amount, 0);

  const balanceTotal = incomeTotal - expenseTotal;

  balance.textContent = formatter.format(balanceTotal).substring(1);
  income.textContent = formatter.format(incomeTotal);
  expense.textContent = formatter.format(expenseTotal * -1);

  if (expenseTotal > budget) {
    budgetMessage.textContent = "Expense exceeds budget! Cannot add transaction.";
  } else {
    budgetMessage.textContent = `BUDGET SET:- ${formatter.format(budget).substring(1)}`;
  }

  // const remainingBudgetElement = document.getElementById("remaining-budget");
  // remainingBudgetElement.textContent = formatter.format(remainingBudget).substring(1);
  // remainingBudgetElement.classList.toggle("over-budget", remainingBudget < 0);

  if (budget > 0 && incomeTotal > 0) {
    savingsAmount = incomeTotal - budget;
    savings.textContent = `${formatter.format(savingsAmount)}`;
  }

}

function renderList() {
  list.innerHTML = "";

  status.textContent = "";
  if (transactions.length === 0) {
    status.textContent = "No transactions.";
    return;
  }

  transactions.forEach(({ id, name, amount, date, type }) => {
    const sign = "income" === type ? 1 : -1;

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
      </div>

      <div class="amount ${type}">
        <span>${formatter.format(amount * sign)}</span>
      </div>
    
      <div class="action">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    `;

    list.appendChild(li);
  });
}

renderList();
updateTotal();

function deleteTransaction(id) {
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1);

  updateTotal();
  saveTransactions();
  renderList();
}

function addTransaction(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const transactionAmount = parseFloat(formData.get("amount"));

  // const transactionType = formData.get("type");
  // if (transactionType === "expense") {
  //   remainingBudget -= transactionAmount;
  //   updateRemainingBudget();
  // }

  if (transactions.length === 0 && transactionAmount > 0) {
    balance.textContent = formatter.format(transactionAmount * -1).substring(1);
  }


  transactions.push({
    id: transactions.length + 1,
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: new Date(formData.get("date")),
    type: "on" ===  formData.get("type") ? "income" : "expense",
  });


  remainingBudget -= transactionAmount;
  updateRemainingBudget();
  this.reset();

  updateTotal();
  saveTransactions();
  renderList();
}


function updateRemainingBudget() {
  const remainingBudgetElement = document.getElementById("remaining-budget");
  const remainingBudgetFormatted = formatter.format(remainingBudget);

  if (remainingBudget < 0) {
    remainingBudgetElement.textContent = '-' + remainingBudgetFormatted.substring(1);
  } else {
    remainingBudgetElement.textContent = remainingBudgetFormatted.substring(1);
  }

  remainingBudgetElement.classList.toggle("over-budget", remainingBudget < 0);
}



// function updateRemainingBudget() {
//   const incomeAmount = parseFloat(income.textContent.substring(3)); 
//   const remainingBudget = incomeAmount - budget;
//   remainingBudgetSpan.textContent = formatter.format(Math.max(0, remainingBudget)).substring(1); 
//   savingsSpan.textContent = formatter.format(Math.max(0, -remainingBudget)).substring(1); 
// }


function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  localStorage.setItem("transactions", JSON.stringify(transactions));
}








