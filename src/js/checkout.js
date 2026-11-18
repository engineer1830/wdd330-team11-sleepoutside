import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

import CheckoutProcess from "./CheckoutProcess.mjs";

const order = new CheckoutProcess("so-cart", "#checkout-form");
order.init();


document
    .querySelector("#zip")
    .addEventListener("blur", order.calculateOrderTotal.bind(order));
