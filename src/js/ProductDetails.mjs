import { setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    setLocalStorage("so-cart", this.product);
  }

  renderProductDetails() {
    document.getElementById("productBrand").textContent = this.product.Brand.Name;
    document.getElementById("productName").textContent = this.product.NameWithoutBrand;

    const img = document.getElementById("productImage");
    img.src = this.product.Image;
    img.alt = this.product.NameWithoutBrand;

    document.getElementById("productPrice").textContent = this.product.FinalPrice;
    document.getElementById("productColor").textContent =
      this.product.Colors[0].ColorName;
    document.getElementById("productDescription").innerHTML =
      this.product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = this.product.Id;
  }
}