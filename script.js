/* Variables */
const dropdownsMenu = document.querySelectorAll(".dropdown-menu");
const dropdownBtn = document.querySelectorAll("#dropdownMenuButton");
const tableBd = document.querySelector("tbody");
const tableMain = document.querySelector("table");

/* Common  fetch function  */
const fetchResponse = (uri, callFn) => {
  fetch(uri)
    .then((readerData) => {
      if (!readerData.ok) throw new Error(`${readerData.status}`);
      return readerData.json();
    })
    .then((data) => callFn(data))
    .catch((error) => alert("Error in fetching  data , Getting " + error));
};

/* for creating Dropdown for states */
const createStateDOM = (data) => {
  data.states.forEach((state) => {
    const alink = document.createElement("a");

    alink.setAttribute("class", "dropdown-item");
    alink.setAttribute("state_id", state.state_id);
    alink.innerText = state.state_name;

    dropdownsMenu[0].append(alink);
  });
};

fetchResponse(
  "https://cdn-api.co-vin.in/api/v2/admin/location/states",
  createStateDOM
);

/*  for creating Dropdown for destricts */

const createDestrictDOM = (data) => {
  dropdownsMenu[1].innerText = "";
  data.districts.forEach((destrict) => {
    const alink = document.createElement("a");

    alink.setAttribute("class", "dropdown-item");
    alink.setAttribute("district_id", destrict.district_id);
    alink.innerText = destrict.district_name;

    dropdownsMenu[1].append(alink);
  });
};

/* Event listener for adding data in the body for selected destrict */

dropdownsMenu[0].addEventListener("click", (event) => {
  dropdownBtn[0].innerHTML = event.target.innerText;
  dropdownBtn[1].classList.remove("disabled");
  const destrict_id = event.target.getAttribute("state_id");
  fetchResponse(
    `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${destrict_id}`,
    createDestrictDOM
  );
});

/* for getting todays date */

const todaysDate = () => {
  let today = new Date();
  return (
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear()
  );
};

const createVaccinationDOM = (data) => {
  if (tableBd) {
    tableBd.innerHTML = "";
  }

  if (data.sessions.length !== 0) {
    data.sessions.forEach((center) => {
      const tr = document.createElement("tr");

      const name = document.createElement("td");
      name.innerText = center.name;

      const address = document.createElement("td");
      address.innerText = center.address;

      const capacity = document.createElement("td");
      capacity.innerText = center.available_capacity;

      const capacity1 = document.createElement("td");
      capacity1.innerText = center.available_capacity_dose1;

      const capacity2 = document.createElement("td");
      capacity2.innerText = center.available_capacity_dose2;

      const feeType = document.createElement("td");
      feeType.innerText = center.fee_type;

      const vaccine = document.createElement("td");
      vaccine.innerText = center.vaccine;

      tr.append(
        name,
        address,
        feeType,
        vaccine,
        capacity,
        capacity1,
        capacity2
      );

      tableBd.append(tr);
    });
  } else {
    alert("No records found!!! Please check other centers");
  }
};

/* for creating listener for destricts */

dropdownsMenu[1].addEventListener("click", (event) => {
  dropdownBtn[1].innerHTML = event.target.innerText;
  dropdownBtn[1].classList.remove("disabled");
  const destrict_id = event.target.getAttribute("district_id");
  fetchResponse(
    `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${destrict_id}&date=${todaysDate()}`,
    createVaccinationDOM
  );
});
