import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter().then(updateCartCount);

const cartItemsElement = document.querySelector(".product-list");

const cart = new ShoppingCart(cartItemsElement);

cart.init();
