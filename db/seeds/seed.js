const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })

    .then(() => {
      return db.query(
        `CREATE TABLE topics(slug VARCHAR PRIMARY KEY, description VARCHAR, img_url VARCHAR (1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE users(username VARCHAR PRIMARY KEY, name VARCHAR, avatar_url VARCHAR (1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE articles(article_id SERIAL PRIMARY KEY, title VARCHAR, topic VARCHAR REFERENCES topics(slug), author VARCHAR REFERENCES users(username), body TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0, article_img_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id), body TEXT NOT NULL, votes INT DEFAULT 0, author VARCHAR REFERENCES users(username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
      );
    })
    .then(() => {
      const topicInsertQuery = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`,
        topicData.map(({ slug, description, img_url }) => [
          slug,
          description,
          img_url,
        ])
      );
      return db.query(topicInsertQuery);
    })
    .then(() => {
      const userInsertQuery = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
        userData.map(({ username, name, avatar_url }) => [
          username,
          name,
          avatar_url,
        ])
      );
      return db.query(userInsertQuery);
    })
    .then(() => {
      const formattedArticles = articleData.map(convertTimestampToDate);

      const articleInsertQuery = format(
        `INSERT INTO articles 
    (title, topic, author, body, created_at, votes, article_img_url) 
    VALUES %L RETURNING *;`,
        formattedArticles.map(
          ({
            title,
            topic,
            author,
            body,
            created_at,
            votes,
            article_img_url,
          }) => [title, topic, author, body, created_at, votes, article_img_url]
        )
      );
      return db.query(articleInsertQuery);
    })
    .then(({ rows: insertedArticles }) => {
      const articleIdLookup = {};
      insertedArticles.forEach((article) => {
        articleIdLookup[article.title] = article.article_id;
      });

      const formattedComments = commentData.map(convertTimestampToDate);

      const commentInsertQuery = format(
        `INSERT INTO comments (body, votes, author, article_id, created_at) VALUES %L;`,
        formattedComments.map(
          ({ body, votes, author, created_at, article }) => [
            body,
            votes,
            author,
            articleIdLookup[article],
            created_at,
          ]
        )
      );
      return db.query(commentInsertQuery);
    });
};
module.exports = seed;
