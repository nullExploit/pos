if (notif) getNotification();

socket.on("loadnotif", ({ stock }) => {
  if (stock <= 5 && notif) {
    getNotification();
  } else if (!stock && notif) {
    setTimeout(() => {
      getNotification();
    }, 500);
  }
});

async function getNotification() {
  const counter = document.getElementById("notifcounter");
  const data = await fetch("/goods/alertapi").then((data) => data.json());
  let html = `<h6 class="dropdown-header">
                    Alerts Center
                </h6>`;

  data.forEach((good) => {
    html += `
                <a class="dropdown-item d-flex align-items-center" href="/goods/edit/${good.barcode}">
                    <div class="mr-3">
                        <div class="icon-circle bg-warning">
                            <i class="fas fa-exclamation-triangle text-white"></i>
                        </div>
                    </div>
                    <div>
                        <div class="small text-gray-500">Barcode: ${good.barcode}</div>
                        Stock Alert: <span class="font-weight-bold">${good.name}</span> 
                        only have stock <span class="font-weight-bold">${good.stock}</span>
                    </div>
                </a>
                `;
  });

  if (!data.length) html = "";

  counter.innerHTML = data.length ? data.length : "";

  notif.innerHTML = html;
}
