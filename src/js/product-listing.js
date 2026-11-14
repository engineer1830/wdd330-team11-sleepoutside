import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";

loadHeaderFooter().then(updateCartCount);

const category = getParam("category");
const search = getParam("search");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const title = document.querySelector("#product-listing-title");

if (!category && !search) {
  throw new Error(
    "Product listing requires a category or search URL parameter.",
  );
}

const query = search || category;
const categoryTitle = category
  ? category
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ")
  : "";

title.textContent = search
  ? `Search results for: ${search}`
  : `Top Products: ${categoryTitle}`;

document.querySelector("#breadcrumb").innerHTML = search
  ? `<a href="/index.html">Home</a> → Search: ${search}`
  : `<a href="/index.html">Home</a> → ${categoryTitle}`;

const productList = new ProductList(
  query,
  dataSource,
  listElement,
  Boolean(search),
);

productList.init();

// Hook up your two HTML buttons
document.querySelector("#sort-by-name").addEventListener("click", () => {
  productList.sortList("name");
});

document.querySelector("#sort-by-price").addEventListener("click", () => {
  productList.sortList("price");
});
