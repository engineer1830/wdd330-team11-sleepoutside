export default class Alert {
  constructor(alertsUrl = "/json/alerts.json") {
    this.alertsUrl = alertsUrl;
  }

  async init() {
    const response = await fetch(this.alertsUrl);

    if (!response.ok) {
      throw new Error(
        `Unable to load alerts: ${response.status} ${response.statusText}`,
      );
    }

    const alerts = await response.json();

    if (alerts.length > 0) {
      this.render(alerts);
    }
  }

  render(alerts) {
    const alertList = document.createElement("section");
    alertList.className = "alert-list";

    alerts.forEach(({ message, background, color }) => {
      const alertMessage = document.createElement("p");
      alertMessage.textContent = message;
      alertMessage.style.backgroundColor = background;
      alertMessage.style.color = color;
      alertList.append(alertMessage);
    });

    document.querySelector("main").prepend(alertList);
  }
}
