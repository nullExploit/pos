// Call the dataTables jQuery plugin

const path = window.location.pathname;

switch (path) {
  case "/users":
    $(document).ready(forUsers);
    break;
  case "/goods":
    $(document).ready(forGoods);
    break;
  case "/units":
    $(document).ready(forUnits);
    break;
  case "/suppliers":
    $(document).ready(forSuppliers);
    break;
  case "/purchases":
    $(document).ready(forPurchases);
    break;
  case "/customers":
    $(document).ready(forCustomers);
    break;
  case "/sales":
    $(document).ready(forSales);
    break;
  case "/dashboard":
    $(document).ready(forDashboard);
    break;
}

function forUsers() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
    aoColumnDefs: [{ bSortable: false, aTargets: [-1] }],
    ajax: "/users/api",
    columns: [
      { data: "userid" },
      { data: "email" },
      { data: "name" },
      { data: "role" },
      { data: "userid", render: actions },
    ],
  });
}

function forUnits() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
    aoColumnDefs: [{ bSortable: false, aTargets: [-1] }],
    ajax: "/units/api",
    columns: [
      { data: "unit" },
      { data: "name" },
      { data: "note" },
      { data: "unit", render: actions },
    ],
  });
}

function forGoods() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
    aoColumnDefs: [{ bSortable: false, aTargets: [-1, -2] }],
    ajax: "/goods/api",
    columns: [
      { data: "barcode" },
      { data: "name" },
      { data: "stock" },
      { data: "unit" },
      {
        data: "purchaseprice",
        render: (data) => {
          return `Rp ${
            Number(data).toLocaleString("in").includes(",")
              ? Number(data).toLocaleString("in")
              : Number(data).toLocaleString("in") + ",00"
          }`;
        },
      },
      {
        data: "sellingprice",
        render: (data) => {
          return `Rp ${
            Number(data).toLocaleString("in").includes(",")
              ? Number(data).toLocaleString("in")
              : Number(data).toLocaleString("in") + ",00"
          }`;
        },
      },
      {
        data: "picture",
        render: (data) => {
          return `<img src="/uploads/${data}" width="200" alt="goods-img">`;
        },
      },
      { data: "barcode", render: actions },
    ],
  });
}

function forSuppliers() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
    aoColumnDefs: [{ bSortable: false, aTargets: [-1] }],
    ajax: "/suppliers/api",
    columns: [
      { data: "supplierid" },
      { data: "name" },
      { data: "address" },
      { data: "phone" },
      { data: "supplierid", render: actions },
    ],
  });
}

function forPurchases() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
    aoColumnDefs: [{ bSortable: false, aTargets: [-1] }],
    ajax: "/purchases/api",
    columns: [
      { data: "invoice" },
      { data: "timeformatted" },
      {
        data: "totalsum",
        render: (data) => {
          return `Rp ${
            Number(data).toLocaleString("in").includes(",")
              ? Number(data).toLocaleString("in")
              : Number(data).toLocaleString("in") + ",00"
          }`;
        },
      },
      {
        data: "suppliername",
        render: (data) => {
          return data ? data : "Not Selected";
        },
      },
      { data: "username" },
      { data: "invoice", render: actions },
    ],
  });
}

function forCustomers() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
    aoColumnDefs: [{ bSortable: false, aTargets: [-1] }],
    ajax: "/customers/api",
    columns: [
      { data: "customerid" },
      { data: "name" },
      { data: "address" },
      { data: "phone" },
      { data: "customerid", render: actions },
    ],
  });
}

