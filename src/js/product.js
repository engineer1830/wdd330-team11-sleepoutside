import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart");
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  if (!product) {
    alert("Sorry, we couldn't add that item to your cart.");
    return;
  }
  addProductToCart(product);
  alert(`${product.Name} has been added to your cart.`);
}

// add listener to Add to Cart button
const addToCartButton = document.getElementById("addToCart");
if (addToCartButton) {
  addToCartButton.addEventListener("click", addToCartHandler);
}
