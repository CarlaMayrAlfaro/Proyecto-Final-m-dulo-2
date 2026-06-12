const TRANSACTION_KEY = "transactionHistory";
const BALANCE_KEY = "accountBalance";

// Lista ficticia de transacciones. Reemplaza `listaTransacciones` por transacciones reales.
const listaTransacciones = [
  { id: 1, type: "Compra", description: "Compra en línea - Tienda A", amount: -5000, date: "2026-06-09" },
  { id: 2, type: "Depósito", description: "Depósito en efectivo", amount: 10000, date: "2026-06-08" },
  { id: 3, type: "Transferencia", description: "Transferencia recibida de X", amount: 7500, date: "2026-06-07" },
  { id: 4, type: "Cobro", description: "Cobro suscripción", amount: -500, date: "2026-06-06" },
  { id: 5, type: "Compra", description: "Compra supermercado", amount: -1200, date: "2026-06-05" },
];

function getStoredTransactions() {
  const stored = localStorage.getItem(TRANSACTION_KEY);
  // Si no hay transacciones en localStorage, usar la lista ficticia `listaTransacciones`.
  if (!stored) return listaTransacciones;
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : listaTransacciones;
  } catch (error) {
    return listaTransacciones;
  }
}

function getStoredBalance() {
  const stored = localStorage.getItem(BALANCE_KEY);
  return stored ? Number(stored) : 100000;
}

function formatAmount(amount) {
  const prefix = amount >= 0 ? "+" : "-";
  return `${prefix}$${Math.abs(amount)}`;
}

function renderTransactionList(transactions) {
  const transactionListEl = document.getElementById("transactionList");
  if (!transactionListEl) return;

  const items = transactions.slice().reverse().map((transaction) => {
    const amountClass = transaction.amount >= 0 ? "text-success" : "text-danger";
    return `
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <div>
          <div class="fw-semibold">${getTipoTransaccion(transaction.type)}</div>
          <div class="text-muted">${transaction.description}</div>
          <small class="text-muted">${transaction.date}</small>
        </div>
        <span class="fw-bold ${amountClass}">${formatAmount(transaction.amount)}</span>
      </li>
    `;
  });

  transactionListEl.innerHTML = items.join("");
}

function renderLatestDetails(transactions, count = 3) {
  const latestEl = document.getElementById("latestDetails");
  if (!latestEl) return;

  const latest = transactions.slice(-count).reverse();
  if (latest.length === 0) {
    latestEl.innerHTML = "<p>No hay movimientos registrados aún.</p>";
    return;
  }

  latestEl.innerHTML = latest
    .map((transaction) => {
      return `
        <div class="mb-3">
          <div class="fw-semibold">${getTipoTransaccion(transaction.type)} - ${transaction.description}</div>
          <div>Fecha: ${transaction.date}</div>
          <div>Monto: <span class="${transaction.amount >= 0 ? "text-success" : "text-danger"}">${formatAmount(transaction.amount)}</span></div>
        </div>
      `;
    })
    .join("");
}

const transactions = getStoredTransactions();
const currentBalance = getStoredBalance();

// Devuelve una etiqueta legible para el tipo de transacción
function getTipoTransaccion(tipo) {
  const map = {
    'Compra': 'Compra',
    'Depósito': 'Depósito',
    'Transferencia': 'Transferencia recibida'
  };
  return map[tipo] || tipo;
}

// Muestra los últimos movimientos aplicando un filtro opcional
function mostrarUltimosMovimientos(filtro = 'all') {
  let filtered = transactions;
  if (filtro && filtro !== 'all') {
    filtered = transactions.filter(t => t.type === filtro);
  }
  renderTransactionList(filtered);
  renderLatestDetails(filtered, 3);
}

// Inicializar vista y bind de filtro usando jQuery
$(document).ready(function() {
  mostrarUltimosMovimientos('all');
  $('#filterSelect').on('change', function() {
    const val = $(this).val();
    // Si la opción es 'Transferencia' el label mostrado es 'Transferencia recibida', pero filtramos por 'Transferencia'
    mostrarUltimosMovimientos(val);
  });
  $('#montoBalance').text(currentBalance);
});









