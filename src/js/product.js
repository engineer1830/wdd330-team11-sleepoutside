import { loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import { getParam, updateCartCount } from "./utils.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData();
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();

loadHeaderFooter();

updateCartCount();
