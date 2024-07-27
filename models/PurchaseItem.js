const db = require("./pg");

class PurchaseItem {
  constructor(invoice, itemcode, quantity, purchaseprice, totalprice) {
    this.invoice = invoice;
    this.itemcode = itemcode;
    this.quantity = quantity;
    this.purchaseprice = purchaseprice;
    this.totalprice = totalprice;
  }

  static async all(invoice) {
    try {
      const datas = await db.query(
        "SELECT purchaseitems.id, purchaseitems.invoice, purchaseitems.itemcode, purchaseitems.quantity, purchaseitems.purchaseprice, purchaseitems.totalprice, goods.name AS name FROM purchaseitems LEFT JOIN goods ON purchaseitems.itemcode = goods.barcode WHERE invoice = $1",
        [invoice]
      );
      const total = await db.query(
        "SELECT totalsum AS total FROM purchases WHERE invoice = $1",
        [invoice]
      );
      return { total: total.rows[0], datas: datas.rows };
    } catch (e) {
      console.log(e);
    }
  }

  static async create(invoice, itemcode, quantity, purchaseprice, totalprice) {
    try {
      await db.query(
        "INSERT INTO purchaseitems (invoice, itemcode, quantity, purchaseprice, totalprice) VALUES ($1, $2, $3, $4, $5)",
        [invoice, itemcode, quantity, purchaseprice, totalprice]
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async del(id) {
    try {
      await db.query("DELETE FROM purchaseitems WHERE id = $1", [
        id,
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  static async delAll(invoice) {
    try {
      await db.query("DELETE FROM purchaseitems WHERE invoice = $1", [invoice]);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = PurchaseItem;
