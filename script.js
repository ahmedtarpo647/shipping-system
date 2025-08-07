document.addEventListener("DOMContentLoaded", function () {
  const loginContainer = document.getElementById("login-container");
  const mainContainer = document.getElementById("main-container");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const form = document.getElementById("shipping-form");
  const tableBody = document.querySelector("#shipment-table tbody");
  const searchBox = document.getElementById("search-box");
  const filterCompany = document.getElementById("filter-company");

  const exportBtn = document.getElementById("export-btn");
  const printBtn = document.getElementById("print-btn");

  function loadShipments() {
    const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
    tableBody.innerHTML = "";
    const companies = new Set();

    shipments.forEach((shipment, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${shipment.name}</td>
        <td>${shipment.address}</td>
        <td>${shipment.city}</td>
        <td>${shipment.tracking}</td>
        <td>${shipment.company}</td>
        <td>${shipment.date}</td>
        <td><button onclick="deleteShipment(${index})">Delete</button></td>
      `;
      tableBody.appendChild(tr);
      companies.add(shipment.company);
    });

    filterCompany.innerHTML = '<option value="">All Companies</option>';
    companies.forEach(company => {
      filterCompany.innerHTML += `<option value="${company}">${company}</option>`;
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
    const newShipment = {
      name: document.getElementById("customer-name").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      tracking: document.getElementById("tracking-number").value,
      company: document.getElementById("shipping-company").value,
      date: new Date().toLocaleDateString()
    };
    shipments.push(newShipment);
    localStorage.setItem("shipments", JSON.stringify(shipments));
    form.reset();
    loadShipments();
  });

  window.deleteShipment = function(index) {
    const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
    if (confirm("Are you sure you want to delete this shipment?")) {
      shipments.splice(index, 1);
      localStorage.setItem("shipments", JSON.stringify(shipments));
      loadShipments();
    }
  };

  searchBox.addEventListener("input", function () {
    const term = searchBox.value.toLowerCase();
    Array.from(tableBody.children).forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(term) ? "" : "none";
    });
  });

  filterCompany.addEventListener("change", function () {
    const value = filterCompany.value;
    Array.from(tableBody.children).forEach(row => {
      row.style.display = value === "" || row.children[4].innerText === value ? "" : "none";
    });
  });

  exportBtn.addEventListener("click", function () {
    const rows = [["Name", "Address", "City", "Tracking", "Company", "Date"]];
    const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
    shipments.forEach(s => {
      rows.push([s.name, s.address, s.city, s.tracking, s.company, s.date]);
    });
    const csvContent = rows.map(e => e.join(",")).join("\\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shipments.csv";
    a.click();
    URL.revokeObjectURL(url);
  });

  printBtn.addEventListener("click", function () {
    const original = document.body.innerHTML;
    const content = document.querySelector("#main-container").innerHTML;
    document.body.innerHTML = content;
    window.print();
    document.body.innerHTML = original;
    location.reload();
  });

  window.login = function () {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (username === "admin" && password === "1234") {
      loginContainer.style.display = "none";
      mainContainer.style.display = "block";
      loadShipments();
    } else {
      alert("Incorrect login.");
    }
  };

  window.logout = function () {
    loginContainer.style.display = "block";
    mainContainer.style.display = "none";
  };
});
