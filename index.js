require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();
app.use(cors());
app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);

/*----------------API request--------------*/

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((res) => {
      response.json(res);
    })
    .catch((error) => {
      response
        .status(500)
        .send({ error: "Problems with our server", message: error.message });
    });
});

app.get("/api/info", (request, response) => {
  Person.find({})
    .then((res) => {
      response
        .status(200)
        .send(`PhoneBook has info for ${res.length} people <br/>${new Date()}`);
    })
    .catch((error) => {
      response
        .status(500)
        .send({ error: "Problems with our server", message: error.message });
    });
});

app.get("/api/persons/:id", validId, (request, response) => {
  const id = Number(request.params.id);

  Person.find({ id })
    .then((res) => {
      if (res) {
        response.json(res);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      response
        .status(500)
        .send({ error: "Problems with our server", message: error.message });
    });
});

app.delete("/api/persons/:id", validId, (request, response) => {
  const id = Number(request.params.id);

  Person.deleteOne({ id })
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      response
        .status(500)
        .send({ error: "Problems with our server", message: error.message });
    });
});

// function that find the max id and increase by one
function getRandomId(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.post("/api/persons/", isUnique, async (request, response) => {
  const { body } = request;

  if (!body) {
    return response.status(400).json({ error: "content missing" });
  }

  const person = new Person({
    id: getRandomId(1, 10000),
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return response.status(400).json({ error: err.message });
      }
      return response
        .status(500)
        .send({ error: "Problems with our server", message: error.message });
    });
});

app.put("/api/persons/:id", validId, (request, response) => {
  const { body } = request;
  const { id } = request.params;

  const person = {
    id: id,
    number: body.number,
  };
  Person.updateOne({ id }, person, { new: true }).then((updatedPerson) => {
    response.json(updatedPerson);
  });
});

app.use("/", express.static("./build"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "./index.html");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//middleware
function validId(req, res, next) {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  next();
}

async function isUnique(req, res, next) {
  const { body } = req;

  try {
    const isUnique = await Person.find({ name: body.name });
    if (isUnique.length !== 0) {
      return res.status(400).json({ error: "name must be unique" });
    }
    next();
  } catch {
    return res
      .status(500)
      .send({ error: "Problems with our server", message: error.message });
  }
}

module.exports = getRandomId;
