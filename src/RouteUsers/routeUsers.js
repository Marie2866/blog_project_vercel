const { writeFile, readFile, unlink, readdir } = require("fs/promises");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/projetMP");
const checkUserIdParam = require("../validators/checkUserIdParam");

const getNextId = async (entity) => {
  const id = Number(await readFile(`./db/${entity}/lastId`));
  const nextId = id + 1;

  await writeFile("./db/lastId", String(nextId));

  return nextId;
};

// CREATE users
app.post("/users", (req, res) => {
  const {
    body: { mail, password },
  } = req;

  idAutoIncrements.users += 1;
  const id = idAutoIncrements.users;
  const user = {
    id,
    mail,
    password,
  };

  db.users[id] = user;

  res.send(user);
});

//READ users collection
app.get("/users", (req, res) => {
  res.send(Object.values(db.users));
});

//READ users single
app.get("/users/:userId", (req, res) => {
  const {
    params: { userId },
  } = req;

  const user = db.users[userId];

  if (!user) {
    res.status(404).send({ error: "Not found" });

    return;
  }

  res.send(user);
});

// UPDATE users
app.put("/users/:userID", (req, res) => {
  const {
    params: { userId },
    body: { mail, password },
  } = req;

  const user = db.users[userId];

  if (!user) {
    res.status(404).send({ error: "Not found" });

    return;
  }

  user.mail = mail || user.mail;
  user.password = password || user.password;
});

// DELETE users
app.delete("/users/:userId", (req, res) => {
  const {
    params: { userId },
  } = req;

  const {
    users: { [userId]: user, ...otherUsers },
  } = db;

  if (!user) {
    res.status(404).send({ error: "Not found" });

    return;
  }

  db.users = otherUsers;

  res.send(user);
});

module.exports = routeUsers;
