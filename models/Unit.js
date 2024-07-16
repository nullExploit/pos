const db = require("./pg");

class Unit {
  constructor(unit, name, note) {
    this.unit = unit
    this.name = name
    this.note = note
  }

  static async all() {
    try {
      const datas = await db.query("SELECT * FROM units");
      return datas.rows;
    } catch (e) {
      console.log(e);
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
