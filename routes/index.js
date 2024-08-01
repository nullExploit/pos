var express = require("express");
var router = express.Router();

const { getIndex, postIndex } = require("../controllers/userControllers");
const hasSession = require("../helper/util");
const checkRole = require("../helper/checkrole");
const Sale = require("../models/Sale");
const Purchase = require("../models/Purchase");
const { stringify } = require("csv");

/* GET home page. */
router.get("/", getIndex);

router.get("/dashboard", hasSession, checkRole, async (req, res) => {
  const { startdate, enddate } = req.query;

  const totalPurchases = await Purchase.total(startdate, enddate);
  const salesData = await Sale.total(startdate, enddate);
  const tableReport = await Sale.dashboardApi("", 1, "", "", "date", "asc");

  stringify(
    tableReport.report,
    {
      header: true,
      columns: [
        { key: "month", header: "Month" },
        { key: "expense", header: "Expense" },
        { key: "revenue", header: "Revenue" },
        { key: "earning", header: "Earning" },
      ],
    },
    (err, data) => {
      res.render("dashboard", {
        username: req.session.user.name,
        role: req.session.user.role,
        totaldata: {
          purchase: `Rp ${
            Number(totalPurchases ? totalPurchases : 0)
              .toLocaleString("in")
              .includes(",")
              ? Number(totalPurchases ? totalPurchases : 0).toLocaleString("in")
              : Number(totalPurchases ? totalPurchases : 0).toLocaleString(
                  "in"
                ) + ",00"
          }`,
          sale: `Rp ${
            Number(salesData.total ? salesData.total : 0)
              .toLocaleString("in")
              .includes(",")
              ? Number(salesData.total ? salesData.total : 0).toLocaleString(
                  "in"
                )
              : Number(salesData.total ? salesData.total : 0).toLocaleString(
                  "in"
                ) + ",00"
          }`,
          earning: `Rp ${
            Number(
              salesData.total - totalPurchases > 0
                ? salesData.total - totalPurchases
                : 0
            )
              .toLocaleString("in")
              .includes(",")
              ? Number(
                  salesData.total - totalPurchases > 0
                    ? salesData.total - totalPurchases
                    : 0
                ).toLocaleString("in")
              : Number(
                  salesData.total - totalPurchases > 0
                    ? salesData.total - totalPurchases
                    : 0
                ).toLocaleString("in") + ",00"
          }`,
          totalsales: salesData.totalCount,
          persentage: salesData.totalPersentage,
          totalearning: salesData.totalEarning,
        },
        startdate,
        enddate,
        csv: data,
      });
    }
  );
});

router.get("/dashboard/api", hasSession, checkRole, async (req, res) => {
  const { draw, length, start, search, columns, order } = req.query;

  const data = await Sale.dashboardApi(
    search?.value,
    draw,
    length,
    start,
    columns ? columns[req.query.order[0].column].data : "date",
    order ? order[0].dir : "asc"
  );

  res.json(data);
});

router.get("/logout", hasSession, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.post("/", postIndex);

module.exports = router;
