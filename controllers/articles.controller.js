const {
  fetchArticles,
  fetchArticleByID,
  insertCommentByArticleId,
  updateArticleVotes,
} = require("../models/articles.model");
const {
  checkArticleExists,
  checkUserExists,
} = require("../models/exist-checks.model");

const getArticles = (req, res) => {
  const {sort_by, order} = req.query
  return fetchArticles(sort_by, order).then((articles) => {
    res.status(200).send({ articles });
  });
};

const getArticleById = (req, res) => {
  const { article_id } = req.params;
  if (isNaN(Number(article_id))) {
    return res.status(400).send({ msg: "Bad Request" });
  }
  return fetchArticleByID(article_id).then((article) => {
    res.status(200).send({ article });
  });
};

const postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!body || !username) {
    return next({ status: 400, msg: "Missing Input" });
  }

  if (isNaN(Number(article_id))) {
    return next({ status: 400, msg: "Invalid article ID" });
  }

  const requestPromises = [
    checkArticleExists(article_id),
    checkUserExists(username),
  ];

  return Promise.all(requestPromises)
    .then(() => {
      return insertCommentByArticleId(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    });
};

const patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (inc_votes === undefined) {
    return next({ status: 400, msg: "Missing inc_votes in request body" });
  }
  if (typeof inc_votes !== "number") {
    return next({ status: 400, msg: "inc_votes must be a number" });
  }

  return updateArticleVotes(article_id, inc_votes).then((updatedArticle) => {
    res.status(200).send({ article: updatedArticle });
  });
};
module.exports = {
  getArticles,
  getArticleById,
  postCommentByArticleId,
  patchArticleVotes,
};
