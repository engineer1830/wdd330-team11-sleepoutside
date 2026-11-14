import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

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
        const existingItem = cartContents.find(
            (item) => item.Id === this.product.Id,
        );

        if (existingItem) {
            existingItem.quantity = Number(existingItem.quantity) || 1;
            existingItem.quantity += 1;
        } else {
            cartContents.push({
                ...this.product,
                quantity: 1,
            });
        }

        setLocalStorage("so-cart", cartContents);
        updateCartCount();

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
    const discount = (
        ((product.SuggestedRetailPrice - product.FinalPrice) /
            product.SuggestedRetailPrice) *
        100
    ).toFixed(2);

    document.querySelector("h2").textContent = product.Brand.Name;
    document.querySelector("h3").textContent = product.NameWithoutBrand;

    const productImage = document.getElementById("productImage");
    productImage.alt = product.NameWithoutBrand;
    productImage.onload = () => {
        productImage.classList.remove("product-image--loading");
    };
    productImage.onerror = () => {
        productImage.classList.remove("product-image--loading");
        productImage.alt = `${product.NameWithoutBrand} image unavailable`;
    };
    if (product.Images) {
        productImage.srcset = `${product.Images.PrimaryMedium} 160w, ${product.Images.PrimaryLarge} 320w, ${product.Images.PrimaryExtraLarge} 600w`;
        productImage.sizes = "(max-width: 600px) 90vw, 600px";
        productImage.src = product.Images.PrimaryLarge;
    } else {
        productImage.src = product.Image;
    }

    document.getElementById("productPrice").innerHTML = `MSRP $${product.SuggestedRetailPrice.toFixed(2)}`;

    document.getElementById("productDiscount").innerHTML = `${discount}% Discount`;

    document.getElementById("productDiscountPrice").innerHTML = `Our Price $${product.FinalPrice.toFixed(2)}`;

    document.getElementById("productColor").textContent =
        product.Colors[0].ColorName;
    document.getElementById("productDesc").innerHTML =
        product.DescriptionHtmlSimple;
    document.getElementById("addToCart").dataset.id = product.Id;
}