import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();
updateCartCount();

const cartItemsElement = document.querySelector(".product-list");

const cart = new ShoppingCart(cartItemsElement);

cart.init();

// function renderCartContents(statusMessage = "") {
//   const cartItems = getLocalStorage("so-cart") || [];

//   const htmlItems = cartItems.map((item, index) =>
//     cartItemTemplate(item, index),
//   );

//   document.querySelector(".product-list").innerHTML = htmlItems.join("");
//   renderCartTotal(cartItems);

//   const emptyMessage = document.querySelector("#empty-cart-message");
//   emptyMessage.hidden = cartItems.length > 0;

//   document.querySelector("#cart-status").textContent = statusMessage;
// }

// function renderCartTotal(cartItems) {
//   const footer = document.querySelector(".cart-footer");

//   if (cartItems.length === 0) {
//     footer.classList.add("hide");
//     return;
//   }

//   const total = cartItems.reduce(
//     (sum, item) => sum + Number(item.FinalPrice),
//     0,
//   );
//   document.querySelector(".cart-total").textContent =
//     `Total: $${total.toFixed(2)}`;
//   footer.classList.remove("hide");
// }

// function getCartImageUrl(item) {
//   return item.Images?.PrimaryMedium || item.Image;
// }

// function cartItemTemplate(item, index) {
//   return `
//     <li class="cart-card divider">
//       <img
//         class="cart-card__image"
//         src="${getCartImageUrl(item)}"
//         alt="${item.Name}"
//       />

//       <h2 class="card__name">${item.Name}</h2>

//       <p class="cart-card__color">
//         Color: ${item.Colors?.[0]?.ColorName || "Not specified"}
//       </p>

//       <p class="cart-card__quantity">Quantity: 1</p>

//       <p class="cart-card__price">$${item.FinalPrice}</p>

//       <button
//         type="button"
//         class="cart-card_remove"
//         data-index="${index}"
//         aria-label="Remove ${item.Name} from cart"
//       >
//         Remove
//       </button>
//     </li>
//   `;
// }

// function removeProductFromCart(index) {
//   const cartItems = getLocalStorage("so-cart") || [];

//   if (index < 0 || index >= cartItems.length) {
//     return;
//   }

//   const removedItem = cartItems[index];

//   cartItems.splice(index, 1);
//   setLocalStorage("so-cart", cartItems);
//   updateCartCount();

//   renderCartContents(`${removedItem.Name} was removed from your cart.`);
// }

// renderCartContents();

// document.querySelector(".product-list").addEventListener("click", (event) => {
//   const removeButton = event.target.closest(".cart-card_remove");

//   if (removeButton) {
//     removeProductFromCart(Number(removeButton.dataset.index));
//   }
// });

// updateCartCount();
