const db = require("./pg");

class Purchase {
  constructor(invoice, time, totalsum, supplier, operator) {
    this.invoice = invoice;
    this.time = time;
    this.totalsum = totalsum;
    this.supplier = supplier;
    this.operator = operator;
  }

  static async all(
    invoice,
    time,
    totalsum,
    supplier,
    operator,
    page,
    limit,
    offset,
    sortBy,
    sortMode
  ) {
    try {
      const queryParams = [];
      const params = [];
      let sql = "SELECT COUNT(*) AS total FROM purchases";

      const realTotal = await db.query(sql);

      if (invoice) {
        queryParams.push(
          `invoice LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(invoice);
      }

      if (time) {
        queryParams.push(
          `CAST(time AS TEXT) LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(time);
      }

      if (totalsum) {
        queryParams.push(
          `CAST(totalsum AS TEXT) LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(totalsum);
      }

      if (supplier) {
        queryParams.push(
          `CAST(supplier AS TEXT) LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(supplier);
      }

      if (operator) {
        queryParams.push(
          `CAST(operator AS TEXT) LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(operator);
      }

      if (queryParams.length) sql += ` WHERE ${queryParams.join(" OR ")}`;

      const filteredTotal = await db.query(sql, params);

      sql =
        "SELECT purchases.invoice, purchases.totalsum, TO_CHAR(purchases.time, 'DD Mon YYYY HH24:MI:SS') AS timeformatted, users.name AS username, suppliers.name AS suppliername FROM purchases LEFT JOIN users ON purchases.operator = users.userid LEFT JOIN suppliers ON purchases.supplier = suppliers.supplierid";

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

  static async get(invoice) {
    try {
      const data = await db.query(
        "SELECT purchases.invoice, purchases.totalsum, TO_CHAR(purchases.time, 'DD Mon YYYY HH24:MI:SS') AS time, users.name AS username, users.userid AS userid, suppliers.supplierid AS supplierid,suppliers.name AS suppliername FROM purchases LEFT JOIN users ON purchases.operator = users.userid LEFT JOIN suppliers ON purchases.supplier = suppliers.supplierid WHERE invoice = $1",
        [invoice]
      );
      return data.rows[0];
    } catch (e) {
      console.log(e);
    }
  }

  static async create(invoice, time, totalsum, supplier, operator) {
    try {
      await db.query("INSERT INTO purchases VALUES ($1, $2, $3, $4, $5)", [
        invoice,
        time,
        totalsum,
        supplier,
        operator,
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  static async update(totalsum, supplier, id) {
    try {
      await db.query(
        "UPDATE purchases SET totalsum = $1, supplier = $2 WHERE invoice = $3",
        [totalsum, supplier, id]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async del(invoice) {
    try {
      await db.query("DELETE FROM purchases WHERE invoice = $1", [invoice]);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Purchase;
