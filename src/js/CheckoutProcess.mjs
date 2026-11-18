import { getLocalStorage } from "./utils.mjs";

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
        this.list= getLocalStorage(this.key);
        this.calculateItemSubTotal();
    }

    calculateItemSubTotal() {  
        this.itemTotal = this.list.reduce(
            (sum, item) => sum + item.FinalPrice * item.quantity,0);
        document.querySelector("#subtotal").textContent = this.itemTotal.toFixed(2);
    }

    calculateOrderTotal() {
        const count = this.list.reduce((sum, item) => sum + item.quantity, 0);
        this.tax = (this.itemTotal * 0.06);
        this.shipping = 10 + (count -1 ) *2;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        this.displayOrderTotals()
    }

    displayOrderTotals() {
        document.querySelector("#tax").textContent = this.tax.toFixed(2);
        document.querySelector("#shipping").textContent = this.shipping.toFixed(2);
        document.querySelector("#orderTotal").textContent = this.orderTotal.toFixed(2);
    }
}
