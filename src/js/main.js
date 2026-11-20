import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import Alert from "./Alert.js";
import { initRegisterPrompt } from "./RegisterModal.mjs";

loadHeaderFooter().then(updateCartCount);
new Alert().init();
initRegisterPrompt();
