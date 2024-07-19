const db = require("./pg");

class Supplier {
  constructor(name, address, phone) {
    this.name = name;
    this.address = address;
    this.phone = phone;
  }

  static async all() {
    try {
      const datas = await db.query("SELECT * FROM suppliers");
      return datas.rows;
    } catch (e) {
      console.log(e);
    }
  }

  static async get(supplierid) {
    try {
      const data = await db.query(
        "SELECT * FROM suppliers WHERE supplierid = $1",
        [supplierid]
      );
      if (data.rows[0]) return data.rows[0];
      return new Error("Supplier Not Found");
    } catch (e) {
      console.log(e);
    }
  }

  static async create(name, address, phone) {
    try {
      await db.query(
        "INSERT INTO suppliers (name, address, phone) VALUES ($1, $2, $3)",
        [name, address, phone]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async update(name, address, phone, supplierid) {
    try {
      await db.query(
        "UPDATE suppliers SET name = $1, address = $2, phone = $3 WHERE supplierid = $4",
        [name, address, phone, supplierid]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async del(supplierid) {
    try {
      await db.query("DELETE FROM suppliers WHERE supplierid = $1", [
        supplierid,
      ]);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Supplier;
