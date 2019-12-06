const db = require("./conn"),
  crypto = require("crypto"),
  bcrypt = require("bcryptjs");

const hashPassword = password => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, (err, hash) => {
      err ? reject(err) : resolve(hash);
    })
  );
};

const createToken = async userEmail => {
  const newToken = crypto.randomBytes(16).toString("base64");
  console.log("THIS IS THE NEW TOKEN:  ", newToken);
  const response = await db.one(
    `UPDATE users SET browser_token = $1, browser_issue = LOCALTIMESTAMP WHERE email = $2 RETURNING browser_token;`,
    [newToken, userEmail]
  );

  return response;
};

const checkPassword = (enteredPassword, storedPassword) => {
  return new Promise((resolve, reject) =>
    bcrypt.compare(enteredPassword, storedPassword, (err, response) => {
      if (err) {
        reject(err);
      } else if (response) {
        resolve(response);
      } else {
        reject(new Error("Passwords do not match."));
      }
    })
  );
};

async function login(enteredEmail, enteredPassword) {
  try {
    const response = await db.one(`SELECT * FROM users WHERE email = $1;`, [
      enteredEmail
    ]);
    await checkPassword(enteredPassword, response.password);
    const token = await createToken(enteredEmail);
    return token;
  } catch (err) {
    return "email and password do not match records";
  }
}
async function signup(enteredAccount, enteredEmail, enteredPassword) {
  try {
    const hashedPassword = await hashPassword(enteredPassword);
    const response = await db.one(
      `INSERT INTO users (account_name, email, password) 
        VALUES ($1, $2, $3) RETURNING id;`,
      [enteredAccount, enteredEmail, hashedPassword]
    );
    if (!response.id) {
      return "account name taken";
    }
    await db.none(
      `CREATE TABLE wishlist_id${response.id} (
            id serial primary key,
            isbn bigint UNIQUE,
            title varchar(200),
            subject varchar ARRAY,
            cover varchar(70),
            pages integer,
            weight varchar(50),
            author varchar ARRAY,
            publisher varchar ARRAY,
            published varchar(70),
            dateadded DATE NOT NULL DEFAULT (CURRENT_DATE)
        );`
    );
    await db.none(
      `CREATE TABLE librarylist_id${response.id} (
            id serial primary key,
            isbn bigint UNIQUE,
            title varchar(200),
            subject varchar ARRAY,
            cover varchar(70),
            pages integer,
            weight varchar(50),
            author varchar ARRAY,
            publisher varchar ARRAY,
            published varchar(70),
            dateadded DATE NOT NULL DEFAULT (CURRENT_DATE)
          );`
    );
    return "success";
  } catch (err) {
    return err.message;
  }
}
async function tokenCheck(token, account) {
  return new Promise(async (resolve, reject) => {
    const response = await db.any(
      `SELECT * FROM users WHERE browser_token = $1 AND account_name = $2;`,
      [token, account]
    );
    if (!response[0]) {
      reject("Invalid token");
    }
    resolve(response[0]);
  });
}

module.exports = {
  login,
  signup,
  tokenCheck
};
