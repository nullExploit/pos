const db = require("./pg");

class Customer {
  constructor(name, address, phone) {
    this.name = name;
    this.address = address;
    this.phone = phone;
  }

  static async all(
    id,
    name,
    address,
    phone,
    page,
    limit,
    offset,
    sortBy,
    sortMode
  ) {
    try {
      const queryParams = [];
      const params = [];
      let sql = "SELECT COUNT(*) AS total FROM customers";

      const realTotal = await db.query(sql);

      if (id) {
        queryParams.push(
          `CAST(customerid AS TEXT) LIKE '%' || $${
            queryParams.length + 1
          } || '%'`
        );
        params.push(id);
      }

      if (name) {
        queryParams.push(`name LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(name);
      }

      if (address) {
        queryParams.push(
          `address LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(address);
      }

      if (phone) {
        queryParams.push(`phone LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(phone);
      }

      if (queryParams.length) sql += ` WHERE ${queryParams.join(" OR ")}`;

      const filteredTotal = await db.query(sql, params);

      sql = "SELECT * FROM customers";

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
      const datas = await db.query("SELECT * FROM customers");
      return datas.rows;
    } catch (e) {
      console.log(e);
    }
  }

  static async get(customerid) {
    try {
      const data = await db.query(
        "SELECT * FROM customers WHERE customerid = $1",
        [customerid]
      );
      return data.rows[0];
    } catch (e) {
      console.log(e);
    }
  }

  static async create(name, address, phone) {
    try {
      await db.query(
        "INSERT INTO customers (name, address, phone) VALUES ($1, $2, $3)",
        [name, address, phone]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async update(name, address, phone, id) {
    try {
      await db.query(
        "UPDATE customers SET name = $1, address = $2, phone = $3 WHERE customerid = $4",
        [name, address, phone, id]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async del(customerid) {
    try {
      await db.query("DELETE FROM customers WHERE customerid = $1", [
        customerid,
      ]);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Customer;
