const u = (value) => JSON.parse(`"${value}"`);

const builtInDishes = [
  {
    id: "tomato-beef",
    name: u("\\u756a\\u8304\\u725b\\u8169"),
    note: u("\\u9178\\u751c\\u6d53\\u4e00\\u70b9\\uff0c\\u7c73\\u996d\\u4f1a\\u5f88\\u5f00\\u5fc3\\u3002"),
    mood: u("\\u6696\\u6696\\u7684"),
    time: u("\\u6162\\u6162\\u7096"),
    tags: [u("\\u4e0b\\u996d"), u("\\u6c64\\u6c41\\u591a")],
  },
  {
    id: "cola-wings",
    name: u("\\u53ef\\u4e50\\u9e21\\u7fc5"),
    note: u("\\u751c\\u54b8\\u521a\\u597d\\uff0c\\u9002\\u5408\\u88ab\\u5938\\u4e00\\u53e5\\u201c\\u4eca\\u5929\\u597d\\u4f1a\\u505a\\u996d\\u201d\\u3002"),
    mood: u("\\u60f3\\u88ab\\u5ba0"),
    time: u("\\u5f88\\u5feb"),
    tags: [u("\\u7ecf\\u5178"), u("\\u4e0d\\u8e29\\u96f7")],
  },
  {
    id: "garlic-shrimp",
    name: u("\\u849c\\u84c9\\u867e"),
    note: u("\\u9999\\u6c14\\u4e00\\u51fa\\u6765\\uff0c\\u5c31\\u77e5\\u9053\\u4eca\\u665a\\u5f88\\u8ba4\\u771f\\u3002"),
    mood: u("\\u60f3\\u5403\\u9999\\u7684"),
    time: u("\\u5f88\\u5feb"),
    tags: [u("\\u9c9c"), u("\\u4eea\\u5f0f\\u611f")],
  },
  {
    id: "miso-salmon",
    name: u("\\u5473\\u564c\\u4e09\\u6587\\u9c7c"),
    note: u("\\u914d\\u4e00\\u70b9\\u9752\\u83dc\\u548c\\u7c73\\u996d\\uff0c\\u6e05\\u723d\\u4f46\\u4e0d\\u5be1\\u6de1\\u3002"),
    mood: u("\\u6e05\\u723d\\u70b9"),
    time: u("\\u5f88\\u5feb"),
    tags: [u("\\u8f7b\\u98df"), u("\\u6e29\\u67d4")],
  },
  {
    id: "mapo-tofu",
    name: u("\\u9ebb\\u5a46\\u8c46\\u8150"),
    note: u("\\u5fae\\u8fa3\\u3001\\u70ed\\u4e4e\\u3001\\u62cc\\u996d\\uff0c\\u75b2\\u60eb\\u65e5\\u4e13\\u7528\\u3002"),
    mood: u("\\u60f3\\u5403\\u8fa3\\u7684"),
    time: u("\\u5f88\\u5feb"),
    tags: [u("\\u5fae\\u8fa3"), u("\\u62cc\\u996d")],
  },
  {
    id: "chicken-soup",
    name: u("\\u83cc\\u83c7\\u9e21\\u6c64"),
    note: u("\\u9002\\u5408\\u4e0b\\u96e8\\u5929\\uff0c\\u4e5f\\u9002\\u5408\\u4efb\\u4f55\\u60f3\\u88ab\\u7167\\u987e\\u7684\\u665a\\u4e0a\\u3002"),
    mood: u("\\u6696\\u6696\\u7684"),
    time: u("\\u6162\\u6162\\u7096"),
    tags: [u("\\u6c64"), u("\\u8212\\u670d")],
  },
  {
    id: "scallion-noodles",
    name: u("\\u8471\\u6cb9\\u62cc\\u9762"),
    note: u("\\u7b80\\u5355\\u4f46\\u9999\\uff0c\\u7559\\u4e00\\u70b9\\u714e\\u86cb\\u4f4d\\u7f6e\\u3002"),
    mood: u("\\u6e05\\u723d\\u70b9"),
    time: u("\\u5f88\\u5feb"),
    tags: [u("\\u9762"), u("\\u5341\\u5206\\u949f")],
  },
  {
    id: "pork-ribs",
    name: u("\\u7cd6\\u918b\\u6392\\u9aa8"),
    note: u("\\u9178\\u751c\\u4eae\\u6676\\u6676\\uff0c\\u9002\\u5408\\u5468\\u672b\\u6162\\u6162\\u5403\\u3002"),
    mood: u("\\u60f3\\u88ab\\u5ba0"),
    time: u("\\u6162\\u6162\\u7096"),
    tags: [u("\\u62db\\u724c\\u83dc"), u("\\u9178\\u751c")],
  },
];

