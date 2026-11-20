import { loadHeaderFooter, renderListWithTemplate } from "./utils.mjs";
import {
  getWishList,
  removeFromWishList,
  moveToCart,
  showWishListMessage,
} from "./WishList.mjs";

loadHeaderFooter();

const listElement = document.querySelector(".wishlist-list");
const emptyMessage = document.querySelector("#empty-wishlist-message");

function wishListCardTemplate(product) {
  const imageSrc = product.Images?.PrimaryMedium || product.Image;
  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${imageSrc}" alt="${product.NameWithoutBrand}">
        <p class="card__brand">${product.Brand?.Name ?? ""}</p>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${Number(product.FinalPrice).toFixed(2)}</p>
      </a>
      <div class="product-card__actions">
        <button
          type="button"
          class="wishlist-move"
          data-product-id="${product.Id}"
          aria-label="Move ${product.NameWithoutBrand} to cart"
        >
          Move to Cart
        </button>
        <button
          type="button"
          class="wishlist-remove"
          data-product-id="${product.Id}"
          aria-label="Remove ${product.NameWithoutBrand} from wish list"
        >
          Remove
        </button>
      </div>
    </li>
  `;
}

function renderWishList() {
  const items = getWishList();
  emptyMessage.hidden = items.length > 0;

  if (items.length === 0) {
    listElement.innerHTML = "";
    return;
  }

  renderListWithTemplate(
    wishListCardTemplate,
    listElement,
    items,
    "afterbegin",
    true,
  );
}

listElement.addEventListener("click", (event) => {
  const moveButton = event.target.closest(".wishlist-move");
  const removeButton = event.target.closest(".wishlist-remove");

  if (moveButton) {
    const product = moveToCart(moveButton.dataset.productId);
    renderWishList();
    if (product) {
      showWishListMessage(`${product.NameWithoutBrand} moved to your cart.`);
    }
  } else if (removeButton) {
    const product = removeFromWishList(removeButton.dataset.productId);
    renderWishList();
    if (product) {
      showWishListMessage(
        `${product.NameWithoutBrand} removed from your wish list.`,
      );
    }
  }
});

renderWishList();
