import {getLocalStorage, setLocalStorage, renderListWithTemplate,} from "./utils.mjs";


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
        qty: 1
      </p>

      <div class="price-remove">
        <p class="cart-card__price">
          $${item.FinalPrice}
        </p>

        <span
          class="remove-item"
          data-id="${item.Id}"
        >
          ❌
        </span>
      </div>

    </li>
  `;
}

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;

    this.cartItems =
      getLocalStorage("so-cart") || [];
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

    document
      .querySelectorAll(".remove-item")
      .forEach((button) => {
        button.addEventListener(
          "click",
          (event) => {
            const id =
              event.target.dataset.id;

            this.removeItemFromCart(id);
          }
        );
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
        sum + Number(item.FinalPrice),
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

    if (index > -1) {
      this.cartItems.splice(index, 1);
    }

    setLocalStorage(
      "so-cart",
      this.cartItems
    );

    this.renderCartContents();
  }
}