const INITIAL_BALANCE = 100_000;
const BALANCE_KEY = "accountBalance";
const TRANSACTION_KEY = "transactionHistory";

function getStoredBalance() {
  const stored = localStorage.getItem(BALANCE_KEY);
  return stored ? Number(stored) : INITIAL_BALANCE;
}

function setStoredBalance(balance) {
  localStorage.setItem(BALANCE_KEY, String(balance));
}

function getStoredTransactions() {
  const stored = localStorage.getItem(TRANSACTION_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function setStoredTransactions(transactions) {
  localStorage.setItem(TRANSACTION_KEY, JSON.stringify(transactions));
}

function addTransaction(transaction) {
  const transactions = getStoredTransactions();
  transactions.push(transaction);
  setStoredTransactions(transactions);
}

// Usar jQuery al cargar la página para obtener y mostrar el balance
$(document).ready(function () {
  const balanceActual = getStoredBalance();
  // Mostrar balance en el formulario
  $('#montoBalance').text(balanceActual);

  // Manejar envío del formulario con jQuery
  $('#formDeposit').submit(function (event) {
    event.preventDefault();

    let montoDeposito = Number($('#monto').val());

    const balance = Number($('#montoBalance').text());
    const nuevoBalance = balance + montoDeposito;

    setStoredBalance(nuevoBalance);
    $('#montoBalance').text(nuevoBalance);

    addTransaction({
      id: Date.now(),
      type: 'Depósito',
      description: 'Depósito en cuenta',
      amount: montoDeposito,
      date: new Date().toLocaleDateString('es-AR'),
    });

    // Resetear formulario
    this.reset();

    // Ocultar mensaje anterior si existe
    $('#depositMessage').hide();

    // Crear alerta Bootstrap dinámica y agregarla a #alert-container
    const alertHtml = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>¡Éxito!</strong> Has depositado $${montoDeposito}. Tu nuevo balance es $${nuevoBalance}.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    $('#alert-container').html(alertHtml);

    // Redirigir después de 2 segundos para que el usuario vea la confirmación
    setTimeout(function () {
      window.location.href = 'menu.html';
    }, 2000);
  });
});