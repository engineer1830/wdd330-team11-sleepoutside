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

  const form = e.target;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  order.checkout(form);
});
