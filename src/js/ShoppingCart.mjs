import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
  updateCartCount,
} from "./utils.mjs";


function getCartImageUrl(item) {
  return item.Images?.PrimaryMedium || item.Image;
}

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">

      <a href="#" class="cart-card__image">
        <img
          src="${getCartImageUrl(item)}"
          alt="${item.Name}"
        />
      </a>

      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">
        ${item.Colors[0].ColorName}
      </p>

      <p class="cart-card__quantity">
        <span>qty: ${item.quantity}</span>
        <span class="cart-card__quantity-controls">
          <button
            type="button"
            class="cart-card_quantity-button"
            data-action="decrease"
            data-id="${item.Id}"
            aria-label="Decrease quantity of ${item.Name}"
            ${item.quantity === 1 ? "disabled" : ""}
          >
            −
          </button>
          <button
            type="button"
            class="cart-card_quantity-button"
            data-action="increase"
            data-id="${item.Id}"
            aria-label="Increase quantity of ${item.Name}"
          >
            +
          </button>
        </span>
      </p>

      <p class="cart-card__price">$${(
        Number(item.FinalPrice) * item.quantity
      ).toFixed(2)}</p>

      <button
        type="button"
        class="cart-card_remove"
        data-id="${item.Id}"
        aria-label="Remove ${item.Name} from cart"
      >
        Remove
      </button>

    </li>
  `;
}

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;

    this.cartItems = (getLocalStorage("so-cart") || []).map((item) => ({
      ...item,
      quantity: Number(item.quantity) || 1,
    }));
    this.statusTimeout = null;
  }

  init() {
    this.renderCartContents();
  }

  renderCartContents() {
    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      this.cartItems,
      "afterbegin",
      true
    );

    this.renderCartTotal();
    document.querySelector("#empty-cart-message").hidden =
      this.cartItems.length > 0;

    document
      .querySelectorAll(".cart-card_remove")
      .forEach((button) => {
        button.addEventListener(
          "click",
          (event) => {
            const id = event.target.dataset.id;

            this.removeItemFromCart(id);
          }
        );
      });

    document
      .querySelectorAll(".cart-card_quantity-button")
      .forEach((button) => {
        button.addEventListener("click", (event) => {
          const target = event.currentTarget;
          const id = target.dataset.id;
          const amount = target.dataset.action === "increase" ? 1 : -1;

          this.updateItemQuantity(id, amount);
        });
      });
  }

  renderCartTotal() {
    const footer =
      document.querySelector(".cart-footer");

    if (!footer) return;

    if (this.cartItems.length === 0) {
      footer.classList.add("hide");
      return;
    }

    const total = this.cartItems.reduce(
      (sum, item) =>
        sum + Number(item.FinalPrice) * item.quantity,
      0
    );

    document.querySelector(".cart-total").textContent =
      `Total: $${total.toFixed(2)}`;

    footer.classList.remove("hide");
  }

  removeItemFromCart(id) {
    const index =
      this.cartItems.findIndex(
        (item) => item.Id === id
      );

    if (index < 0) {
      return;
    }

    const removedItem = this.cartItems[index];
    this.cartItems.splice(index, 1);

    setLocalStorage("so-cart", this.cartItems);
    updateCartCount();
    this.showStatus(`${removedItem.Name} was removed from your cart.`);

    this.renderCartContents();
  }

  updateItemQuantity(id, amount) {
    const item = this.cartItems.find((cartItem) => cartItem.Id === id);

    if (!item) {
      return;
    }

    const nextQuantity = item.quantity + amount;

    if (nextQuantity < 1) {
      return;
    }

    item.quantity = nextQuantity;
    setLocalStorage("so-cart", this.cartItems);
    updateCartCount();
    this.renderCartContents();
  }

  showStatus(message) {
    const status = document.querySelector("#cart-status");

    if (!status) {
      return;
    }

    clearTimeout(this.statusTimeout);
    status.textContent = message;
    status.classList.add("is-visible");

    this.statusTimeout = setTimeout(() => {
      status.textContent = "";
      status.classList.remove("is-visible");
    }, 3500);
  }
}