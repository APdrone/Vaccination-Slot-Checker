const dropdownsMenu = document.querySelectorAll(".dropdown-menu");
const dropdownBtn = document.querySelectorAll("#dropdownMenuButton");
const tableBd = document.querySelector("tbody");

const fetchResponse = (uri, callFn) => {
  fetch(uri)
    .then((readerData) => readerData.json())
    .then((data) => callFn(data));
};

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

dropdownsMenu[0].addEventListener("click", (event) => {
  dropdownBtn[1].classList.remove("disabled");
  const destrict_id = event.target.getAttribute("state_id");
  fetchResponse(
    `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${destrict_id}`,
    createDestrictDOM
  );
});

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

    tr.append(name, address, feeType, vaccine, capacity, capacity1, capacity2);

    tableBd.append(tr);
  });
};

dropdownsMenu[1].addEventListener("click", (event) => {
  dropdownBtn[1].classList.remove("disabled");
  const destrict_id = event.target.getAttribute("district_id");
  fetchResponse(
    `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${destrict_id}&date=${todaysDate()}`,
    createVaccinationDOM
  );
});
