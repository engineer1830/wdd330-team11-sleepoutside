import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const discountPercent = isDiscounted
    ? Math.round(
        ((product.SuggestedRetailPrice - product.FinalPrice) /
          product.SuggestedRetailPrice) *
          100
      )
    : 0;

  return `
      <li class="product-card">
        <a href="../product_pages/index.html?product=${product.Id}">
          <img src="${product.Images.PrimaryMedium}" alt="${product.NameWithoutBrand}">
          <h3 class="card__brand"> ${product.Brand.Name} </h3>
          <h2 class="card__name"> ${product.NameWithoutBrand} </h2>
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

    // Render the initial unsorted list
    this.renderList(this.products);
  }

  sortList(criterion) {
    let sortedList = [...this.products];

    if (criterion === "name") {
      sortedList.sort((a,b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
    } else if (criterion === "price") {
      sortedList.sort((a,b) => a.FinalPrice - b.FinalPrice);
    }

    // Re-render the list container with the newly sorted items
    this.renderList(sortedList);
  }

  renderList(list) {
    // Clear out current contents to prevent items from duplicating or stacking
    this.listElement.innerHTML = "";

    if (list.length === 0) {
      this.listElement.innerHTML =
        "<li class=\"no-results\">No products found.</li>";
      return;
    }

    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list
    );
  }
}