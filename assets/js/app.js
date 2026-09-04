const cl = console.log;

const form = document.getElementById("form");
const rollCode = document.getElementById("rollCode");
const specialization = document.getElementById("specialization");
const availability = document.getElementById("availability");
const portfolio = document.getElementById("portfolio");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const studentContainer = document.getElementById("studentContainer");
const hideTableController = document.getElementById("hideTable");

// Database

let jsonArr = localStorage.getItem("studentArr");

let studentArr = jsonArr ? JSON.parse(jsonArr) : [];

// functions

function saveInLS() {
  localStorage.setItem("studentArr", JSON.stringify(studentArr));
}

// showHideTable

function hideTable() {
  if (studentArr.length === 0) {
    hideTableController.classList.add("d-none");
  } else {
    hideTableController.classList.remove("d-none");
  }
}

// showOnUI

function showOnUI(arr) {
  let result = "";

  arr.forEach((ele, i) => {
    result += `
                                  <tr id="${ele.id}">
                                    <td>${i + 1}</td>
                                    <td>${ele.rollCode}</td>
                                    <td>${ele.specialization}</td>
                                    <td>${ele.availability}</td>
                                    <td>${ele.portfolio}</td>
                                    <td class="d-flex justify-content-center">
                                        <button onclick="editStudent(this)" class="btn btn-sm mr-2 btn-primary">Edit</button>
                                        <button onclick="removeStudent(this)" class="btn btn-sm btn-danger deleteBtn">Delete</button>
                                    </td>
                                </tr>
    `;
  });

  studentContainer.innerHTML = result;
}

showOnUI(studentArr);
hideTable();

// create

function createTr(newStudent) {
  let tr = document.createElement("tr");

  tr.id = newStudent.id;

  tr.innerHTML = `
                                  <td>${studentArr.length}</td>
                                    <td>${newStudent.rollCode}</td>
                                    <td>${newStudent.specialization}</td>
                                    <td>${newStudent.availability}</td>
                                    <td>${newStudent.portfolio}</td>
                                    <td class="d-flex justify-content-center">
                                        <button onclick="editStudent(this)" class="btn btn-sm mr-2 btn-primary">Edit</button>
                                        <button onclick="removeStudent(this)" class="btn btn-sm btn-danger deleteBtn">Delete</button>
                                    </td>
  `;

  studentContainer.append(tr);
}

// edit

function editStudent(ele) {
  let editId = ele.closest("tr").id;
  localStorage.setItem("editId", editId);

  let tr = ele.closest("tr");
  let deleteBtn = tr.querySelector(".deleteBtn");
  deleteBtn.disabled = true;

  let editObj = studentArr.find((ele) => ele.id === editId);

  rollCode.value = editObj.rollCode;
  specialization.value = editObj.specialization;
  availability.value = editObj.availability;
  portfolio.value = editObj.portfolio;

  submitBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
}

// update

function onUpdateClick(event) {
  let updateId = localStorage.getItem("editId");

  if (
    !rollCode.value.trim() ||
    !specialization.value.trim() ||
    !availability.value.trim() ||
    !portfolio.value.trim()
  ) {
    Swal.fire({
      title: "Required Fields!",
      text: "Please Fill in all required fileds...",
      icon: "warning",
      timer: 2000,

      showClass: {
        popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `,
      },
      hideClass: {
        popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `,
      },
    });
    return;
  }

  let updatedObj = {
    id: updateId,
    rollCode: rollCode.value,
    specialization: specialization.value,
    availability: availability.value,
    portfolio: portfolio.value,
  };

  let getIndex = studentArr.findIndex((ele) => ele.id === updateId);

  studentArr[getIndex] = updatedObj;
  saveInLS();

  let td = [...document.getElementById(updateId).children];

  td[1].innerText = rollCode.value;
  td[2].innerText = specialization.value;
  td[3].innerText = availability.value;
  td[4].innerText = portfolio.value;

  updateBtn.classList.add("d-none");
  submitBtn.classList.remove("d-none");
  localStorage.removeItem("editId");
  form.reset();

  let tr = document.getElementById(updateId);
  let deleteBtn = tr.querySelector(".deleteBtn");
  deleteBtn.disabled = false;
}

// remove

function removeStudent(ele) {
  let removeId = ele.closest("tr").id;

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let getIndex = studentArr.findIndex((ele) => ele.id === removeId);

      studentArr.splice(getIndex, 1);
      saveInLS();
      hideTable();

      ele.closest("tr").remove();
      let srno = [
        ...document.querySelectorAll("#studentContainer tr td:first-child"),
      ];

      srno.forEach((ele, i) => (ele.innerText = i + 1));

      Swal.fire({
        title: "Deleted!",
        text: "Your Student Info has been deleted.",
        icon: "success",
        timer: 1500,
      });
    }
  });
}

function onStudentAdd(event) {
  event.preventDefault();

  if (
    !rollCode.value.trim() ||
    !specialization.value.trim() ||
    !availability.value.trim() ||
    !portfolio.value.trim()
  ) {
    Swal.fire({
      title: "Required Fields!",
      text: "Please Fill in all required fileds...",
      icon: "warning",
      timer: 2000,

      showClass: {
        popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `,
      },
      hideClass: {
        popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `,
      },
    });
    return;
  }

  let newStudent = {
    id: crypto.randomUUID(),
    rollCode: rollCode.value,
    specialization: specialization.value,
    availability: availability.value,
    portfolio: portfolio.value,
  };

  studentArr.push(newStudent);
  saveInLS();
  hideTable();

  createTr(newStudent);

  form.reset();
}

form.addEventListener("submit", onStudentAdd);
updateBtn.addEventListener("click", onUpdateClick);
