import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

import CheckoutProcess from "./CheckoutProcess.mjs";

const order = new CheckoutProcess("so-cart", "#checkout-form");
order.init();

document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));

document.querySelector("#checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  order.checkout(e.target);
});

// -----------------------------------------------------------IVAN iproved
// Allow only numbers in the card number field and number with spaces after every 4 digits
const cardNumberInput = document.querySelector("#cardNumber");

if (cardNumberInput) {
  cardNumberInput.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");

    // Allow only 16 digits
    value = value.slice(0, 16);

    // Add a space after every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");

    event.target.value = value;
  });
}

// Format expiration date as MM/YY
const expirationInput = document.querySelector("#expiration");

if (expirationInput) {
  expirationInput.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");
    value = value.slice(0, 4);

    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    event.target.value = value;
  });
}

// Allow only numbers in the CVV field
const cvvInput = document.querySelector("#code");

if (cvvInput) {
  cvvInput.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");

    // Allow only 3 digits
    value = value.slice(0, 3);

    event.target.value = value;
  });
}
