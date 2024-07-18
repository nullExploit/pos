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

  static async all() {
    try {
      const datas = await db.query("SELECT * FROM goods");
      return datas.rows;
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
