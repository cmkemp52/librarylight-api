const db = require("./conn"),
  axios = require("axios"),
  { tokenCheck } = require("../models/user");

libraryadd = async (account, token, isbn) => {
  try {
    const user = await tokenCheck(token, account);
    const id = user.id;
    const bookData = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`
    );

    book = bookData.data[`ISBN:${isbn}`];
    db.none(
      `INSERT INTO librarylist_id${id} (isbn,title,subject,cover,pages,weight,author,publisher,published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        isbn,
        book.title,
        book.subjects ? book.subjects.map(subject => subject.name) : [],
        book.cover.large
          ? book.cover.large
          : book.cover.medium
          ? book.cover.medium
          : book.cover.small
          ? book.cover.small
          : null,
        book.number_of_pages
          ? book.number_of_pages
          : book.pagination
          ? parseInt(book.pagination)
          : null,
        book.weight ? book.weight : null,
        book.authors ? book.authors.map(author => author.name) : [],
        book.publishers ? book.publishers.map(publisher => publisher.name) : [],
        book.publish_date ? book.publish_date : null
      ]
    );
  } catch (err) {
    return err;
  }
};

wishlistadd = async (account, token, isbn) => {
  try {
    const user = await tokenCheck(token, account);
    const id = user.id;
    const bookData = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`
    );

    book = bookData.data[`ISBN:${isbn}`];
    db.none(
      `INSERT INTO wishlist_id${id} (isbn,title,subject,cover,pages,weight,author,publisher,published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        isbn,
        book.title,
        book.subjects ? book.subjects.map(subject => subject.name) : [],
        book.cover.large
          ? book.cover.large
          : book.cover.medium
          ? book.cover.medium
          : book.cover.small
          ? book.cover.small
          : null,
        book.number_of_pages
          ? book.number_of_pages
          : book.pagination
          ? parseInt(book.pagination)
          : null,
        book.weight ? book.weight : null,
        book.authors ? book.authors.map(author => author.name) : [],
        book.publishers ? book.publishers.map(publisher => publisher.name) : [],
        book.publish_date ? book.publish_date : null
      ]
    );
  } catch (err) {
    return err;
  }
};

libraryremove = async (account, token, isbns) => {
  try {
    const user = await tokenCheck(token, account);
    db.none(
      `DELETE FROM librarylist_id${
        user.id
      } WHERE isbn IN (${isbns.toString().substring(1, isbns.length - 1)});`
    );
  } catch (err) {
    return err;
  }
};

wishlistremove = async (account, token, isbns) => {
  try {
    const user = await tokenCheck(token, account);
    db.none(
      `DELETE FROM wishlist_id${
        user.id
      } WHERE isbn IN (${isbns.toString().substring(1, isbns.length - 1)});`
    );
  } catch (err) {
    return err;
  }
};

libraryretreive = async (account, token) => {
  try {
    const user = await tokenCheck(token, account);
    const response = await db.any(`SELECT * FROM librarylist_id${user.id}`);
    return response;
  } catch (err) {
    return err;
  }
};

wishlistretreive = async (account, token) => {
  try {
    const user = await tokenCheck(token, account);
    const response = await db.any(`SELECT * FROM wishlist_id${user.id}`);
    return response;
  } catch (err) {
    return err;
  }
};

module.exports = {
  libraryadd,
  wishlistadd,
  libraryremove,
  wishlistremove,
  libraryretreive
};
