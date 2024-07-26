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
        "SELECT SUM(totalprice) AS total FROM purchaseitems WHERE invoice = $1",
        [invoice]
      );
      return { total: total.rows[0], datas: datas.rows };
    } catch (e) {
      console.log(e);
    }
  }

  static async inv() {
    try {
      const date = await db.query("SELECT * FROM datebefore");
      const time = await db.query(
        "SELECT TO_CHAR(now(), 'DD Mon YYYY HH24:MI:SS') AS time, TO_CHAR(CURRENT_DATE, 'DD') AS date"
      );
      let invoice = {};

      if (date.rows[0].date == time.rows[0].date) {
        invoice = await db.query(
          "SELECT 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD-') || nextval('no_urut') AS invoice"
        );
      } else {
        await db.query("ALTER SEQUENCE no_urut RESTART WITH 1");
        await db.query(
          "UPDATE datebefore SET date = TO_CHAR(CURRENT_DATE, 'DD')"
        );
        invoice = await db.query(
          "SELECT 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD-') || nextval('no_urut') AS invoice"
        );
      }

      return {
        invoice: invoice.rows[0].invoice,
        time: time.rows[0].time,
      };
    } catch (e) {
      console.log(e);
    }
  }

  static async get(purchaseitemid) {
    try {
      const data = await db.query(
        "SELECT * FROM purchaseitems WHERE purchaseitemid = $1",
        [purchaseitemid]
      );
    
      return data.rows[0];
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
