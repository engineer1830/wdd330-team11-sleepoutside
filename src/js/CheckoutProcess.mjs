import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity,
  }));
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

// The server may send its error as a string, as { message }, or as an object of messages.
function errorText(message) {
  if (typeof message === "string") return message;
  if (message && typeof message.message === "string") return message.message;
  if (message && typeof message === "object") {
    return Object.values(message).join(". ");
  }
  return "Something went wrong. Please try again.";
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.FinalPrice * item.quantity,
      0,
    );
    document.querySelector("#subtotal").textContent = this.itemTotal.toFixed(2);
  }

  calculateOrderTotal() {
    const count = this.list.reduce((sum, item) => sum + item.quantity, 0);
    this.tax = this.itemTotal * 0.06;
    this.shipping = 10 + (count - 1) * 2;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector("#tax").textContent = this.tax.toFixed(2);
    document.querySelector("#shipping").textContent = this.shipping.toFixed(2);
    document.querySelector("#orderTotal").textContent =
      this.orderTotal.toFixed(2);
  }

  async checkout(form) {
    // Make sure totals exist even if the user never left the zip field.
    this.calculateOrderTotal();

    const order = formDataToJSON(form);
    // The card field shows spaces (1234 1234 ...); the server expects digits only.
    order.cardNumber = order.cardNumber.replace(/\s/g, "");
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping;
    order.items = packageItems(this.list);

    try {
      await new ExternalServices().checkout(order);
      localStorage.removeItem(this.key);
      form.reset();
      // replace() keeps the checkout page out of the Back history
      window.location.replace("/checkout/success.html");
    } catch (err) {
      // Stay on the form so the user can fix the problem.
      const message =
        err.name === "servicesError"
          ? errorText(err.message)
          : "Could not reach the server. Check your connection and try again.";

      // Clear any earlier alert so they don't stack, then auto-dismiss this one.
      document
        .querySelectorAll(".alert")
        .forEach((oldAlert) => oldAlert.remove());
      const alertElement = alertMessage(message);
      setTimeout(() => alertElement?.remove(), 6000);
    }
  }
}
