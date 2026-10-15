(function () {
  "use strict";

  var grid = document.getElementById("saved-grid");
  var empty = document.getElementById("saved-empty");
  if (!grid || !window.HiitSaved || !window.HiitCards) return;

  function render() {
    var cards = window.HiitSaved.getSavedCards();
    grid.innerHTML = "";
    cards.forEach(function (card) {
      grid.appendChild(window.HiitCards.build(card));
    });
    empty.hidden = cards.length > 0;
  }

  render();
  window.addEventListener("pageshow", render);
})();
