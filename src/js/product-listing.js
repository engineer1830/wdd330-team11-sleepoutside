import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";

loadHeaderFooter().then(updateCartCount);

const category = getParam("category");
const search = getParam("search");
const dataSource = new ExternalServices();
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

// Quick View functionality
const quickViewModal = document.querySelector("#quick-view-modal");
const quickViewContent = document.querySelector("#quick-view-content");
const closeQuickView = document.querySelector(".quick-view-close");

listElement.addEventListener("click", (event) => {
  const button = event.target.closest(".quick-view-button");

  if (!button) return;

  const productId = button.dataset.productId;

  const selectedProduct = productList.products.find(
    (product) => String(product.Id) === String(productId),
  );

  if (!selectedProduct) return;

  quickViewContent.innerHTML = `
    <h2>${selectedProduct.Brand.Name}</h2>
    <h3>${selectedProduct.NameWithoutBrand}</h3>
    <img
      src="${selectedProduct.Images?.PrimaryLarge || selectedProduct.Image}"
      alt="${selectedProduct.NameWithoutBrand}"
    >
    <p>Price: $${selectedProduct.FinalPrice.toFixed(2)}</p>
    <p>${selectedProduct.DescriptionHtmlSimple || ""}</p>
  `;

  quickViewModal.showModal();
});

closeQuickView.addEventListener("click", () => {
  quickViewModal.close();
});

quickViewModal.addEventListener("click", (event) => {
  if (event.target === quickViewModal) {
    quickViewModal.close();
  }
});

// Add to Cart functionality
listElement.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-cart-button");

  if (!button) return;

  productList.addProductToCart(button.dataset.productId);

  button.textContent = "Added!";

  setTimeout(() => {
    button.textContent = "Add to Cart";
  }, 1500);
});
