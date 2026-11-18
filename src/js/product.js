import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { getParam, updateCartCount } from "./utils.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ExternalServices();
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();

loadHeaderFooter().then(updateCartCount);
