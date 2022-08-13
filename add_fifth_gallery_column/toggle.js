function addFifthGalleryColumn() {
  var mediaGalleries = document.querySelectorAll(".Theme-MediaGallerySection");

  mediaGalleries.forEach(function (gallery) {
    var lengthFourRows = gallery.querySelectorAll(".MediaGallery__row--4");

    lengthFourRows.forEach(function (row) {
      var nextRow = row.nextElementSibling;

      if (nextRow.classList.contains("MediaGallery__row--1")) {
        var newCell = nextRow.querySelector(".MediaGallery__cell");
        row.appendChild(newCell);
        newCell.classList.remove("MediaGallery__cell--size2");
        newCell.classList.add("MediaGallery__cell--size1");
        delete nextRow;
      }
    });
  });
}

ready(addFifthGalleryColumn);
