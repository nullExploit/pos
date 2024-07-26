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
}

function forUsers() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
    ajax: "/users/api",
    columns: [
      { data: "userid" },
      { data: "email" },
      { data: "name" },
      { data: "role" },
      { data: "userid", render: actions },
    ],
  });

  $("#foot").html(`
    <tr>
        <th>User ID</th>
        <th>Email</th>
        <th>Name</th>
        <th>Role</th>
        <th>Action</th>
    </tr>
    `);
}

function forUnits() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
    ajax: "/units/api",
    columns: [
      { data: "unit" },
      { data: "name" },
      { data: "note" },
      { data: "unit", render: actions },
    ],
  });

  $("#foot").html(`
     <tr>
        <th>Unit</th>
        <th>Name</th>
        <th>Note</th>
        <th>Action</th>
    </tr>
    `);
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

  $("#foot").html(`
    <tr>
        <th>Barcode</th>
        <th>Name</th>
        <th>Stock</th>
        <th>Unit</th>
        <th>Purchase Price</th>
        <th>Selling Price</th>
        <th>Picture</th>
        <th>Action</th>
    </tr>
    `);
}

function forSuppliers() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
    ajax: "/suppliers/api",
    columns: [
      { data: "supplierid" },
      { data: "name" },
      { data: "address" },
      { data: "phone" },
      { data: "supplierid", render: actions },
    ],
  });

  $("#foot").html(`
     <tr>
        <th>Supplier ID</th>
        <th>Name</th>
        <th>Address</th>
        <th>Phone</th>
        <th>Action</th>
    </tr>
    `);
}

function forPurchases() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
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
      { data: "suppliername" },
      { data: "username" },
      { data: "invoice", render: actions },
    ],
  });

  $("#foot").html(`
     <tr>
        <th>Invoice</th>
        <th>Time</th>
        <th>Total Summary</th>
        <th>Supplier</th>
        <th>Operator</th>
        <th>Action</th>
    </tr>
    `);
}

function forCustomers() {
  $("#dataTable").DataTable({
    processing: true,
    serverSide: true,
    ajax: "/customers/api",
    columns: [
      { data: "customerid" },
      { data: "name" },
      { data: "address" },
      { data: "phone" },
      { data: "customerid", render: actions },
    ],
  });

  $("#foot").html(`
     <tr>
        <th>Customer ID</th>
        <th>Name</th>
        <th>Address</th>
        <th>Phone</th>
        <th>Action</th>
    </tr>
    `);
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
