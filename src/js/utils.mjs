import { initTheme } from "./theme.js";

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// NEW: get a parameter value from the URL query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// render a list of items using a template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

//sets the text to reflect the number of items in the cart(Ivan updated)
export function updateCartCount() {
  const cart = getLocalStorage("so-cart") || [];
  const countElement = document.querySelector(".cart-count");
  if (!countElement) return;
  const count = cart.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0,
  );
  countElement.textContent = count > 0 ? count : "";
  countElement.hidden = count === 0;
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  // Apply the saved theme before loading the page header.
  initTheme();

  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement);
    updateCartCount();
    initTheme();
  }

  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}

// show a dismissible message at the top of <main>
// type: "error" (default, red) or "success" (green)
export function alertMessage(message, scroll = true, type = "error") {
  const main = document.querySelector("main");
  if (!main) return null;

  const alert = document.createElement("div");
  alert.classList.add("alert", `alert-${type}`);
  alert.setAttribute("role", type === "error" ? "alert" : "status");

  const text = document.createElement("p");
  text.textContent = message;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("alert-close");
  closeButton.setAttribute("aria-label", "Dismiss message");
  closeButton.textContent = "\u00d7";
  closeButton.addEventListener("click", () => alert.remove());

  alert.append(text, closeButton);
  main.prepend(alert);

  // make sure the user sees it; callers can pass false to skip
  if (scroll) {
    window.scrollTo(0, 0);
  }

  return alert;
}
