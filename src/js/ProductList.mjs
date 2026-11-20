
import {
  renderListWithTemplate,
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
} from "./utils.mjs";

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;

  const discountPercent = isDiscounted
    ? Math.round(
        ((product.SuggestedRetailPrice - product.FinalPrice) /
          product.SuggestedRetailPrice) *
          100,
      )
    : 0;

  const images = product.Images || {};
  const imageSrc = images.PrimaryMedium || product.Image;

  const imageSrcset = images.PrimarySmall
    ? `srcset="${images.PrimarySmall} 80w, ${images.PrimaryMedium} 160w, ${images.PrimaryLarge} 320w" sizes="(max-width: 500px) 160px, 320px"`
    : "";

  return `
    <li class="product-card">
      <a href="../product_pages/index.html?product=${product.Id}">
        <img ${imageSrcset} src="${imageSrc}" alt="${product.NameWithoutBrand}">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">
          $${product.FinalPrice}
          ${
            isDiscounted
              ? `<span class="product-card__original-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>`
              : ""
          }
        </p>
        ${
          isDiscounted
            ? `<span class="discount-badge">${discountPercent}% OFF</span>`
            : ""
        }
      </a>

      <div class="product-card__actions">
        <button
          type="button"
          class="quick-view-button"
          data-product-id="${product.Id}"
        >
          Quick View
        </button>

        <button
          type="button"
          class="add-to-cart-button"
          data-product-id="${product.Id}"
        >
          Add to Cart
        </button>
      </div>
    </li>
  `;
}

export default class ProductList {
  constructor(query, dataSource, listElement, isSearch = false) {
    this.query = query;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
    this.isSearch = isSearch;
  }

  async init() {
    this.products = this.isSearch
      ? await this.dataSource.searchProducts(this.query)
      : await this.dataSource.getData(this.query);

    this.renderList(this.products);
  }

  sortList(criterion) {
    let sortedList = [...this.products];

    if (criterion === "name") {
      sortedList.sort((a, b) =>
        a.NameWithoutBrand.localeCompare(b.NameWithoutBrand),
      );
    } else if (criterion === "price") {
      sortedList.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }

    this.renderList(sortedList);
  }

  addProductToCart(productId) {
    const product = this.products.find(
      (item) => String(item.Id) === String(productId),
    );

    if (!product) return;

    const cartContents = getLocalStorage("so-cart") || [];

    const existingItem = cartContents.find(
      (item) => item.Id === product.Id,
    );

    if (existingItem) {
      existingItem.quantity = Number(existingItem.quantity) || 1;
      existingItem.quantity += 1;
    } else {
      cartContents.push({
        ...product,
        quantity: 1,
      });
    }

    setLocalStorage("so-cart", cartContents);
    updateCartCount();
  }

  renderList(list) {
    this.listElement.innerHTML = "";

    if (list.length === 0) {
      this.listElement.innerHTML =
    `<li class="no-results">No products found.</li>`;
      return;
    }

    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
    );
  }
}
