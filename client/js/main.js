const url = 'http://localhost:8000/employees';
const cardItems = document.querySelector('.card-items');
const tableBody = document.querySelector('.table-body');
const toggleBtn = document.getElementById('btn-toggle');

const display = async () => {
  try {
    let data = await fetch(`${url}`);
    let employees = await data.json();
    cardItems.innerHTML = employees
      .map((employee) => {
        return `
      <div class="col-lg-4 col-md-6 card-box">
      <figure class="card ">
      <img src=${
        employee.gender.toLowerCase() === 'male'
          ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2OqzNHDuE9kjPRzMWVulNWxBAXQZ22lqbwQ&usqp=CAU'
          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiPBsp6JnO9xHi0BJ5X66vtS6Wd5dF6q0NwQ&usqp=CAU'
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
           <p class="skills">${employee.skills.join()}</p>
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
      })
      .join('');
    tableBody.innerHTML = employees
      .map((employee) => {
        return `
            <tr>
              <td class="name">${employee.name}</td>
              <td class="id">${employee.id}</td>
              <td class="skills">${employee.skills.join(',')}</td>
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
      .join('');
  } catch (error) {
    console.log(error);
  }
};
const editUpdateClick = async (e, id) => {
  let element = e.target;
  if (element.textContent === 'edit') {
    let targetElement = element.closest('.card-body').querySelector('.skills');
    let skills = targetElement.textContent;
    let inputbox = `<input type='text' class='form-control input-skills' value='${skills}'/>`;
    targetElement.innerHTML = inputbox;
    element.textContent = 'save';
  } else if (element.textContent === 'save') {
    let updateValue = element
      .closest('.card-body')
      .querySelector('.input-skills').value;
    console.log(updateValue);
    let skills = updateValue.split(',');
    console.log(skills);
    let res = await fetch(`${url}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        skills,
      }),
      headers: {
        'content-type': 'application/json',
      },
    });
    let data = await res.json();
    console.log(data);
    display();
  }
};
const editSaveClick = async (e, id) => {
  let element = e.target;
  if (element.value === 'edit') {
    element.classList.remove('bi-pencil-square', 'btn-primary');
    element.classList.add('bi-file-earmark-check', 'btn-success');
    let targetElement = element.closest('tr').querySelector('.skills');
    let skills = targetElement.textContent;
    let inputbox = `<input type='text' class='form-control input-skills' value='${skills}'/>`;
    targetElement.innerHTML = inputbox;
    element.value = 'save';
  } else if (element.value === 'save') {
    let updateValue = element
      .closest('tr')
      .querySelector('.input-skills').value;
    console.log(updateValue);
    let skills = updateValue.split(',');
    console.log(skills);
    let res = await fetch(`${url}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        skills,
      }),
      headers: {
        'content-type': 'application/json',
      },
    });
    let data = await res.json();
    display();
  }
};
const deleteClick = async (id) => {
  let check = confirm('Are you sure you want to delete this record?');
  if (!check) return;
  let res = await fetch(`${url}/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'appliction/json',
    },
  });
  let data = await res.json();
  console.log(data);
  display();
};

toggleBtn.addEventListener('click', (e) => {
  let element = e.target;
  if (element.value === 'list') {
    element.classList.remove('bi-list');
    element.classList.add('bi-grid');
    document.querySelector('.card-section').style.display = 'none';
    document.querySelector('.list-section').style.display = 'block';
    element.value = 'card';
  } else if (element.value === 'card') {
    element.classList.remove('bi-grid');
    element.classList.add('bi-list');
    document.querySelector('.card-section').style.display = 'block';
    document.querySelector('.list-section').style.display = 'none';
    element.value = 'list';
  }
});
