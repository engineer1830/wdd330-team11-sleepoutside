import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

// Send the shopper back to the home page after 5 seconds.
setTimeout(() => {
  window.location.href = "/index.html";
}, 5000);
