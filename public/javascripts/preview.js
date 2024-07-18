const loadFile = (evt) => {
  
  document.getElementById("previewContainer").innerHTML = `
    <label for="preview" class="col-sm-2 col-form-label">Preview</label>
    <div class="col-sm-5">
      <img id="preview" alt="preview" class="img-fluid">
    </div>
  `;
  
  const preview = document.getElementById("preview");

  preview.src = URL.createObjectURL(evt.target.files[0]);
  preview.onload = function () {
    URL.revokeObjectURL(preview.src); // free memory
  };
};
