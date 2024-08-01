const db = require("./pg");
const bcrypt = require("bcrypt");

class User {
  constructor(email, name, password, role) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.role = role;
  }

  static async all(
    id,
    email,
    name,
    role,
    page,
    limit,
    offset,
    sortBy,
    sortMode
  ) {
    try {
      const queryParams = [];
      const params = [];
      let sql = "SELECT COUNT(*) AS total FROM users";

      const realTotal = await db.query(sql);

      if (id) {
        queryParams.push(
          `CAST(userid AS TEXT) LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(id);
      }

      if (email) {
        queryParams.push(`email LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(email);
      }

      if (name) {
        queryParams.push(`name LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(name);
      }

      if (role) {
        queryParams.push(`role LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(role);
      }

      if (queryParams.length) sql += ` WHERE ${queryParams.join(" OR ")}`;

      const filteredTotal = await db.query(sql, params);

      sql = "SELECT userid, email, name, role FROM users";

      if (queryParams.length) sql += ` WHERE ${queryParams.join(" OR ")}`;

      sql += ` ORDER BY ${sortBy} ${sortMode}`;

      if (limit) {
        sql += ` limit $${queryParams.length + 1} offset $${
          queryParams.length + 2
        }`;
        params.push(limit, offset);
      }

      const datas = await db.query(sql, params);
      return {
        draw: Number(page),
        recordsTotal: Number(realTotal.rows[0].total),
        recordsFiltered: Number(filteredTotal.rows[0].total),
        data: datas.rows,
      };
    } catch (e) {
      console.log(e);
    }
  }

  static async get(email) {
    try {
      const data = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      return data.rows[0];
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

  static async changepass(id, oldpass, newpass) {
    try {
      const user = await User.getId(id);
      const match = await bcrypt.compare(oldpass, user.password);

      if (match) {
        const encrypted = await bcrypt.hash(newpass, 10);
        await User.update(
          user.userid,
          user.email,
          user.name,
          user.role,
          encrypted
        );
      }

      return match;
    } catch (e) {
      console.log(e);
    }
  }

  static async update(id, email, name, role, password) {
    try {
      if (password) {
        await db.query(
          "UPDATE users SET email = $1, name = $2, role = $3, password = $4 WHERE userid = $5",
          [email, name, role, password, id]
        );
      } else if (role) {
        await db.query(
          "UPDATE users SET email = $1, name = $2, role = $3 WHERE userid = $4",
          [email, name, role, id]
        );
      } else if (!role) {
        await db.query(
          "UPDATE users SET email = $1, name = $2 WHERE userid = $3",
          [email, name, id]
        );
      }
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