function forSales() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
    aoColumnDefs: [{ bSortable: false, aTargets: [-1] }],
    ajax: "/sales/api",
    columns: [
      { data: "invoice" },
      { data: "timeformatted" },
      {
        data: "totalsum",
        render: (data) => {
          return `Rp ${
            Number(data).toLocaleString("in").includes(",")
              ? Number(data).toLocaleString("in")
              : Number(data).toLocaleString("in") + ",00"
          }`;
        },
      },
      {
        data: "pay",
        render: (data) => {
          return `Rp ${
            Number(data).toLocaleString("in").includes(",")
              ? Number(data).toLocaleString("in")
              : Number(data).toLocaleString("in") + ",00"
          }`;
        },
      },
      {
        data: "change",
        render: (data) => {
          return `Rp ${
            Number(data).toLocaleString("in").includes(",")
              ? Number(data).toLocaleString("in")
              : Number(data).toLocaleString("in") + ",00"
          }`;
        },
      },
      {
        data: "customername",
        render: (data) => {
          return data ? data : "Not Selected";
        },
      },
      { data: "invoice", render: actions },
    ],
  });
}

function forDashboard() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
    ajax: "/dashboard/api",
    columns: [
      { data: "month" },
      {
        data: "expense",
        render: (data) => {
          return `Rp ${
            Number(data).toLocaleString("in").includes(",")
              ? Number(data).toLocaleString("in")
              : Number(data).toLocaleString("in") + ",00"
          }`;
        },
      },
      {
        data: "revenue",
        render: (data) => {
          return `Rp ${
            Number(data).toLocaleString("in").includes(",")
              ? Number(data).toLocaleString("in")
              : Number(data).toLocaleString("in") + ",00"
          }`;
        },
      },
      {
        data: "earning",
        render: (data) => {
          return `Rp ${
            Number(data).toLocaleString("in").includes(",")
              ? Number(data).toLocaleString("in")
              : Number(data).toLocaleString("in") + ",00"
          }`;
        },
      },
    ],
    footerCallback: function (row, data, start, end, display) {
      const api = this.api();

      const intVal = (i) => {
        return typeof i === "string"
          ? i.replace(/[\$,]/g, "") * 1
          : typeof i === "number"
          ? i
          : 0;
      };

      const totalexpense = api
        .column(1)
        .data()
        .reduce((a, b) => {
          return intVal(a) + intVal(b);
        });

      const totalrevenue = api
        .column(2)
        .data()
        .reduce((a, b) => {
          return intVal(a) + intVal(b);
        });

      const totalearning = api
        .column(3)
        .data()
        .reduce((a, b) => {
          return intVal(a) + intVal(b);
        });

      $(api.column(0).footer()).html("Total");
      $(api.column(1).footer()).html(
        `Rp ${
          Number(totalexpense).toLocaleString("in").includes(",")
            ? Number(totalexpense).toLocaleString("in")
            : Number(totalexpense).toLocaleString("in") + ",00"
        }`
      );
      $(api.column(2).footer()).html(
        `Rp ${
          Number(totalrevenue).toLocaleString("in").includes(",")
            ? Number(totalrevenue).toLocaleString("in")
            : Number(totalrevenue).toLocaleString("in") + ",00"
        }`
      );
      $(api.column(3).footer()).html(
        `Rp ${
          Number(totalearning).toLocaleString("in").includes(",")
            ? Number(totalearning).toLocaleString("in")
            : Number(totalearning).toLocaleString("in") + ",00"
        }`
      );
    },
  });
}

function actions(data) {
  return `
  <a href="${path}/edit/${data}"
    class="btn btn-success btn-circle"><i
        class="fas fa-fw fa-info-circle"></i></a>

<a href="${path}/delete/${data}"
    class="btn btn-danger btn-circle"
    data-toggle="modal"
    data-target="#deleteModal${data}"><i
        class="fas fa-fw fa-trash"></i></a>


  <div class="modal fade" id="deleteModal${data}"
    tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                    Delete Confirmation</h5>
                <button class="close" type="button"
                    data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">
                Are you sure, you want to delete it?
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button"
                    data-dismiss="modal">No</button>
                <a class="btn btn-primary"
                    href="${path}/delete/${data}">Yes</a>
            </div>
        </div>
    </div>
  </div>
  `;
}
