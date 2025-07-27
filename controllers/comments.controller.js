const { fetchCommentsByArticleId, removeCommentById } = require("../models/comments.model");

const getCommentsByArticleId = (req, res) => {
  const { article_id } = req.params;

  if (isNaN(Number(article_id))) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  return fetchCommentsByArticleId(article_id)
    .then((commentsOrError) => {
      if (commentsOrError === "not found") {
        return res.status(404).send({ msg: "Article Not Found" });
      }
      return res.status(200).send({ comments: commentsOrError });
    })
};

const deleteCommentById = (req, res) => {
  const { comment_id } = req.params;

  if (isNaN(Number(comment_id))) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  return removeCommentById(comment_id)
    .then(() => {
      return res.status(204).send();
    })
};

module.exports = { getCommentsByArticleId, deleteCommentById };