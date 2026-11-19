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
