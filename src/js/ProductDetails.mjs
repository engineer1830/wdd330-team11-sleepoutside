import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const imageUrls = import.meta.glob("../images/tents/*", {
    eager: true,
    import: "default",
    query: "?url",
});

export default class ProductDetails {

    constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    this.addButtonText = "";
    this.cartFeedbackTimeout = null;
}

    async init() {
        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // the product details are needed before rendering the HTML
        this.renderProductDetails();
        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
        const addButton = document.getElementById("addToCart");

this.addButtonText = addButton.textContent.trim();

addButton.addEventListener(
    "click",
    this.addProductToCart.bind(this),
);
    }

    addProductToCart() {
    const cartContents = getLocalStorage("so-cart") || [];
    cartContents.push(this.product);
    setLocalStorage("so-cart", cartContents);

    const button = document.getElementById("addToCart");
    const confirmation = document.querySelector("#cart-confirmation");

    clearTimeout(this.cartFeedbackTimeout);

    button.textContent = "In the Cart";
    confirmation.textContent =
        `${this.product.NameWithoutBrand} added to your cart!`;

    confirmation.classList.add("is-visible");

    this.cartFeedbackTimeout = setTimeout(() => {
        button.textContent = this.addButtonText;
        confirmation.classList.remove("is-visible");
    }, 3000);
}

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    let discount = (product.FinalPrice / product.SuggestedRetailPrice * 100).toFixed(2)

    document.querySelector("h2").textContent = product.Brand.Name;
    document.querySelector("h3").textContent = product.NameWithoutBrand;

    const productImage = document.getElementById("productImage");
    productImage.src = imageUrls[product.Image] || product.Image;
    productImage.alt = product.NameWithoutBrand;

    document.getElementById("productPrice").innerHTML = `MSRP $${product.SuggestedRetailPrice.toFixed(2)}`;
    
    document.getElementById("productDiscount").innerHTML = `${discount}% Discount`;

    document.getElementById("productDiscountPrice").innerHTML = `Our Price $${product.FinalPrice.toFixed(2)}`;

    document.getElementById("productColor").textContent =
        product.Colors[0].ColorName;
    document.getElementById("productDesc").innerHTML =
        product.DescriptionHtmlSimple;
    document.getElementById("addToCart").dataset.id = product.Id;
}