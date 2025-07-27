const db = require('../db/connection');

const fetchArticles = (sort_by = "created_at", order = "desc") => {
  const validSortColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count"
  ];

  const validOrders = ["asc", "desc"];

  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by column" });
  }

  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order" });
  }

  const queryStr = `
    SELECT 
      articles.author, 
      articles.title, 
      articles.article_id, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order.toUpperCase()};
  `;

  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};

const fetchArticleByID = (article_id) => {
  return db.query (`SELECT author,title, article_id, body, topic, created_at,votes, article_img_url FROM articles WHERE article_id = $1;`, [article_id])
  .then((result)=>{
    if (result.rows.length === 0){
      return Promise.reject({status:404, msg: 'Article Not Found'});
    }
    return result.rows[0]
  });
};

const insertCommentByArticleId = (article_id, username, body) => {
  const queryString =
  `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING comment_id, votes, created_at, author, body, article_id;`

return db.query (queryString, [article_id, username, body]).then((result) => {
  return result.rows[0];
})
}

const updateArticleVotes = (article_id, inc_votes) => {
  return db.query (`UPDATE articles SET votes = votes +$1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
  .then(({rows})=>{
    if (rows.length === 0) {
      return Promise.reject({status:404, msg: 'Article Not Found'});
    }
    return rows[0]
  });
}

module.exports = {fetchArticles, fetchArticleByID, insertCommentByArticleId, updateArticleVotes}
