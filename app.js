const express = require("express");
const app = express();

const getTopics = require("./controllers/topics.controller");
const {getArticles, getArticleById, postCommentByArticleId, patchArticleVotes} = require("./controllers/articles.controller");
const getUsers = require("./controllers/users.controller");
const {getCommentsByArticleId, deleteCommentById} = require("./controllers/comments.controller");


app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post ("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleVotes)

app.delete ("/api/comments/:comment_id", deleteCommentById);


app.use((req, res) => {
  res.status(404).send({ msg: "Path Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err)
  }
});

app.use ((err, req, res, next)=>{
  if(err.status && err.msg){
    res.status(err.status).send({msg: err.msg})
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
