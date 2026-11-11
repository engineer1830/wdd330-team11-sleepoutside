import {getLocalStorage, setLocalStorage, renderListWithTemplate,} from "./utils.mjs";

const imageUrls = import.meta.glob("../images/tents/*", {
  eager: true, import: "default", query: "?url",
});

function getCartImageUrl(imagePath) {
  return imageUrls[imagePath] || imagePath;
}

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">

      <a href="#" class="cart-card__image">
        <img
          src="${getCartImageUrl(item.Image)}"
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