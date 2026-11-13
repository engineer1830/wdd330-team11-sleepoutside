import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import Alert from "./Alert.js";

loadHeaderFooter().then(updateCartCount);
new Alert().init();
