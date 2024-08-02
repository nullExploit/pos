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
      let sql =
        "SELECT COUNT(*) AS total FROM sales LEFT JOIN customers ON sales.customer = customers.customerid";

      const realTotal = await db.query(sql);

      if (invoice) {
        queryParams.push(
          `invoice LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(invoice);
      }

      if (time) {
        queryParams.push(
          `TO_CHAR(time, 'DD Mon YYYY HH24:MI:SS') LIKE '%' || $${
            queryParams.length + 1
          } || '%'`
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
        queryParams.push(`name LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(customer);
      }

      if (queryParams.length) sql += ` WHERE ${queryParams.join(" OR ")}`;

      const filteredTotal = await db.query(sql, params);

      sql =
        "SELECT sales.invoice, sales.totalsum, TO_CHAR(sales.time, 'DD Mon YYYY HH24:MI:SS') AS timeformatted, sales.pay, sales.change, sales.operator, customers.name AS customername FROM sales LEFT JOIN customers ON sales.customer = customers.customerid";

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
      await db.query("DELETE FROM sales WHERE invoice = $1", [invoice]);
    } catch (e) {
      console.log(e);
    }
  }

  static async total(startdate, enddate) {
    try {
      const queryParams = [];
      const params = [];
      const monthsData = [];
      const tableReport = [];
      let monthsLabel = [];

      let sql = "SELECT COUNT(*) AS totalcount FROM sales";

      if (startdate) {
        queryParams.push(`time > $${queryParams.length + 1}`);
        params.push(startdate);
      }

      if (enddate) {
        queryParams.push(`time < $${queryParams.length + 1}`);
        params.push(enddate);
      }

      if (queryParams.length) sql += ` WHERE ${queryParams.join(" AND ")}`;

      const count = await db.query(sql, params);

      sql = "SELECT SUM(totalsum) AS total FROM sales";

      if (queryParams.length) sql += ` WHERE ${queryParams.join(" AND ")}`;

      const data = await db.query(sql, params);

      sql = "SELECT COUNT(*) AS totaldirect FROM sales WHERE customer = 3";

      if (queryParams.length) sql += ` AND ${queryParams.join(" AND ")}`;

      const totaldirect = await db.query(sql, params);

      sql = "SELECT COUNT(*) AS totalcustomer FROM sales WHERE customer != 3";

      if (queryParams.length) sql += ` AND ${queryParams.join(" AND ")}`;

      const totalcustomer = await db.query(sql, params);

      const purchaseMonths = await db.query(
        `SELECT TO_CHAR(time, 'Mon YY') AS purchasemonth FROM purchases ${
          queryParams.length ? `WHERE ${queryParams.join(" AND ")}` : ``
        }`,
        params
      );

      const saleMonths = await db.query(
        `SELECT TO_CHAR(time, 'Mon YY') AS salemonth FROM sales ${
          queryParams.length ? `WHERE ${queryParams.join(" AND ")}` : ``
        }`,
        params
      );

      purchaseMonths.rows.forEach((row) => {
        monthsLabel.push(row.purchasemonth);
      });

      saleMonths.rows.forEach((row) => {
        monthsLabel.push(row.salemonth);
      });

      monthsLabel = [...new Set(monthsLabel)];

      monthsLabel.sort((x, y) => {
        let a = new Date(x),
          b = new Date(y);
        return a - b;
      });

      for (const month of monthsLabel) {
        const data = await db.query("SELECT * FROM totalearning($1)", [month]);
        monthsData.push(data.rows[0].res);
      }

      return {
        total: data.rows[0].total,
        totalCount: count.rows[0].totalcount,
        totalPersentage: [
          Math.round(
            (totaldirect.rows[0].totaldirect / count.rows[0].totalcount) * 100
          ),
          Math.round(
            (totalcustomer.rows[0].totalcustomer / count.rows[0].totalcount) *
              100
          ),
        ],
        totalEarning: {
          months: monthsLabel,
          monthsData,
        },
      };
    } catch (e) {
      console.log(e);
    }
  }

  static async dashboardApi(month, page, limit, offset, sortBy, sortMode) {
    const queryParams = [];
    const params = [];
    let sql = "SELECT COUNT(*) AS total FROM earning()";

    const realTotal = await db.query(sql);

    if (month) {
      queryParams.push(
        `month LIKE '%' || $${queryParams.length + 1} || '%'`,
        `CAST(expense AS TEXT) LIKE '%' || $${queryParams.length + 2} || '%'`,
        `CAST(revenue AS TEXT) LIKE '%' || $${queryParams.length + 3} || '%'`,
        `CAST(earning AS TEXT) LIKE '%' || $${queryParams.length + 4} || '%'`
      );

      params.push(month, month, month, month);
    }

    if (queryParams.length) sql += ` WHERE ${queryParams.join(" OR ")}`;

    const filteredTotal = await db.query(sql, params);

    sql = "SELECT * FROM earning()";

    if (queryParams.length) sql += ` WHERE ${queryParams.join(" OR ")}`;

    sql += ` ORDER BY ${sortBy == "month" ? "date" : sortBy} ${sortMode}`;

    if (limit) {
      sql += ` LIMIT $${queryParams.length + 1} OFFSET $${
        queryParams.length + 2
      }`;

      params.push(limit, offset);
    }

    const data = await db.query(sql, params);

    sql =
      "SELECT COALESCE(SUM(expense), 0) AS totalexpense, COALESCE(SUM(revenue), 0) AS totalrevenue, COALESCE(SUM(earning), 0) AS totalearning FROM earning()";

    if (queryParams.length) sql += ` WHERE ${queryParams.join(" OR ")}`;

    if (limit) {
      sql += ` LIMIT $${queryParams.length + 1} OFFSET $${
        queryParams.length + 2
      }`;
    }

    const total = await db.query(sql, params);
    const report = await db.query("SELECT month, expense, revenue, earning FROM earning()")

    return {
      report: report.rows,
      totaldata: total.rows[0],
      draw: Number(page),
      recordsTotal: Number(realTotal.rows[0].total),
      recordsFiltered: Number(filteredTotal.rows[0].total),
      data: data.rows,
    };
  }
}

module.exports = Sale;
