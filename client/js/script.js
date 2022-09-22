const url = "http://localhost:8000/employees";
const cardItems = document.querySelector(".card-items");
const tableBody = document.querySelector(".table-body");
const btnToggle = document.querySelector("#btn-toggle");
const cardSection = document.querySelector(".card-section");
const listSection = document.querySelector(".list-section");

// Get the data from json server using the URL
const display = () => {
  fetch(url)
    .then((responce) => responce.json())
    .then((employees) => {
      cardItems.innerHTML = employees
        .map((employee) => {
          console.log(employee.skills);
          return `
         <div class="col-lg-4 col-md-6 card-box">
           <figure class="card ">
           <img src=${
             employee.gender === "Male"
               ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2OqzNHDuE9kjPRzMWVulNWxBAXQZ22lqbwQ&usqp=CAU"
               : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiPBsp6JnO9xHi0BJ5X66vtS6Wd5dF6q0NwQ&usqp=CAU"
           } class="card-img-top" alt="Gender" />
            <div class="card-body">
              <div class="info-text">
                <h4>name : </h4>
                <p class="name">${employee.name}</p>
              </div>
              <div class="info-text">
                <h4>id : </h4>
                <p class="id">${employee.id}</p>
              </div>
              <div class="info-text">
                <h4>skills : </h4>
                <p class="skills">${employee.skills.join(",")}</p>
              </div>
              <div class="info-text">
                <h4>project : </h4>
                <p class="project">${employee.project}</p>
              </div>
              <div class="info-text">
                <h4>hcm : </h4>
                <p class="hcm">${employee.hcm}</p>
              </div>
              <div class="delete-box">
              <button class="btn btn-danger bi bi-x-lg btn-delete" onclick="deleteClick(
                ${employee.id}
              )"></button>
            </div>
            <div class="edit-box">
              <button class="btn-edit" onclick="editUpdateClick(event,
                ${employee.id}
              )">edit</button>
            </div>
            </div>
          </figure>
        </div>`;
          // cardItems.innerHTML += element;
        })
        .join("");
      tableBody.innerHTML = employees
        .map((employee) => {
          return `
              <tr>
                <td class="name">${employee.name}</td>
                <td class="id">${employee.id}</td>
                <td class="skills">${employee.skills.join(",")}</td>
                <td class="poject">${employee.project}</td>
                <td class="hcm">${employee.hcm}</td>
                <td class="button-section">
                <button class="btn btn-primary bi bi-pencil-square edit-btn" onclick="editSaveClick(event,${
                  employee.id
                })" value="edit"></button> 
                <button class="btn btn-danger bi bi-trash delete-btn" onclick="deleteClick(${
                  employee.id
                })"></button>
                </td>
              </tr>`;
        })
        .join("");
    })
    .catch((err) => console.log(err));
};

//EDIT AND UPDATE EVENT IN CARD COMPONENT
const editUpdateClick = (e, id) => {
  if (e.target.textContent === "edit") {
    let element = e.target.closest(".card-body").querySelector(".skills");
    let skillValue = element.textContent;
    element.innerHTML = `<input type="text" class="form-control card-input" value="${skillValue}"/>`;
    e.target.textContent = "save";
  } else {
    let updateValue = e.target
      .closest(".card-body")
      .querySelector(".card-input").value;
    let skills = updateValue.split(",");
    fetch(`${url}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        skills,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => display());
  }
};

// EDIT & SAVE BUTTON FUNCTION IN TABLE
const editSaveClick = (e, id) => {
  //edit button
  if (e.target.value === "edit") {
    // console.log("edit clicked");
    e.target.classList.remove("btn-primary", "bi-pencil-square");
    e.target.classList.add("btn-success", "bi-file-earmark-check");
    let targetElement = e.target.closest("tr").querySelector(".skills");
    let skills = targetElement.textContent;
    targetElement.innerHTML = `<input type="text" class="input-skills form-control" value="${skills}"/>`;
    e.target.value = "save";
  }
  //save button
  else {
    // console.log("save clicked");
    let updateValue = e.target
      .closest("tr")
      .querySelector(".input-skills").value;
    let skills = updateValue.split(",");
    fetch(`${url}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        skills,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => display());
  }
};

// DELETE BUTTON FUNCTION
const deleteClick = (id) => {
  let check = confirm("Are you sure want to delete this record?");
  if (!check) {
    return;
  }
  fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => display());
};

// Toggle function
btnToggle.addEventListener("click", (e) => {
  // console.log(e.target.value);
  if (e.target.value === "list") {
    e.target.classList.remove("bi-list");
    e.target.classList.add("bi-grid");
    cardSection.style.display = "none";
    listSection.style.display = "block";
    e.target.value = "card";
  } else if (e.target.value === "card") {
    e.target.classList.remove("bi-grid");
    e.target.classList.add("bi-list");
    cardSection.style.display = "block";
    listSection.style.display = "none";
    e.target.value = "list";
  }
});
