document.addEventListener("DOMContentLoaded", function () {
  const openModalBtn = document.getElementById("openModalBtn");
  const modalOverlay = document.getElementById("modalOverlay");
  const closeModalBtn = document.getElementById("closeModalBtn");

  openModalBtn.addEventListener("click", function () {
    modalOverlay.style.display = "block";
  });

  closeModalBtn.addEventListener("click", function () {
    modalOverlay.style.display = "none";
  });
});
