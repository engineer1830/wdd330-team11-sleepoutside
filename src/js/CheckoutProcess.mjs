import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: item.quantity
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
        this.list = getLocalStorage(this.key);
        this.calculateItemSubTotal();
    }

    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce(
            (sum, item) => sum + item.FinalPrice * item.quantity, 0);
        document.querySelector("#subtotal").textContent = this.itemTotal.toFixed(2);
    }

    calculateOrderTotal() {
        const count = this.list.reduce((sum, item) => sum + item.quantity, 0);
        this.tax = (this.itemTotal * 0.06);
        this.shipping = 10 + (count - 1) * 2;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        this.displayOrderTotals()
    }

    displayOrderTotals() {
        document.querySelector("#tax").textContent = this.tax.toFixed(2);
        document.querySelector("#shipping").textContent = this.shipping.toFixed(2);
        document.querySelector("#orderTotal").textContent = this.orderTotal.toFixed(2);
    }

    async checkout(form) {
    try {
        const order = formDataToJSON(form);

        // Remove formatting before sending data to the backend
        order.cardNumber = order.cardNumber.replace(/\s/g, "");
        order.expiration = order.expiration.replace("/", "");

        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal.toFixed(2);
        order.tax = this.tax.toFixed(2);
        order.shipping = this.shipping;
        order.items = packageItems(this.list);

        await new ExternalServices().checkout(order);

        localStorage.removeItem(this.key);

        window.location.href = "/checkout/success.html";

    } catch (error) {
        alert("Something went wrong while processing your order. Please try again.");
    }
}

}
