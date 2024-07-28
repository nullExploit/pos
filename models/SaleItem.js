const db = require("./pg");

class Saleitem {
  constructor(invoice, itemcode, quantity, sellingprice, totalprice) {
    this.invoice = invoice;
    this.itemcode = itemcode;
    this.quantity = quantity;
    this.sellingprice = sellingprice;
    this.totalprice = totalprice;
  }

  static async all(invoice) {
    try {
      const datas = await db.query(
        "SELECT saleitems.id, saleitems.invoice, saleitems.itemcode, saleitems.quantity, saleitems.sellingprice, saleitems.totalprice, goods.name AS name FROM saleitems LEFT JOIN goods ON saleitems.itemcode = goods.barcode WHERE invoice = $1",
        [invoice]
      );
      const total = await db.query(
        "SELECT totalsum AS total FROM sales WHERE invoice = $1",
        [invoice]
      );
      return { total: total.rows[0], datas: datas.rows };
    } catch (e) {
      console.log(e);
    }
  }

  static async create(invoice, itemcode, quantity, sellingprice, totalprice) {
    try {
      await db.query(
        "INSERT INTO saleitems (invoice, itemcode, quantity, sellingprice, totalprice) VALUES ($1, $2, $3, $4, $5)",
        [invoice, itemcode, quantity, sellingprice, totalprice]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async del(id) {
    try {
      await db.query("DELETE FROM saleitems WHERE id = $1", [id]);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Saleitem;
