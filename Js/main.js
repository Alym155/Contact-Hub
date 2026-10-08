var nameInput = document.getElementById("contactName");
var phone = document.getElementById("contactPhone");
var email = document.getElementById("contactEmail");
var address = document.getElementById("contactAddress");
var group = document.getElementById("contactGroup");
var notes = document.getElementById("contactNotes");
var favorite = document.getElementById("contactFavorite");
var emergency = document.getElementById("contactEmergency");
var img = document.getElementById("contactImage");

// display contacts counts
var totalContacts = document.getElementById("totalCount");
var favContacts = document.getElementById("favoritesCount");
var emergContacts = document.getElementById("emergencyCount");
var allContacts = document.getElementById("contactsCount");

// display contacts list
var cardList = document.getElementById("contactsList");

// favorate list
var favlist = document.getElementById("favoritesList");

// modal
var modal = document.getElementById("addContactModal");

// emergency list
var emergList = document.getElementById("emergencyList");

// buttons
var saveBtn = document.getElementById("saveButton");
var updateBtn = document.getElementById("updateButton");

// search
var searchInput = document.getElementById("searchInput");

// modal photo preview
var modalPreview = document.getElementById("modalPreview");
var defaultPreview = `<i class="fa-solid fa-user"></i>`;

var contacts;

if (localStorage.getItem("contacts") == null) {
  contacts = [];
} else {
  contacts = JSON.parse(localStorage.getItem("contacts"));
  displayContacts(contacts);
}

function addContact() {
  var contact = {
    name: nameInput.value,
    phone: phone.value,
    email: email.value,
    address: address.value,
    group: group.value,
    notes: notes.value,
    favorite: favorite.checked,
    emergency: emergency.checked,
    img: img.files[0]?.name,
  };
  contacts.push(contact);

  localStorage.setItem("contacts", JSON.stringify(contacts));

  //   console.log(contacts)

  displayContacts(contacts);
  closeModal();
  Swal.fire({
    title: "Saved!",
    text: "Contact added successfully",
    icon: "success",
    timer: 1500,
    showConfirmButton: false,
  });
}

function displayContacts(contactsList) {
  console.log(contactsList);
  totalContacts.textContent = contactsList.length;
  favContacts.textContent = contactsList.filter(
    (contact) => contact.favorite,
  ).length;
  emergContacts.textContent = contactsList.filter(
    (contact) => contact.emergency,
  ).length;
  allContacts.textContent = contactsList.length;

  if (contactsList.length === 0) {
    document.getElementById("emptyContacts").classList.remove("d-none");
  } else {
    document.getElementById("emptyContacts").classList.add("d-none");
  }

  var favbox = "";
  var emrgbox = "";
  var box = "";
  for (var i = 0; i < contactsList.length; i++) {
    // initials: first letter of first word + first letter of second word (if there is one)
    var words = contactsList[i].name.split(" ");
    var initials = words[0][0] + (words[1] ? words[1][0] : "");

    // show the photo if there is one, otherwise the initials
    var avatarContent = contactsList[i].img
      ? `<img src="./assets/${contactsList[i].img}" alt="${contactsList[i].name}" />`
      : initials;

    box += `
          <div class="col-md-6">
              <div class="contact-card">
                <div class="contact-card-body">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <div class="avatar">
                      ${avatarContent}
                      ${
                        contactsList[i].favorite
                          ? `<span class="avatar-badge badge-favorite">
                        <i class="fa-solid fa-star"></i>
                      </span>`
                          : ""
                      }
                      ${
                        contactsList[i].emergency
                          ? `<span class="avatar-badge badge-emergency">
                        <i class="fa-solid fa-heart-pulse"></i>
                      </span>`
                          : ""
                      }
                    </div>
                    <div class="overflow-hidden">
                      <h5 class="fw-bold mb-1 text-truncate">${contactsList[i].name}</h5>
                      <div class="info-row m-0">
                        <span class="mini-icon icon-blue">
                          <i class="fa-solid fa-phone"></i>
                        </span>
                        <span>${contactsList[i].phone}</span>
                      </div>
                    </div>
                  </div>
                  <div class="info-row">
                    <span class="mini-icon icon-purple">
                      <i class="fa-solid fa-envelope"></i>
                    </span>
                    <span class="text-truncate">${contactsList[i].email}</span>
                  </div>
                  <div class="info-row">
                    <span class="mini-icon icon-green">
                      <i class="fa-solid fa-location-dot"></i>
                    </span>
                    <span class="text-truncate">${contactsList[i].address}</span>
                  </div>
                  <div class="d-flex flex-wrap gap-2 mt-3">
                    <span class="tag tag-${contactsList[i].group}">${contactsList[i].group}</span>
                    ${
                      contactsList[i].emergency
                        ? `<span class="tag tag-emergency">
                      <i class="fa-solid fa-heart-pulse"></i> Emergency
                    </span>`
                        : ""
                    }
                  </div>
                </div>
                <div class="contact-card-footer d-flex align-items-center gap-2">
                  <a href="tel:${contactsList[i].phone}" class="action-btn action-call" title="Call">
                    <i class="fa-solid fa-phone"></i>
                  </a>
                  <a href="mailto:${contactsList[i].email}" class="action-btn action-mail" title="Email">
                    <i class="fa-solid fa-envelope"></i>
                  </a>
                  <div class="ms-auto d-flex gap-1">
                    <button onclick="toggleFav(${i})" class="action-btn ${contactsList[i].favorite ? "active-favorite" : ""}" title="Favorite">
                      <i class="${contactsList[i].favorite ? "fa-solid" : "fa-regular"} fa-star"></i>
                    </button>
                    <button onclick="toggleEmergency(${i})" class="action-btn ${contactsList[i].emergency ? "active-emergency" : ""}" title="Emergency">
                      <i class="${contactsList[i].emergency ? "fa-solid fa-heart-pulse" : "fa-regular fa-heart"}"></i>
                    </button>
                    <button onclick="editContacts(${i})" class="action-btn " title="Edit">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="deleteContacts(${i})" class="action-btn action-delete" title="Delete">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
        `;

    if (contactsList[i].favorite) {
      favbox += `
            <div class="col-md-6 col-lg-12">
                  <div class="mini-contact">
                    <span class="avatar avatar-sm">${avatarContent}</span>
                    <div class="flex-grow-1 overflow-hidden">
                      <p class="fw-semibold small m-0 text-truncate">${contactsList[i].name}</p>
                      <p class="small text-secondary m-0">${contactsList[i].phone}</p>
                    </div>
                    <a
                      href="tel:${contactsList[i].phone}"
                      class="action-btn action-call action-sm"
                      title="Call"
                    >
                      <i class="fa-solid fa-phone"></i>
                    </a>
                  </div>
            </div>
            `;
    }

    if (contactsList[i].emergency) {
      emrgbox += `
            <div class="col-md-6 col-lg-12">
                  <div class="mini-contact">
                    <span class="avatar avatar-sm">${avatarContent}</span>
                    <div class="flex-grow-1 overflow-hidden">
                      <p class="fw-semibold small m-0 text-truncate">${contactsList[i].name}</p>
                      <p class="small text-secondary m-0">${contactsList[i].phone}</p>
                    </div>
                    <a
                      href="tel:${contactsList[i].phone}"
                      class="action-btn action-emergency action-sm"
                      title="Call"
                    >
                      <i class="fa-solid fa-phone"></i>
                    </a>
                  </div>
            </div>
            `;
    }
  }

  // after the loop, so the page updates once with all contacts
  cardList.innerHTML = box;

  if (favbox === "") {
    favlist.innerHTML = `<p class="empty-text">No favorites yet</p>`;
  } else {
    favlist.innerHTML = `<div class="row g-2">${favbox}</div>`;
  }

  if (emrgbox === "") {
    emergList.innerHTML = `<p class="empty-text">No emergency contacts</p>`;
  } else {
    emergList.innerHTML = `<div class="row g-2">${emrgbox}</div>`;
  }
}

