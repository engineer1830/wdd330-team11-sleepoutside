import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";

loadHeaderFooter().then(updateCartCount);

const category = getParam("category");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const title = document.querySelector("#product-listing-title");

if (!category) {
  throw new Error("Product listing requires a category URL parameter.");
}

const categoryTitle = category
  .split("-")
  .map((word) => word[0].toUpperCase() + word.slice(1))
  .join(" ");

title.textContent = `Top Products: ${categoryTitle}`;

const productList = new ProductList(category, dataSource, listElement);

productList.init();

// Hook up your two HTML buttons
document.querySelector("#sort-by-name").addEventListener("click", () => {
  productList.sortList("name");
});

document.querySelector("#sort-by-price").addEventListener("click", () => {
  productList.sortList("price");
});
