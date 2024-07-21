const db = require("./pg");

class Unit {
  constructor(unit, name, note) {
    this.unit = unit;
    this.name = name;
    this.note = note;
  }

  static async all(unit, name, note, page, limit, offset, sortBy, sortMode) {
    try {
      const queryParams = [];
      const params = [];
      let sql = "SELECT COUNT(*) AS total FROM units";

      const realTotal = await db.query(sql);

      if (unit) {
        queryParams.push(`unit LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(unit);
      }

      if (name) {
        queryParams.push(`name LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(name);
      }

      if (note) {
        queryParams.push(`note LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(note);
      }

      if (queryParams.length) sql += ` WHERE ${queryParams.join(" OR ")}`;

      const filteredTotal = await db.query(sql, params);

      sql = "SELECT * FROM units";

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

  static async getAll() {
    try {
      const datas = await db.query("SELECT * FROM units")
      return datas.rows
    } catch (e) {
      console.log(e)
    }
  }

  static async get(unit) {
    try {
      const data = await db.query("SELECT * FROM units WHERE unit = $1", [
        unit,
      ]);
      if (data.rows[0]) return data.rows[0];
      return new Error("Unit Not Found");
    } catch (e) {
      console.log(e);
    }
  }

  static async create(unit, name, note) {
    try {
      await db.query(
        "INSERT INTO units (unit, name, note) VALUES ($1, $2, $3)",
        [unit, name, note]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async update(newUnit, oldUnit, name, note) {
    try {
      await db.query(
        "UPDATE units SET unit = $1, name = $2, note = $3 WHERE unit = $4",
        [newUnit, name, note, oldUnit]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async del(unit) {
    try {
      await db.query("DELETE FROM units WHERE unit = $1", [unit]);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Unit;
