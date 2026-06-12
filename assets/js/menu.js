const INITIAL_BALANCE = 100_000;

function getStoredBalance() {
  const stored = localStorage.getItem("accountBalance");
  return stored ? Number(stored) : INITIAL_BALANCE;
}

function setStoredBalance(balance) {
  localStorage.setItem("accountBalance", String(balance));
}

// CAPTURAR ELEMENTO DEL DOM
const montoBalance = document.getElementById("montoBalance");
const redirectMessage = document.getElementById("redirectMessage");
const btnDeposit = document.getElementById("btnDeposit");
const btnSendMoney = document.getElementById("btnSendMoney");
const btnTransactions = document.getElementById("btnTransactions");

console.log(montoBalance); // ver elemento en consola

const saldoActual = getStoredBalance();
setStoredBalance(saldoActual);

// MANIPULACIÓN DEL ELEMENTO DEL DOM
montoBalance.innerText = saldoActual;

// innerText sirve para obtener y asignar un contenido a un elemento;

// CONOCER EL CONTENIDO DE UN ELEMENTO
console.log("Valor del elemento:", montoBalance.innerText);

function handleRedirectButton(buttonEl, screenName) {
  if (!buttonEl) return;

  buttonEl.addEventListener("click", function (event) {
    event.preventDefault();

    if (redirectMessage) {
      redirectMessage.innerText = `Redirigiendo a ${screenName}...`;
    }

    setTimeout(function () {
      window.location.href = buttonEl.href;
    }, 600);
  });
}

handleRedirectButton(btnDeposit, "Depositar");
handleRedirectButton(btnSendMoney, "Enviar dinero");
handleRedirectButton(btnTransactions, "Últimos movimientos");