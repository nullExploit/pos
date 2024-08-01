function download_csv_file(csv) {
  const hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";

  hiddenElement.download = "report.csv";
  hiddenElement.click();
}