const moodOptions = [u("\\u5168\\u90e8"), u("\\u6696\\u6696\\u7684"), u("\\u60f3\\u88ab\\u5ba0"), u("\\u60f3\\u5403\\u9999\\u7684"), u("\\u60f3\\u5403\\u8fa3\\u7684"), u("\\u6e05\\u723d\\u70b9")];
const timeOptions = [u("\\u5168\\u90e8"), u("\\u5f88\\u5feb"), u("\\u6162\\u6162\\u7096")];
const storageKeys = {
  favorites: "dinnerPickerFavorites",
  custom: "dinnerPickerCustom",
};

let filters = {
  mood: u("\\u5168\\u90e8"),
  time: u("\\u5168\\u90e8"),
};

let selectedDish = null;
let favorites = readStorage(storageKeys.favorites, []);
let customDishes = readStorage(storageKeys.custom, []);

const moodFilters = document.querySelector("#moodFilters");
const timeFilters = document.querySelector("#timeFilters");
const featuredDish = document.querySelector("#featuredDish");
const dishGrid = document.querySelector("#dishGrid");
const dishCount = document.querySelector("#dishCount");
const favoriteButton = document.querySelector("#favoriteButton");
const surpriseButton = document.querySelector("#surpriseButton");
const favoriteList = document.querySelector("#favoriteList");
const dishForm = document.querySelector("#dishForm");
const dishPhoto = document.querySelector("#dishPhoto");

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function getAllDishes() {
  return [...builtInDishes, ...customDishes];
}

function getFilteredDishes() {
  return getAllDishes().filter((dish) => {
    const moodMatch = filters.mood === u("\\u5168\\u90e8") || dish.mood === filters.mood;
    const timeMatch = filters.time === u("\\u5168\\u90e8") || dish.time === filters.time;
    return moodMatch && timeMatch;
  });
}

function pickRandomDish() {
  const pool = getFilteredDishes();
  selectedDish = pool[Math.floor(Math.random() * pool.length)] ?? getAllDishes()[0];
  render();
}

function renderFilterButtons(target, options, key) {
  target.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip${filters[key] === option ? " is-active" : ""}`;
    button.textContent = option;
    button.addEventListener("click", () => {
      filters[key] = option;
      pickRandomDish();
    });
    target.append(button);
  });
}

function renderFeaturedDish() {
  const isFavorite = favorites.includes(selectedDish.id);
  const photo = selectedDish.photo
    ? `<img class="dish-photo" src="${selectedDish.photo}" alt="${selectedDish.name}" />`
    : `<div class="dish-photo placeholder" aria-hidden="true">${selectedDish.icon ?? "\u2661"}</div>`;
  featuredDish.innerHTML = `
    <div>
      <h2 class="dish-name">${selectedDish.name}</h2>
      <p class="dish-note">${selectedDish.note}</p>
      <div class="tag-row">
        <span class="tag">${selectedDish.mood}</span>
        <span class="tag">${selectedDish.time}</span>
        ${selectedDish.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    </div>
    ${photo}
  `;
  favoriteButton.innerHTML = `<span aria-hidden="true">${isFavorite ? "&hearts;" : "&heartsuit;"}</span>${isFavorite ? u("\\u5df2\\u6536\\u85cf") : u("\\u6536\\u85cf")}`;
}

function renderDishGrid() {
  const dishes = getFilteredDishes();
  dishCount.textContent = `${dishes.length} ${u("\\u9053\\u53ef\\u9009")}`;
  dishGrid.innerHTML = "";
  dishes.forEach((dish) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dish-card";
    const cardPhoto = dish.photo
      ? `<img class="card-photo" src="${dish.photo}" alt="${dish.name}" />`
      : `<div class="card-photo dish-photo placeholder" aria-hidden="true">${dish.icon ?? "\u2661"}</div>`;
    button.innerHTML = `
      ${cardPhoto}
      <span>
        <strong>${dish.name}</strong>
        <p>${dish.note}</p>
      </span>
      <span class="tag-row">
        <span class="tag">${dish.time}</span>
        <span class="tag">${dish.mood}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      selectedDish = dish;
      render();
      featuredDish.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    dishGrid.append(button);
  });
}

