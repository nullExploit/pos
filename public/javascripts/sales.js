if (path.includes("/sales/edit")) {
  const table = document.getElementById("tableItem");
  const inputBarcode = document.getElementById("inputBarcode");
  const inputGood = document.getElementById("inputGood");
  const inputStock = document.getElementById("inputStock");
  const inputSalePrice = document.getElementById("inputSaleprice");
  const inputQuantity = document.getElementById("inputQuantity");
  const inputTotalPrice = document.getElementById("inputTotalprice");
  const inputTotalSummary = document.getElementById("inputTotalsummary");
  const inputChange = document.getElementById("inputChange");
  const inputPay = document.getElementById("inputPay");
  const submitSaleButton = document.getElementById("submitSale");
  const submitItem = document.getElementById("submitItem");
  const back = document.getElementById("backLink");
  let html = "";

  back.onclick = updateSale;
  submitSaleButton.onclick = updateSale;
  submitItem.onclick = additems;
  inputQuantity.onchange = changeQuantity;
  inputBarcode.onchange = changeBarcode;
  inputPay.onkeyup = changePay;

  drawTable();

  fetch("/goods/itemsapi")
    .then((data) => data.json())
    .then((dataGood) => {
      html = "<option value=''>Select Goods</option>";

      dataGood.forEach((data) => {
        html += `<option value="${data.barcode}">${data.barcode} - ${data.name}</option>`;
      });

      inputBarcode.innerHTML = html;
      html = "";
    });

  async function changeBarcode() {
    const dataGood = await fetch("/goods/itemsapi").then((data) => data.json());
    dataGood.forEach((data) => {
      if (data.barcode == inputBarcode.value) {
        inputGood.value = data.name;
        inputStock.value = data.stock;
        inputSalePrice.value = data.sellingprice;
        inputQuantity.value = 1;
        inputTotalPrice.value = `Rp ${
          Number(data.sellingprice).toLocaleString("in").includes(",")
            ? Number(data.sellingprice).toLocaleString("in")
            : Number(data.sellingprice).toLocaleString("in") + ",00"
        }`;
        inputQuantity.removeAttribute("readonly");
        inputQuantity.setAttribute("max", data.stock);
      }
    });

    if (!inputBarcode.value) {
      inputGood.value = "";
      inputStock.value = "";
      inputSalePrice.value = "";
      inputQuantity.value = "";
      inputTotalPrice.value = "";
      inputQuantity.setAttribute("readonly", "readonly");
    }
  }

  function changeQuantity() {
    const total = Number(inputSalePrice.value) * Number(inputQuantity.value);
    inputTotalPrice.value = `Rp ${
      Number(total).toLocaleString("in").includes(",")
        ? Number(total).toLocaleString("in")
        : Number(total).toLocaleString("in") + ",00"
    }`;
  }

  async function additems() {
    try {
      if (inputBarcode.value) {
        await fetch("/sales/additems", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoice: document.getElementById("inputInvoice").value,
            itemcode: inputBarcode.value,
            quantity: Number(inputQuantity.value),
            sellingprice: Number(inputSalePrice.value),
            totalprice:
              Number(inputQuantity.value) * Number(inputSalePrice.value),
          }),
        });
        drawTable();
        document.getElementById("inputStock").value -= Number(
          inputQuantity.value
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function updateSale() {
    try {
      const dataTable = await fetch(
        `/sales/itemsapi?invoice=${
          document.getElementById("inputInvoice").value
        }`
      ).then((data) => data.json());

      await fetch(
        `/sales/edit/${document.getElementById("inputInvoice").value}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalsum: Number(dataTable.total.total),
            customer: Number(document.getElementById("inputCustomer").value),
            pay: inputPay.value ? Number(inputPay.value) : 0,
            change: Number(
              inputChange.value
                .replace("Rp", "")
                .replace(".", "")
                .replace(",", ".")
            ),
          }),
        }
      );

      window.location.pathname = "/sales";
    } catch (e) {
      console.log(e);
    }
  }

  function changePay() {
    const total = Number(
      inputTotalSummary.value
        .replace("Rp", "")
        .replace(".", "")
        .replace(",", ".")
    );

    if (total) {
      inputChange.value = `Rp ${
        Number(inputPay.value - total > 0 ? inputPay.value - total : 0)
          .toLocaleString("in")
          .includes(",")
          ? Number(
              inputPay.value - total > 0 ? inputPay.value - total : 0
            ).toLocaleString("in")
          : Number(
              inputPay.value - total > 0 ? inputPay.value - total : 0
            ).toLocaleString("in") + ",00"
      }`;
    }
  }

  async function drawTable() {
    try {
      const dataTable = await fetch(
        `/sales/itemsapi?invoice=${
          document.getElementById("inputInvoice").value
        }`
      ).then((data) => data.json());
      html = "";

      inputTotalSummary.value = `Rp ${
        Number(dataTable.total.total).toLocaleString("in").includes(",")
          ? Number(dataTable.total.total).toLocaleString("in")
          : Number(dataTable.total.total).toLocaleString("in") + ",00"
      }`;

      inputChange.value = `Rp ${
        Number(
          inputPay.value - dataTable.total.total > 0
            ? inputPay.value - dataTable.total.total
            : 0
        )
          .toLocaleString("in")
          .includes(",")
          ? Number(
              inputPay.value - dataTable.total.total > 0
                ? inputPay.value - dataTable.total.total
                : 0
            ).toLocaleString("in")
          : Number(
              inputPay.value - dataTable.total.total > 0
                ? inputPay.value - dataTable.total.total
                : 0
            ).toLocaleString("in") + ",00"
      }`;

      dataTable.datas.forEach((data, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${data.itemcode}</td>
                <td>${data.name}</td>
                <td>${data.quantity}</td>
                <td>${`Rp ${
                  Number(data.sellingprice).toLocaleString("in").includes(",")
                    ? Number(data.sellingprice).toLocaleString("in")
                    : Number(data.sellingprice).toLocaleString("in") + ",00"
                }`}</td>
                <td>${`Rp ${
                  Number(data.totalprice).toLocaleString("in").includes(",")
                    ? Number(data.totalprice).toLocaleString("in")
                    : Number(data.totalprice).toLocaleString("in") + ",00"
                }`}</td>
                    <td>
                        <a href="/sales/deleteitems/${
                          document.getElementById("inputInvoice").value
                        }/${Number(
          data.id
        )}" class="btn btn-danger btn-circle"><i class="fas fa-fw fa-trash"></i></a>
                    </td>    
            </tr>
            `;
      });

      if (!dataTable.datas.length) {
        html = `
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>no items</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            `;
      }

      table.innerHTML = html;
    } catch (e) {
      console.log(e);
    }
  }
} else if (path == "/sales") {
  const addSale = document.getElementById("addSales");
  addSale.onclick = generateInv;

  async function generateInv() {
    const data = await fetch("/sales/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: null,
        operator: Number(document.getElementById("salePara").ariaLabel),
      }),
    }).then((data) => data.json());

    window.location.pathname = `/sales/edit/${data.invoice}`;
  }
}
