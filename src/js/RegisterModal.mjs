import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const SEEN_KEY = "so-register-prompt-seen";
const USER_KEY = "so-registered-user";
const DRAW_DATE = "December 20, 2026";

function modalTemplate() {
  return `
    <div class="register-modal__content">
      <div class="register-modal__header">
        <div>
          <p class="register-modal__eyebrow">Giveaway for new members</p>
          <h2 id="register-title">Win the Dream Campsite Kit!</h2>
        </div>
        <button
          type="button"
          class="register-modal__close"
          data-close
          aria-label="Close"
        >&times;</button>
      </div>

      <div id="register-offer">
        <p>
          Register with SleepOutside before <strong>${DRAW_DATE}</strong> and
          you are automatically entered to win everything you need for your
          first night under the stars.
        </p>

        <h3>The prize</h3>
        <ul>
          <li>4-person, 3-season tent</li>
          <li>20&deg;F sleeping bag</li>
          <li>60-liter hiking backpack</li>
          <li>Double camping hammock</li>
          <li>$100 SleepOutside store credit</li>
        </ul>

        <h3>How to enter</h3>
        <ol>
          <li>Enter your name and email below.</li>
          <li>One entry per email address.</li>
          <li>The winner is drawn on ${DRAW_DATE}.</li>
        </ol>

        <form id="register-form" class="register-form">
          <label for="register-name">Name</label>
          <input
            id="register-name"
            name="name"
            type="text"
            autocomplete="name"
            minlength="2"
            required
            autofocus
          />
          <label for="register-email">Email</label>
          <input
            id="register-email"
            name="email"
            type="email"
            autocomplete="email"
            required
          />
          <div class="register-actions">
            <button type="submit">Register and enter</button>
            <button type="button" class="register-decline" data-close>
              No thanks
            </button>
          </div>
        </form>

        <p class="register-fineprint">
          This is a class project demo. No real prize will be awarded, and your
          details are saved only in this browser.
        </p>
      </div>

      <div id="register-done" class="register-done" hidden>
        <h3 id="register-done-title" tabindex="-1">You're in!</h3>
        <p>
          Thanks for registering. You are entered in the drawing on ${DRAW_DATE}.
          Good luck!
        </p>
        <button type="button" data-close>Start shopping</button>
      </div>
    </div>
  `;
}

function openRegisterModal() {
  const dialog = document.createElement("dialog");
  dialog.className = "register-modal";
  dialog.setAttribute("aria-labelledby", "register-title");
  dialog.innerHTML = modalTemplate();
  document.body.append(dialog);

  // Mark as seen as soon as it is shown, so it only appears on the first visit.
  setLocalStorage(SEEN_KEY, true);

  const offer = dialog.querySelector("#register-offer");
  const done = dialog.querySelector("#register-done");
  const doneTitle = dialog.querySelector("#register-done-title");
  const form = dialog.querySelector("#register-form");

  dialog.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => dialog.close());
  });

  // Only the backdrop is the dialog itself, because the content has its own wrapper.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => dialog.remove());

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();

    setLocalStorage(USER_KEY, {
      name,
      email,
      registeredOn: new Date().toISOString(),
    });

    doneTitle.textContent = `You're in, ${name.split(" ")[0]}!`;
    offer.hidden = true;
    done.hidden = false;
    doneTitle.focus();
  });

  dialog.showModal();
}

// Shows the register modal once to first-time visitors.
export function initRegisterPrompt() {
  if (getLocalStorage(SEEN_KEY) || getLocalStorage(USER_KEY)) return;
  setTimeout(openRegisterModal, 1000);
}
