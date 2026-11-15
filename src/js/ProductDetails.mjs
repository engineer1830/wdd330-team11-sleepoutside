import {
    getLocalStorage,
    setLocalStorage,
    updateCartCount,
    alertMessage,
} from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
        this.addButtonText = "";
        this.cartFeedbackTimeout = null;
        this.cartAlert = null;
    }

    async init() {
        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // the product details are needed before rendering the HTML
        this.renderProductDetails();
        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) ismissing. Review the readings from this week on 'this' to understand why.
        
        const breadcrumb =
            document.querySelector("#breadcrumb");

        if (breadcrumb) {
            breadcrumb.innerHTML =
                `<a href="/index.html">Home</a> &rarr; ${this.product.NameWithoutBrand}`;
        }
        
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

        clearTimeout(this.cartFeedbackTimeout);

        // replace the previous alert instead of stacking them
        if (this.cartAlert) {
            this.cartAlert.remove();
        }

        button.textContent = "In the Cart";
        this.cartAlert = alertMessage(
            `${this.product.NameWithoutBrand} added to your cart!`,
            true,
            "success",
        );

        this.cartFeedbackTimeout = setTimeout(() => {
            button.textContent = this.addButtonText;

            if (this.cartAlert) {
                this.cartAlert.remove();
            }
        }, 3000);
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
   
    const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice; 

    const discount = Math.round(
        ((product.SuggestedRetailPrice - product.FinalPrice) /
            product.SuggestedRetailPrice) *
        100
    );

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

    document.getElementById("productDiscount").innerHTML =  isDiscounted
        ? `<span class="discount-badge">${discount}% OFF</span>`
        : "";

    document.getElementById("productDiscountPrice").innerHTML = `Our Price $${product.FinalPrice.toFixed(2)}`;
    document.getElementById("productColor").textContent =
        product.Colors[0].ColorName;
    document.getElementById("productDesc").innerHTML =
        product.DescriptionHtmlSimple;
    document.getElementById("addToCart").dataset.id = product.Id;
}
