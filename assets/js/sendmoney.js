const INITIAL_BALANCE = 100_000;
const BALANCE_KEY = "accountBalance";
const CONTACTS_KEY = "sendContacts";
const TRANSACTION_KEY = "transactionHistory";

const defaultContacts = [
  {
    id: "contact-1",
    name: "John Doe",
    cbu: "123456789",
    alias: "john.doe",
    bank: "ABC Bank",
  },
  {
    id: "contact-2",
    name: "Jane Smith",
    cbu: "987654321",
    alias: "jane.smith",
    bank: "XYZ Bank",
  },
];

function getStoredBalance() {
  const stored = localStorage.getItem(BALANCE_KEY);
  return stored ? Number(stored) : INITIAL_BALANCE;
}

function setStoredBalance(balance) {
  localStorage.setItem(BALANCE_KEY, String(balance));
}

function getStoredContacts() {
  const stored = localStorage.getItem(CONTACTS_KEY);
  if (!stored) return defaultContacts;
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : defaultContacts;
  } catch (error) {
    return defaultContacts;
  }
}

function setStoredContacts(contacts) {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
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

function formatContactLabel(contact) {
  return `${contact.name} — CBU: ${contact.cbu}, Alias: ${contact.alias}, Banco: ${contact.bank}`;
}

function renderContacts(contactsToRender) {
  const list = contactsToRender || contacts;
  contactList.innerHTML = "";
  contactSelect.innerHTML = `
    <option value="" disabled selected>Selecciona un contacto</option>
  `;

  if (list.length === 0) {
    contactList.innerHTML = '<li class="list-group-item">No hay contactos cargados.</li>';
    return;
  }

  list.forEach((contact) => {
    const option = document.createElement("option");
    option.value = contact.id;
    option.textContent = contact.name + " (" + contact.alias + ")";
    contactSelect.appendChild(option);

    const item = document.createElement("li");
    item.className = "list-group-item";
    item.textContent = formatContactLabel(contact);
    item.dataset.id = contact.id;
    // Permitir seleccionar contacto desde la lista
    item.addEventListener('click', function() {
      contactSelect.value = contact.id;
      // disparar evento change manualmente
      contactSelect.dispatchEvent(new Event('change'));
    });
    contactList.appendChild(item);
  });
}

function filterContacts(query) {
  const text = query.trim().toLowerCase();
  if (!text) {
    renderContacts(contacts);
    return;
  }

  const filtered = contacts.filter((contact) => {
    return (
      contact.name.toLowerCase().includes(text) ||
      contact.cbu.toLowerCase().includes(text) ||
      contact.alias.toLowerCase().includes(text) ||
      contact.bank.toLowerCase().includes(text)
    );
  });

  renderContacts(filtered);
}

const montoBalance = document.getElementById("montoBalance");
const contactList = document.getElementById("contactList");
const contactSelect = document.getElementById("contactSelect");
const formAddContact = document.getElementById("formAddContact");
const formSendMoney = document.getElementById("formSendMoney");
const searchInput = document.getElementById("contacto");
const contactModalElement = document.getElementById("contactModal");
const contactModal = bootstrap.Modal.getOrCreateInstance(contactModalElement);

let contacts = getStoredContacts();

montoBalance.innerText = getStoredBalance();
renderContacts(contacts);

formAddContact.addEventListener("submit", function (event) {
  event.preventDefault();

  const nombreApellido = document.getElementById("nombreApellido").value.trim();
  const cbu = document.getElementById("cbu").value.trim();
  const alias = document.getElementById("alias").value.trim();
  const banco = document.getElementById("banco").value.trim();

  // Validaciones básicas
  let hasError = false;

  // Limpiar estados previos
  document.getElementById('cbu').classList.remove('is-invalid');

  if (!nombreApellido || !cbu || !alias || !banco) {
    alert("Completa todos los campos del contacto.");
    return;
  }

  // Validar CBU: solo dígitos, entre 8 y 22 caracteres (flexible según formato)
  const cbuIsValid = /^\d{8,22}$/.test(cbu);
  if (!cbuIsValid) {
    const cbuInput = document.getElementById('cbu');
    cbuInput.classList.add('is-invalid');
    hasError = true;
  }

  if (hasError) return;

  const newContact = {
    id: `contact-${Date.now()}`,
    name: nombreApellido,
    cbu,
    alias,
    bank: banco,
  };

  contacts.push(newContact);
  setStoredContacts(contacts);
  renderContacts(contacts);

  formAddContact.reset();
  contactModal.hide();
  // Mostrar mensaje de éxito usando una alerta Bootstrap temporal
  const alertBox = document.createElement('div');
  alertBox.className = 'alert alert-success alert-dismissible fade show mt-2';
  alertBox.role = 'alert';
  alertBox.innerHTML = `<strong>¡Listo!</strong> Contacto agregado correctamente.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
  document.querySelector('.container')?.prepend(alertBox);
});

if (searchInput) {
  searchInput.addEventListener("input", function () {
    filterContacts(searchInput.value);
  });
}

// Mostrar modal y manejar cancelar manualmente para control adicional
const btnAgregarContacto = document.getElementById('btn-agregar-contacto');
const btnCancelAddContact = document.getElementById('btnCancelAddContact');
if (btnAgregarContacto) {
  btnAgregarContacto.addEventListener('click', function (e) {
    e.preventDefault();
    contactModal.show();
  });
}
if (btnCancelAddContact) {
  btnCancelAddContact.addEventListener('click', function () {
    // Limpiar formulario y estados de validación al cancelar
    formAddContact.reset();
    document.getElementById('cbu').classList.remove('is-invalid');
  });
}

formSendMoney.addEventListener("submit", function (event) {
  event.preventDefault();

  const selectedContactId = contactSelect.value;
  const amountValue = Number(document.getElementById("monto").value);
  const currentBalance = getStoredBalance();

  if (!selectedContactId) {
    alert("Selecciona un contacto para enviar dinero.");
    return;
  }

  if (!amountValue || amountValue <= 0) {
    alert("Ingresa un monto válido para transferir.");
    return;
  }

  if (amountValue > currentBalance) {
    alert("Saldo insuficiente para realizar la transferencia.");
    return;
  }

  const selectedContact = contacts.find((contact) => contact.id === selectedContactId);
  if (!selectedContact) {
    alert("El contacto seleccionado no es válido.");
    return;
  }

  const newBalance = currentBalance - amountValue;
  setStoredBalance(newBalance);
  montoBalance.innerText = newBalance;

  addTransaction({
    id: Date.now(),
    type: "Transferencia",
    description: `Envío a ${selectedContact.name} (${selectedContact.alias})`,
    amount: -amountValue,
    date: new Date().toLocaleDateString("es-AR"),
  });

  formSendMoney.reset();
  contactSelect.selectedIndex = 0;
  // Mostrar mensaje de confirmación en la parte inferior de la página
  const confirmationEl = document.getElementById('sendConfirmation');
  if (confirmationEl) {
    confirmationEl.textContent = `Transferencia confirmada a ${selectedContact.name} (${selectedContact.alias}). Nuevo saldo: $${newBalance}`;
    $(confirmationEl).fadeIn();
    // Ocultar después de 5 segundos
    setTimeout(() => { $(confirmationEl).fadeOut(); }, 5000);
  } else {
    alert(`Transferencia confirmada a ${selectedContact.name} (${selectedContact.alias}). Nuevo saldo: $${newBalance}`);
  }

  // Deshabilitar botón de enviar hasta seleccionar otro contacto
  const btnSubmit = document.getElementById('btnSubmitSendMoney');
  if (btnSubmit) btnSubmit.disabled = true;
});

// Habilitar botón de enviar cuando se selecciona un contacto y resaltar en la lista
contactSelect.addEventListener('change', function() {
  const selectedId = contactSelect.value;
  const btnSubmit = document.getElementById('btnSubmitSendMoney');
  if (btnSubmit) btnSubmit.disabled = !selectedId;

  // Resaltar en la lista
  const items = contactList.querySelectorAll('.list-group-item');
  items.forEach(it => {
    if (it.dataset.id === selectedId) it.classList.add('active');
    else it.classList.remove('active');
  });
});