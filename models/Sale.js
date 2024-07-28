const db = require("./pg");

class Sale {
  constructor(invoice, time, totalsum, pay, change, customer, operator) {
    this.invoice = invoice;
    this.time = time;
    this.totalsum = totalsum;
    this.pay = pay;
    this.change = change;
    this.customer = customer;
    this.operator = operator;
  }

  static async all(
    invoice,
    time,
    totalsum,
    pay,
    change,
    customer,
    page,
    limit,
    offset,
    sortBy,
    sortMode
  ) {
    try {
      const queryParams = [];
      const params = [];
      let sql = "SELECT COUNT(*) AS total FROM sales LEFT JOIN customers ON sales.customer = customers.customerid";

      const realTotal = await db.query(sql);

      if (invoice) {
        queryParams.push(
          `invoice LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(invoice);
      }

      if (time) {
        queryParams.push(
          `TO_CHAR(time, 'DD Mon YYYY HH24:MI:SS') LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(time);
      }

      if (totalsum) {
        queryParams.push(
          `CAST(totalsum AS TEXT) LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(totalsum);
      }

      if (pay) {
        queryParams.push(
          `CAST(pay AS TEXT) LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(pay);
      }

      if (change) {
        queryParams.push(
          `CAST(change AS TEXT) LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(change);
      }

      if (customer) {
        queryParams.push(
          `name LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(customer);
      }

      if (queryParams.length) sql += ` WHERE ${queryParams.join(" OR ")}`;

      const filteredTotal = await db.query(sql, params);

      sql =
        "SELECT sales.invoice, sales.totalsum, TO_CHAR(sales.time, 'DD Mon YYYY HH24:MI:SS') AS timeformatted, sales.pay, sales.change, customers.name AS customername FROM sales LEFT JOIN customers ON sales.customer = customers.customerid";

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
        "SELECT sales.invoice, sales.totalsum, sales.pay, sales.change, TO_CHAR(sales.time, 'DD Mon YYYY HH24:MI:SS') AS time, users.name AS username, users.userid AS userid, customers.customerid AS customerid, customers.name AS customername FROM sales LEFT JOIN users ON sales.operator = users.userid LEFT JOIN customers ON sales.customer = customers.customerid WHERE invoice = $1",
        [invoice]
      );
      return data.rows[0];
    } catch (e) {
      console.log(e);
    }
  }

  static async getLast() {
    try {
      const data = await db.query(
        "SELECT * FROM sales ORDER BY invoice DESC LIMIT 1"
      );
      return data.rows[0].invoice;
    } catch (e) {
      console.log(e);
    }
  }

  static async create(customer, operator) {
    try {
      await db.query("INSERT INTO sales (customer, operator) VALUES ($1, $2)", [
        customer,
        operator,
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  static async update(totalsum, pay, change, customer, id) {
    try {
      await db.query(
        "UPDATE sales SET totalsum = $1, pay = $2, change = $3, customer = $4 WHERE invoice = $5",
        [totalsum, pay, change, customer, id]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async del(invoice) {
    try {
      await db.query("DELETE FROM saleitems WHERE invoice = $1", [invoice])
      await db.query("DELETE FROM sales WHERE invoice = $1", [invoice]);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Sale;
