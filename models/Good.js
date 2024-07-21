const db = require("./pg");

class Good {
  constructor(
    barcode,
    name,
    stock,
    purchaseprice,
    sellingprice,
    unit,
    picture
  ) {
    this.barcode = barcode;
    this.name = name;
    this.stock = stock;
    this.purchaseprice = purchaseprice;
    this.sellingprice = sellingprice;
    this.unit = unit;
    this.picture = picture;
  }

  static async all(
    barcode,
    name,
    stock,
    purchaseprice,
    sellingprice,
    unit,
    page,
    limit,
    offset,
    sortBy,
    sortMode
  ) {
    try {
      const queryParams = [];
      const params = [];
      let sql = "SELECT COUNT(*) AS total FROM goods";

      const realTotal = await db.query(sql);

      if (barcode) {
        queryParams.push(
          `barcode LIKE '%' || $${queryParams.length + 1} || '%'`
        );
        params.push(barcode);
      }

      if (name) {
        queryParams.push(`name LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(name);
      }

      if (stock) {
        queryParams.push(`CAST(stock AS TEXT) LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(stock);
      }

      if (purchaseprice) {
        queryParams.push(`CAST(purchaseprice AS TEXT) LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(purchaseprice);
      }

      if (sellingprice) {
        queryParams.push(`CAST(sellingprice AS TEXT) LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(stock);
      }

      if (unit) {
        queryParams.push(`unit LIKE '%' || $${queryParams.length + 1} || '%'`);
        params.push(unit);
      }

      if (queryParams.length) sql += ` WHERE ${queryParams.join(" OR ")}`;

      const filteredTotal = await db.query(sql, params);

      sql = "SELECT * FROM goods";

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

  static async get(barcode) {
    try {
      const data = await db.query("SELECT * FROM goods WHERE barcode = $1", [
        barcode,
      ]);
      if (data.rows[0]) return data.rows[0];
      return new Error("Good Not Found");
    } catch (e) {
      console.log(e);
    }
  }

  static async create(
    barcode,
    name,
    stock,
    purchaseprice,
    sellingprice,
    unit,
    picture
  ) {
    try {
      await db.query(
        "INSERT INTO goods (barcode, name, stock, purchaseprice, sellingprice, unit, picture) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [barcode, name, stock, purchaseprice, sellingprice, unit, picture]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async update(
    newBarcode,
    oldBarcode,
    name,
    stock,
    purchaseprice,
    sellingprice,
    unit,
    picture
  ) {
    try {
      if (picture) {
        await db.query(
          "UPDATE goods SET barcode = $1, name = $2, stock = $3, purchaseprice = $4, sellingprice = $5, unit = $6, picture = $7 WHERE barcode = $8",
          [
            newBarcode,
            name,
            stock,
            purchaseprice,
            sellingprice,
            unit,
            picture,
            oldBarcode,
          ]
        );
      } else {
        await db.query(
          "UPDATE goods SET barcode = $1, name = $2, stock = $3, purchaseprice = $4, sellingprice = $5, unit = $6 WHERE barcode = $7",
          [
            newBarcode,
            name,
            stock,
            purchaseprice,
            sellingprice,
            unit,
            oldBarcode,
          ]
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  static async del(barcode) {
    try {
      await db.query("DELETE FROM goods WHERE barcode = $1", [barcode]);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Good;
