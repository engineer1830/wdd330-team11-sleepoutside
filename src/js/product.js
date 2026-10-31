import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // emu- chnges to add new product to cart
  const cart = getLocalStorage("so-cart");
  // safe check for array value
  const cartItems = Array.isArray(cart) ? cart : [];
  // adding to array/list
  // :TODO: check quantity of product
  // if cartItems.includes(product) {
  //
  // } else {
  // }
  cartItems.push(product);

  setLocalStorage("so-cart", cartItems);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
