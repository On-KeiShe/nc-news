const db = require("../db/connection");

const fetchCommentsByArticleId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((articleResult) => {
      if (articleResult.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return db.query(
        `SELECT comment_id, votes, created_at, author, body, article_id 
         FROM comments 
         WHERE article_id = $1
         ORDER BY created_at DESC;`,
        [article_id]
      );
    })
    .then((commentResult) => {
      if (!commentResult) return [];
      return commentResult.rows;
    });
};

const removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment Not Found" });
      }
    });
};

module.exports = { fetchCommentsByArticleId, removeCommentById };
