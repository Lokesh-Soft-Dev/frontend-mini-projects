const birthdayList = [
  {
    name: "R.S.Upendra",
    age: 56,
    image: "https://english.janamtv.com/wp-content/uploads/2023/08/328172-upendra.png"
  },
  {
    name: "Sundar Pichai",
    age: 52,
    image: "https://media.licdn.com/dms/image/D4E03AQFrmDuWUxQoMg/profile-displayphoto-shrink_200_200/0/1715645354619?e=2147483647&v=beta&t=_WBVcQpyigwPLI-efv18uQQ3eV_hhzU5DcUlIHl77HA"
  },
  {
    name: "Lokesh",
    age: 29,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9jfpx4ygF4PYGwLPB5Qvot6OS7VeVWqpkIw&s"
  },
  {
    name: "Yogi Babu",
    age: 39,
    image: "https://i.pinimg.com/736x/19/68/32/1968325396ed4c7aacf4f8757b3ed76a.jpg"
  },
  {
    name: "Vijay Sethupathi",
    age: 46,
    image: "https://in.bmscdn.com/iedb/artist/images/website/poster/large/vijay-sethupathi-32355-16-09-2017-03-30-38.jpg"
  },
  {
    name: "S.J.Surya",
    age: 56,
    image: "https://static.toiimg.com/thumb/msid-73030755,width-400,resizemode-4/73030755.jpg"
  }
];

let currentList = [...birthdayList];

const countEl = document.getElementById("birthday-count");
const listEl = document.getElementById("birthday-list");
const clearBtn = document.getElementById("clear-btn");

function renderList() {
  listEl.innerHTML = "";
  countEl.textContent = `${currentList.length} Birthday${currentList.length !== 1 ? "'s" : ""} Today`;

  if (currentList.length === 0) {
    clearBtn.textContent = "Reset List";
    return;
  } else {
    clearBtn.textContent = "Clear All";
  }

  currentList.forEach(person => {
    const div = document.createElement("div");
    div.className = "Loki";
    div.innerHTML = `
      <img class="KGL" src="${person.image}" alt="${person.name}" />
      <div class="right-details">
        <p class="name">${person.name}</p>
        <p class="age">${person.age} Years</p>
      </div>
    `;
    listEl.appendChild(div);
  });
}

clearBtn.addEventListener("click", () => {
  if (currentList.length === 0) {
    currentList = [...birthdayList];
  } else {
    currentList = [];
  }
  renderList();
});

renderList();
