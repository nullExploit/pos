const db = require("./pg");
const bcrypt = require("bcrypt");

class User {
  constructor(email, name, password, role) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.role = role;
  }

  static async all() {
    try {
      const datas = await db.query("SELECT * FROM users");
      return datas.rows;
    } catch (e) {
      console.log(e);
    }
  }

  static async get(email) {
    try {
      const data = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (data.rows[0]) return data.rows[0];
      return new Error("User Not Found");
    } catch (e) {
      console.log(e);
    }
  }

  static async getId(id) {
    try {
      const data = await db.query("SELECT * FROM users WHERE userid = $1", [
        id,
      ]);
      if (data.rows[0]) return data.rows[0];
      else return new Error("User Not Found");
    } catch (e) {
      console.log(e);
    }
  }

  static async register(email, name, password, role) {
    try {
      const encrypted = await bcrypt.hash(password, 10);
      await db.query(
        "INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4)",
        [email, name, encrypted, role]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async login(email, password) {
    try {
      const user = await User.get(email);
      const match = await bcrypt.compare(password, user.password);

      return match;
    } catch (e) {
      console.log(e);
    }
  }

  static async update(id, email, name, role) {
    try {
      await db.query(
        "UPDATE users SET email = $1, name = $2, role = $3 WHERE userid = $4",
        [email, name, role, id]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async del(id) {
    try {
      await db.query("DELETE FROM users WHERE userid = $1", [id]);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = User;