function deleteContacts(index) {
  // console.log(index);
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
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      contacts.splice(index, 1);
      localStorage.setItem("contacts", JSON.stringify(contacts));
      displayContacts(contacts);
    }
  });
}
var updatedIndex = -1;
function editContacts(index) {
  var mymodal = bootstrap.Modal.getOrCreateInstance(modal);
  updatedIndex = index;
  nameInput.value = contacts[index].name;
  phone.value = contacts[index].phone;
  email.value = contacts[index].email;
  address.value = contacts[index].address;
  group.value = contacts[index].group;
  notes.value = contacts[index].notes;
  favorite.checked = contacts[index].favorite;
  emergency.checked = contacts[index].emergency;

  // show the saved photo in the modal
  img.value = "";
  if (contacts[index].img) {
    modalPreview.innerHTML = `<img src="./assets/${contacts[index].img}" alt="${contacts[index].name}" />`;
  } else {
    modalPreview.innerHTML = defaultPreview;
  }

  saveBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
  mymodal.show();
}

function updateContacts() {
  var updatedContent = {
    name: nameInput.value,
    phone: phone.value,
    email: email.value,
    address: address.value,
    group: group.value,
    notes: notes.value,
    favorite: favorite.checked,
    emergency: emergency.checked,
    // keep the old photo if no new one was chosen
    img: img.files[0] ? img.files[0].name : contacts[updatedIndex].img,
  };

  contacts[updatedIndex] = updatedContent;
  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContacts(contacts);
  saveBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");
  closeModal();
  Swal.fire({
    title: "Updated!",
    text: "Contact updated successfully",
    icon: "success",
    timer: 1500,
    showConfirmButton: false,
  });
}

// show the chosen photo in the modal right away
function previewImage() {
  if (img.files[0]) {
    modalPreview.innerHTML = `<img src="${URL.createObjectURL(img.files[0])}" alt="preview" />`;
  } else {
    modalPreview.innerHTML = defaultPreview;
  }
}

// when the modal closes, reset the photo so the next "Add" starts empty
modal.addEventListener("hidden.bs.modal", function () {
  img.value = "";
  modalPreview.innerHTML = defaultPreview;
});

function closeModal() {
  var closeModal = bootstrap.Modal.getOrCreateInstance(modal);
  closeModal.hide();
}

function searchContacts() {
  var searchVal = searchInput.value.toLocaleLowerCase();
  var searchResult = [];
  for (var i = 0; i < contacts.length; i++) {
    if (
      contacts[i].name.toLocaleLowerCase().includes(searchVal) == true ||
      contacts[i].email.toLocaleLowerCase().includes(searchVal) == true ||
      contacts[i].phone.toLocaleLowerCase().includes(searchVal) == true
    ) {
      searchResult.push(contacts[i]);
    }
  }
  displayContacts(searchResult);
}


function toggleFav(index){
contacts[index].favorite = !contacts[index].favorite;
localStorage.setItem("contacts", JSON.stringify(contacts));
displayContacts(contacts)
}

function toggleEmergency(index){
contacts[index].emergency = !contacts[index].emergency;
localStorage.setItem("contacts", JSON.stringify(contacts));
displayContacts(contacts)
}