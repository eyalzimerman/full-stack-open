const express = require("express");
const app = express();

let phoneBook = [
  {
    id: 1,
    name: "eyal",
    number: "0501230773",
  },
  {
    id: 2,
    name: "yair",
    number: "0502340773",
  },
  {
    id: 3,
    name: "jino",
    number: "0506780773",
  },
  {
    id: 4,
    name: "gil",
    number: "0508880773",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(phoneBook);
});

app.get("/api/info", (request, response) => {
  response.send(
    `PhoneBook has info for ${phoneBook.length} people <br/>${new Date()}`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
