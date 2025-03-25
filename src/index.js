const baseURL = "http://localhost:3000/ramens";

function main() {
  displayRamens();
  addSubmitListener();
  addEditListener();
}

function displayRamens() {
  fetch(baseURL)
    .then((res) => res.json())
    .then((ramens) => {
      const ramenMenu = document.getElementById("ramen-menu");
      ramenMenu.innerHTML = "";
      ramens.forEach((ramen) => addRamenToMenu(ramen));
      if (ramens.length > 0) handleClick(ramens[0]); // Show first ramen on load
    })
    .catch((error) => console.error("Error fetching ramens:", error));
}

function handleClick(ramen) {
  document.querySelector("#ramen-detail .detail-image").src = ramen.image;
  document.querySelector("#ramen-detail .name").textContent = ramen.name;
  document.querySelector("#ramen-detail .restaurant").textContent =
    ramen.restaurant;
  document.querySelector("#rating-display").textContent = ramen.rating;
  document.querySelector("#comment-display").textContent = ramen.comment;

  const editForm = document.getElementById("edit-ramen");
  editForm.dataset.id = ramen.id;
  editForm["new-rating"].value = ramen.rating;
  editForm["new-comment"].value = ramen.comment;

  // Remove any existing delete button and add a new one
  let deleteBtn = document.getElementById("delete-ramen");
  if (!deleteBtn) {
    deleteBtn = document.createElement("button");
    deleteBtn.id = "delete-ramen";
    deleteBtn.textContent = "Delete This Ramen";
    deleteBtn.style.marginTop = "10px";
    document.getElementById("ramen-detail").appendChild(deleteBtn);
  }
  deleteBtn.onclick = () => deleteRamen(ramen.id);
}

function addSubmitListener() {
  document
    .getElementById("new-ramen")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const newRamen = {
        name: this.name.value,
        restaurant: this.restaurant.value,
        image: this.image.value,
        rating: this.rating.value,
        comment: this["new-comment"].value,
      };

      fetch(baseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRamen),
      })
        .then((res) => res.json())
        .then((savedRamen) => addRamenToMenu(savedRamen))
        .catch((error) => console.error("Error adding ramen:", error));

      this.reset();
    });
}

function addRamenToMenu(ramen) {
  const ramenMenu = document.getElementById("ramen-menu");
  const img = document.createElement("img");
  img.src = ramen.image;
  img.alt = ramen.name;
  img.dataset.id = ramen.id;
  img.addEventListener("click", () => handleClick(ramen));
  ramenMenu.appendChild(img);
}

function addEditListener() {
  document
    .getElementById("edit-ramen")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const ramenId = this.dataset.id;
      const updatedRating = this["new-rating"].value;
      const updatedComment = this["new-comment"].value;

      fetch(`${baseURL}/${ramenId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: updatedRating,
          comment: updatedComment,
        }),
      })
        .then(() => {
          document.getElementById("rating-display").textContent = updatedRating;
          document.getElementById("comment-display").textContent =
            updatedComment;
        })
        .catch((error) => console.error("Error updating ramen:", error));

      this.reset();
    });
}

function deleteRamen(id) {
  fetch(`${baseURL}/${id}`, { method: "DELETE" })
    .then(() => {
      document.querySelector(`[data-id="${id}"]`).remove();
      document.getElementById("ramen-detail").innerHTML =
        "<h3>Select a ramen</h3>";
    })
    .catch((error) => console.error("Error deleting ramen:", error));
}

document.addEventListener("DOMContentLoaded", main);