function renderFavorites() {
  const favoriteDishes = getAllDishes().filter((dish) => favorites.includes(dish.id));
  favoriteList.innerHTML = "";

  if (favoriteDishes.length === 0) {
    favoriteList.innerHTML = `<div class="empty-state">${u("\\u8fd8\\u6ca1\\u6709\\u6536\\u85cf\\uff0c\\u7b49\\u5979\\u94a6\\u70b9\\u7b2c\\u4e00\\u9053\\u83dc\\u3002")}</div>`;
    return;
  }

  favoriteDishes.forEach((dish) => {
    const item = document.createElement("div");
    item.className = "favorite-item";
    item.innerHTML = `
      <span>${dish.name}</span>
      <button class="remove-button" type="button" aria-label="${u("\\u53d6\\u6d88\\u6536\\u85cf")} ${dish.name}">x</button>
    `;
    item.querySelector("button").addEventListener("click", () => {
      favorites = favorites.filter((id) => id !== dish.id);
      writeStorage(storageKeys.favorites, favorites);
      render();
    });
    favoriteList.append(item);
  });
}

function toggleFavorite() {
  if (!selectedDish) return;
  if (favorites.includes(selectedDish.id)) {
    favorites = favorites.filter((id) => id !== selectedDish.id);
  } else {
    favorites = [...favorites, selectedDish.id];
  }
  writeStorage(storageKeys.favorites, favorites);
  render();
}

async function addCustomDish(event) {
  event.preventDefault();
  const formData = new FormData(dishForm);
  const name = formData.get("dishName").trim();
  const note = formData.get("dishNote").trim() || u("\\u8fd9\\u9053\\u662f\\u4f60\\u4eec\\u81ea\\u5df1\\u7684\\u5c0f\\u83dc\\u5355\\u3002");
  const photo = await readImageAsDataUrl(dishPhoto.files[0]);

  if (!name) return;

  const dish = {
    id: `custom-${Date.now()}`,
    name,
    note,
    mood: u("\\u60f3\\u88ab\\u5ba0"),
    time: u("\\u5f88\\u5feb"),
    photo,
    icon: "\u2665",
    tags: [u("\\u79c1\\u623f\\u83dc")],
  };

  customDishes = [dish, ...customDishes];
  writeStorage(storageKeys.custom, customDishes);
  selectedDish = dish;
  dishForm.reset();
  render();
}

function render() {
  if (!selectedDish) {
    selectedDish = getAllDishes()[0];
  }
  renderFilterButtons(moodFilters, moodOptions, "mood");
  renderFilterButtons(timeFilters, timeOptions, "time");
  renderFeaturedDish();
  renderDishGrid();
  renderFavorites();
}

surpriseButton.addEventListener("click", pickRandomDish);
favoriteButton.addEventListener("click", toggleFavorite);
dishForm.addEventListener("submit", addCustomDish);

pickRandomDish();
