require("dotenv").config();
const mongoose = require("mongoose");
const randomId = require("./index.js");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.cwxxr.mongodb.net/PhoneBook?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  id: randomId(0, 100000),
  name: process.argv[3],
  number: process.argv[4],
});

if (!process.argv[3] && !process.argv[4]) {
  Person.find({}).then((result) => {
    console.log("PhoneBook:\n");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
    process.exit(1);
  });
} else {
  person.save().then((result) => {
    console.log(`Added ${result} to PhoneBook`);
    mongoose.connection.close();
  });
}
