const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public")); // Put your HTML and script.js in a 'public' folder

app.post("/subscribe", (req, res) => {
  const newEntry = req.body;
  const filePath = "./newsletter.json";

  // Read existing file, or start with an empty array if it doesn't exist
  let subscribers = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf8");
    subscribers = fileData ? JSON.parse(fileData) : [];
  }

  // Add new subscriber and save back to newsletter.json
  subscribers.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));

  res.status(200).json({ message: "Saved successfully" });
});

