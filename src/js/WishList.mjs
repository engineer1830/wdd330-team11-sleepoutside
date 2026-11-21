import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
  updateWishListCount,
  alertMessage,
} from "./utils.mjs";

const WISHLIST_KEY = "so-wishlist";
const CART_KEY = "so-cart";

export function getWishList() {
  return getLocalStorage(WISHLIST_KEY) || [];
}

export function isInWishList(productId) {
  return getWishList().some((item) => String(item.Id) === String(productId));
}

// Each product is stored once.
export function addToWishList(product) {
  const items = getWishList();
  if (items.some((item) => String(item.Id) === String(product.Id))) return;
  items.push(product);
  setLocalStorage(WISHLIST_KEY, items);
  updateWishListCount();
}

// Returns the removed product, or null if it was not on the list.
export function removeFromWishList(productId) {
  const items = getWishList();
  const removed = items.find((item) => String(item.Id) === String(productId));
  if (!removed) return null;
  setLocalStorage(
    WISHLIST_KEY,
    items.filter((item) => String(item.Id) !== String(productId)),
  );
  updateWishListCount();
  return removed;
}

// Same rule as Add to Cart: an item already in the cart gets +1 quantity.
export function moveToCart(productId) {
  const product = getWishList().find(
    (item) => String(item.Id) === String(productId),
  );
  if (!product) return null;

  const cart = getLocalStorage(CART_KEY) || [];
  const existingItem = cart.find((item) => item.Id === product.Id);
  if (existingItem) {
    existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  setLocalStorage(CART_KEY, cart);

  removeFromWishList(productId);
  updateCartCount();
  return product;
}

// Shows one short-lived success alert, replacing any earlier one.
export function showWishListMessage(message) {
  document.querySelectorAll(".alert").forEach((oldAlert) => oldAlert.remove());
  const alertElement = alertMessage(message, true, "success");
  setTimeout(() => alertElement?.remove(), 3000);
}

// Wires the product page button so it toggles Add / Remove.
export function initWishListButton(product, button) {
  if (!button) return;

  const renderLabel = () => {
    button.textContent = isInWishList(product.Id)
      ? "Remove from Wish List"
      : "Add to Wish List";
  };

  button.addEventListener("click", () => {
    if (isInWishList(product.Id)) {
      removeFromWishList(product.Id);
      showWishListMessage(
        `${product.NameWithoutBrand} removed from your wish list.`,
      );
    } else {
      addToWishList(product);
      showWishListMessage(
        `${product.NameWithoutBrand} added to your wish list!`,
      );
    }
    renderLabel();
  });

  renderLabel();
}
