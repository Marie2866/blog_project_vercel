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

const routeUsers = ({ app }) => {
  app.post("/users", async (req, res) => {
    const {
      body: { username, email },
    } = req;

    const id = await getNextId();
    const user = { id, username, email };

    await writeFile(`.db/users/${id}.json`, JSON.stringify(user));

    res.send(user);
  });
  app.get("/users", async (req, res) => {
    const entries = await readdir("./db/users");

    const users = (
      await Promise.all(
        entries
          .filter((entry) => entry.includes(".json"))
          .map((entry) => readFile(`./db/users/${entry}`))
      )
    ).map((data) => JSON.parse(data));

    res.send(users);
  });

  app.get("/users/:userId", async (req, res) => {
    const {
      params: { userId },
    } = req;

    try {
      const data = String(await readFile(`./db/users/${userId}.json`));
      const user = JSON.parse(data);

      res.send(user);
    } catch (err) {
      res.status(404).send({ error: "Not found" });

      return;
    }
  });

  app.put("/users/:userId", async (req, res) => {
    const {
      body: { username, email },
      params: { userId },
    } = req;

    const user = {
      id: Number(userId),
      username,
      email,
    };

    await writeFile(`./db/users/${userId}.json`, JSON.stringify(user));

    res.send(user);
  });

  app.delete("/users/:userId", async (req, res) => {
    const {
      params: { userId },
    } = req;

    unlink(`./db/users/${userId}.json`);

    res.status(204).send();
  });
};

module.exports = routeUsers;
