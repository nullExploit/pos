const db = require("./pg");

class Supplier {
  constructor(name, address, phone) {
    this.name = name;
    this.address = address;
    this.phone = phone;
  }

  static async all(id, name, address, phone, page, limit, offset, sortBy, sortMode) {
    try {
      const queryParams = [];
      const params = [];
      let sql = "SELECT COUNT(*) AS total FROM suppliers";

      const realTotal = await db.query(sql);

      if (id) {
        queryParams.push(`CAST(supplierid AS TEXT) LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(id);
      }

      if (name) {
        queryParams.push(`name LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(name);
      }

      if (address) {
        queryParams.push(`address LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(address);
      }

      if (phone) {
        queryParams.push(`phone LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(phone);
      }

      if (queryParams.length) sql += ` WHERE ${queryParams.join(" OR ")}`;

      const filteredTotal = await db.query(sql, params);

      sql = "SELECT * FROM suppliers";

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
      const datas = await db.query("SELECT * FROM suppliers")
      return datas.rows
    } catch (e) {
      console.log(e) 
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
