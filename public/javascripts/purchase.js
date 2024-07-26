if (path == "/purchases/add" || path.includes("/purchases/edit")) {
  const table = document.getElementById("tableItem");
  const inputBarcode = document.getElementById("inputBarcode");
  const inputGood = document.getElementById("inputGood");
  const inputStock = document.getElementById("inputStock");
  const inputPurchasePrice = document.getElementById("inputPurchaseprice");
  const inputQuantity = document.getElementById("inputQuantity");
  const inputTotalPrice = document.getElementById("inputTotalprice");
  const inputTotalSummary = document.getElementById("inputTotalsummary");
  const submitPurchaseButton = document.getElementById("submitPurchase");
  const submitItem = document.getElementById("submitItem");
  let html = "";

  submitPurchaseButton.onclick = submitPurchase;
  submitItem.onclick = additems;
  inputQuantity.onchange = changeQuantity;
  inputBarcode.onchange = changeBarcode;

  if (path.includes("/purchases/edit")) {
    const back = document.getElementById("backLink")

    back.onclick = updateItems
    submitPurchaseButton.onclick = updateItems
  }

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
        inputPurchasePrice.value = data.purchaseprice;
        inputQuantity.value = 1;
        inputTotalPrice.value = `Rp ${
          Number(data.purchaseprice).toLocaleString("in").includes(",")
            ? Number(data.purchaseprice).toLocaleString("in")
            : Number(data.purchaseprice).toLocaleString("in") + ",00"
        }`;
        inputQuantity.removeAttribute("readonly");
        inputQuantity.setAttribute("max", data.stock);
      }
    });

    if (!inputBarcode.value) {
      inputGood.value = "";
      inputStock.value = "";
      inputPurchasePrice.value = "";
      inputQuantity.value = "";
      inputTotalPrice.value = "";
      inputQuantity.setAttribute("readonly", "readonly");
    }
  }

  async function submitPurchase() {
    const dataTable = await fetch(
      `/purchases/itemsapi?invoice=${
        document.getElementById("inputInvoice").value
      }`
    ).then((data) => data.json());

    if (dataTable.total.total) {
      await fetch("/purchases/add", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoice: document.getElementById("inputInvoice").value,
          time: document.getElementById("inputTime").value,
          totalsum: Number(dataTable.total.total),
          supplier: Number(document.getElementById("inputSupplier").value),
          operator: Number(document.getElementById("inputOperator").title),
        }),
      });

      window.location.pathname = "/purchases";
    }
  }

  async function changeQuantity() {
    const total =
      Number(inputPurchasePrice.value) * Number(inputQuantity.value);
    inputTotalPrice.value = `Rp ${
      Number(total).toLocaleString("in").includes(",")
        ? Number(total).toLocaleString("in")
        : Number(total).toLocaleString("in") + ",00"
    }`;
  }

  async function additems() {
    if (inputBarcode.value) {
      await fetch("/purchases/additems", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoice: document.getElementById("inputInvoice").value,
          itemcode: inputBarcode.value,
          quantity: Number(inputQuantity.value),
          purchaseprice: Number(inputPurchasePrice.value),
          totalprice:
            Number(inputQuantity.value) * Number(inputPurchasePrice.value),
        }),
      });
      drawTable();
      document.getElementById("inputStock").value -= Number(
        inputQuantity.value
      );
    }
  }

  async function updateItems() {
    try {
        console.log("test")
      const dataTable = await fetch(
        `/purchases/itemsapi?invoice=${
          document.getElementById("inputInvoice").value
        }`
      ).then((data) => data.json());

      await fetch(
        `/purchases/edit/${document.getElementById("inputInvoice").value}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalsum: Number(dataTable.total.total),
            supplier: Number(document.getElementById("inputSupplier").value),
          }),
        }
      );

      window.location.pathname = "/purchases";

    } catch (e) {
      console.log(e);
    }
  }

  async function drawTable() {
    const dataTable = await fetch(
      `/purchases/itemsapi?invoice=${
        document.getElementById("inputInvoice").value
      }`
    ).then((data) => data.json());
    html = "";

    inputTotalSummary.value = `Rp ${
      Number(dataTable.total.total).toLocaleString("in").includes(",")
        ? Number(dataTable.total.total).toLocaleString("in")
        : Number(dataTable.total.total).toLocaleString("in") + ",00"
    }`;

    dataTable.datas.forEach((data, index) => {
      html += `
        <tr>
            <td>${index + 1}</td>
            <td>${data.itemcode}</td>
            <td>${data.name}</td>
            <td>${data.quantity}</td>
            <td>${`Rp ${
              Number(data.purchaseprice).toLocaleString("in").includes(",")
                ? Number(data.purchaseprice).toLocaleString("in")
                : Number(data.purchaseprice).toLocaleString("in") + ",00"
            }`}</td>
            <td>${`Rp ${
              Number(data.totalprice).toLocaleString("in").includes(",")
                ? Number(data.totalprice).toLocaleString("in")
                : Number(data.totalprice).toLocaleString("in") + ",00"
            }`}</td>
            ${
              path.includes("/purchases/edit")
                ? `
                <td>
                    <a href="/purchases/deleteitems/${
                      document.getElementById("inputInvoice").value
                    }/${Number(
                    data.id
                  )}" class="btn btn-danger btn-circle"><i class="fas fa-fw fa-trash"></i></a>
                </td>    
            `
                : ""
            }
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
        </tr>
        `;
    }

    table.innerHTML = html;
  }
}
