//const express = require("express");
const mongodb = require("mongodb");

//const app = express();
//app.use(express.json());
const app = mongodb();
app.use(mongodb());

let mongodbClient;
let db;

function dbConnect() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
    } else {
      mongodb.MongoClient.connect(
        appSettings.mongodb_url,
        function (err, client) {
          if (err) {
            logger.error(
              "Erreur de connexion à l’URL de MongoDB URL: " +
                appSettings.mongodb_url
            );
            reject(err);
          }
          mongodbClient = client;
          db = mongodbClient.db(appSettings.mongodb_db_name);
          // Soyez sûr que la connection est fermée à la sortie de Node
          process.on("exit", (code) => {
            dbClose();
          });
          resolve(db);
        }
      );
    }
  });
}

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

// CREATE posts
app.post("/posts", (req, res) => {
  const {
    body: { title, content, publicationDate },
  } = req;

  idAutoIncrements.posts += 1;
  const id = idAutoIncrements.posts;
  const post = {
    id,
    title,
    content,
    publicationDate,
  };

  db.posts[id] = post;

  res.send(post);
});

//READ posts collection
app.get("/posts", (req, res) => {
  res.send(Object.values(db.posts));
});

//READ posts single
app.get("/posts/:postId", (req, res) => {
  const {
    params: { postId },
  } = req;

  const post = db.posts[postId];

  if (!post) {
    res.status(404).send({ error: "Not found" });

    return;
  }

  res.send(post);
});

// UPDATE posts
app.put("/posts/:postID", (req, res) => {
  const {
    params: { postId },
    body: { title, content, publicationDate },
  } = req;

  const post = db.posts[postId];

  if (!post) {
    res.status(404).send({ error: "Not found" });

    return;
  }

  post.title = title || post.title;
  post.content = content || post.content;
  post.publicationDate = publicationDate || post.publicationDate;
});

// DELETE posts
app.delete("/posts/:postId", (req, res) => {
  const {
    params: { postId },
  } = req;

  const {
    posts: { [postId]: post, ...otherPosts },
  } = db;

  if (!post) {
    res.status(404).send({ error: "Not found" });

    return;
  }

  db.posts = otherPosts;

  res.send(post);
});

// CREATE comments
app.post("/comments", (req, res) => {
  const {
    body: { content, date },
  } = req;

  idAutoIncrements.posts += 1;
  const id = idAutoIncrements.comments;
  const comment = {
    id,
    content,
    date,
  };

  db.comments[id] = comment;

  res.send(comment);
});

//READ comments collection
app.get("/comments", (req, res) => {
  res.send(Object.values(db.comments));
});

//READ comments single
app.get("/comments/:commentId", (req, res) => {
  const {
    params: { commentId },
  } = req;

  const comment = db.comments[commentId];

  if (!comment) {
    res.status(404).send({ error: "Not found" });

    return;
  }

  res.send(comment);
});

// UPDATE comments
app.put("/comments/:commentID", (req, res) => {
  const {
    params: { commentId },
    body: { content, date },
  } = req;

  const comment = db.comments[commentId];

  if (!comment) {
    res.status(404).send({ error: "Not found" });

    return;
  }

  post.content = content || post.content;
  post.date = date || post.date;
});

// DELETE comments
app.delete("/comments/:commentId", (req, res) => {
  const {
    params: { commentId },
  } = req;

  const {
    comments: { [commentId]: comment, ...otherComments },
  } = db;

  if (!comment) {
    res.status(404).send({ error: "Not found" });

    return;
  }

  db.comments = otherComments;

  res.send(comment);
});
// CREATE stats

// condition
if ((user = "reader")) {
  app.post("/comments", (req, res) => {
    const {
      body: { content, date },
    } = req;

    idAutoIncrements.posts += 1;
    const id = idAutoIncrements.comments;
    const comment = {
      id,
      content,
      date,
    };

    db.comments[id] = comment;

    res.send(comment);
  });
}
if ((user = "author")) {
}
if ((user = "admin")) {
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
}

app.listen(3000);
