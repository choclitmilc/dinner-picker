const u = (value) => JSON.parse(`"${value}"`);
const e = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const dishNames = [
  "\u53ef\u4e50\u9e21\u7fc5",
  "\u9999\u8fa3\u9e21\u7fc5",
  "\u849c\u9999\u9e21\u7fc5",
  "\u9ec4\u7116\u9e21",
  "\u5496\u55b1\u9e21",
  "\u53e3\u6c34\u9e21",
  "\u8471\u6cb9\u9e21",
  "\u7167\u70e7\u9e21\u817f",
  "\u6d0b\u8471\u9e21\u817f",
  "\u7ea2\u70e7\u8089",
  "\u7ea2\u70e7\u6392\u9aa8",
  "\u7cd6\u918b\u5c0f\u6392",
  "\u6d0b\u8471\u9ed1\u6912\u80a5\u725b",
  "\u8fa3\u6912\u7092\u8089",
  "\u732a\u8089\u767d\u83dc\u7096\u8c46\u8150",
  "\u70e4\u725b\u4ed4\u9aa8",
  "\u9ebb\u8fa3\u725b\u8169",
  "\u5496\u55b1\u725b\u8169",
  "\u67f1\u4faf\u725b\u8169",
  "\u756a\u8304\u725b\u8169",
  "\u9ebb\u5a46\u8c46\u8150",
  "\u8089\u672b\u8c46\u8150",
  "\u8089\u672b\u8c46\u89d2",
  "\u82b9\u83dc\u7092\u8089",
  "\u918b\u6e9c\u767d\u83dc",
  "\u5305\u83dc\u7c89\u4e1d",
  "\u624b\u6495\u5305\u83dc",
  "\u897f\u7ea2\u67ff\u7092\u9e21\u86cb",
  "\u814a\u80a0\u83dc\u996d",
  "\u849c\u7092\u7a7a\u5fc3\u83dc",
  "\u85d5\u7247\u7092\u8089",
  "\u7530\u56ed\u9752\u83dc\u94b5",
  "\u767d\u707c\u751f\u83dc",
  "\u849c\u82d4\u7092\u8089",
  "\u9171\u6cb9\u7092\u996d",
  "\u9e21\u86cb\u7092\u8c46\u89d2",
  "\u6d0b\u8471\u7092\u9e21\u86cb",
  "\u70b8\u82b1\u751f\u7c73",
  "\u7092\u674f\u9c8d\u83c7",
  "\u62cc\u9ec4\u74dc",
  "\u6e05\u6c64\u9762",
  "\u897f\u7ea2\u67ff\u9762",
];

const moodOptions = [
  u("\\u5168\\u90e8"),
  u("\\u6696\\u6696\\u7684"),
  u("\\u60f3\\u88ab\\u5ba0"),
  u("\\u60f3\\u5403\\u9999\\u7684"),
  u("\\u60f3\\u5403\\u8fa3\\u7684"),
  u("\\u6e05\\u723d\\u70b9"),
];
const timeOptions = [u("\\u5168\\u90e8"), u("\\u5f88\\u5feb"), u("\\u6162\\u6162\\u7096")];
const storageKeys = {
  favorites: "dinnerPickerFavorites",
  custom: "dinnerPickerCustom",
};

const builtInDishes = dishNames.map((name, index) => {
  const profile = getDishProfile(name);
  return {
    id: `dish-${index}-${slugify(name)}`,
    name,
    note: makeNote(name, profile),
    mood: profile.mood,
    time: profile.time,
    photo: profile.photo,
    icon: "\u2661",
    tags: profile.tags,
  };
});

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

function slugify(value) {
  return Array.from(value)
    .map((char) => char.charCodeAt(0).toString(16))
    .join("-");
}

function hasAny(value, words) {
  return words.some((word) => value.includes(word));
}

function getDishProfile(name) {
  const spicy = hasAny(name, [u("\\u8fa3"), u("\\u9ebb\\u8fa3"), u("\\u53e3\\u6c34"), u("\\u9ebb\\u5a46")]);
  const slow = hasAny(name, [u("\\u7096"), u("\\u7116"), u("\\u7ea2\\u70e7"), u("\\u725b\\u8169"), u("\\u6392\\u9aa8"), u("\\u5c0f\\u6392")]);
  const light = hasAny(name, [u("\\u767d\\u707c"), u("\\u62cc"), u("\\u6e05\\u6c64"), u("\\u751f\\u83dc"), u("\\u9ec4\\u74dc"), u("\\u9752\\u83dc")]);
  const comfort = hasAny(name, [u("\\u5496\\u55b1"), u("\\u756a\\u8304"), u("\\u7167\\u70e7"), u("\\u7cd6\\u918b"), u("\\u814a\\u80a0")]);
  const tags = [];

  if (spicy) tags.push(u("\\u8fa3\\u5473"));
  if (slow) tags.push(u("\\u6162\\u6162\\u505a"));
  if (light) tags.push(u("\\u6e05\\u723d"));
  if (name.includes(u("\\u9e21"))) tags.push(u("\\u9e21\\u8089"));
  if (name.includes(u("\\u725b"))) tags.push(u("\\u725b\\u8089"));
  if (hasAny(name, [u("\\u732a"), u("\\u8089"), u("\\u6392\\u9aa8"), u("\\u5c0f\\u6392")])) tags.push(u("\\u4e0b\\u996d"));
  if (hasAny(name, [u("\\u9762"), u("\\u996d")])) tags.push(u("\\u4e3b\\u98df"));
  if (tags.length === 0) tags.push(u("\\u5bb6\\u5e38"));

  return {
    mood: spicy ? u("\\u60f3\\u5403\\u8fa3\\u7684") : light ? u("\\u6e05\\u723d\\u70b9") : comfort ? u("\\u60f3\\u88ab\\u5ba0") : u("\\u60f3\\u5403\\u9999\\u7684"),
    time: slow ? u("\\u6162\\u6162\\u7096") : u("\\u5f88\\u5feb"),
    photo: getDishPhoto(name),
    tags: [...new Set(tags)].slice(0, 3),
  };
}

function getDishPhoto(name) {
  if (name.includes(u("\\u53ef\\u4e50\\u9e21\\u7fc5"))) return "images/cola-chicken.png";
  if (name.includes(u("\\u9e21\\u7fc5"))) return "images/chicken-wings.png";
  if (hasAny(name, [u("\\u9999\\u8fa3"), u("\\u53e3\\u6c34"), u("\\u8fa3\\u6912")])) return "images/spicy-chicken.png";
  if (name.includes(u("\\u5496\\u55b1"))) return "images/curry-chicken.png";
  if (name.includes(u("\\u7167\\u70e7"))) return "images/teriyaki-chicken.png";
  if (hasAny(name, [u("\\u6392\\u9aa8"), u("\\u5c0f\\u6392"), u("\\u725b\\u4ed4\\u9aa8")])) return "images/ribs.png";
  if (name.includes(u("\\u7ea2\\u70e7\\u8089"))) return "images/pork-belly.png";
  if (name.includes(u("\\u725b"))) return "images/beef.png";
  if (name.includes(u("\\u8c46\\u8150"))) return "images/tofu.png";
  if (name.includes(u("\\u897f\\u7ea2\\u67ff\\u7092\\u9e21\\u86cb"))) return "images/tomato-egg.png";
  if (name.includes(u("\\u7092\\u996d")) || name.includes(u("\\u83dc\\u996d"))) return "images/fried-rice.png";
  if (name.includes(u("\\u9762"))) return "images/noodles.png";
  if (name.includes(u("\\u82b1\\u751f"))) return "images/peanuts.png";
  if (name.includes(u("\\u674f\\u9c8d\\u83c7"))) return "images/mushroom.png";
  if (name.includes(u("\\u9ec4\\u74dc"))) return "images/cucumber.png";
  if (hasAny(name, [u("\\u767d\\u83dc"), u("\\u5305\\u83dc"), u("\\u7a7a\\u5fc3\\u83dc"), u("\\u751f\\u83dc"), u("\\u9752\\u83dc"), u("\\u85d5\\u7247"), u("\\u82b9\\u83dc"), u("\\u849c\\u82d4"), u("\\u8c46\\u89d2")])) return "images/vegetable.png";
  return "images/chicken-wings.png";
}

function makeNote(name, profile) {
  if (profile.mood === u("\\u60f3\\u5403\\u8fa3\\u7684")) return `${name}${u("\\uff0c\\u9002\\u5408\\u60f3\\u5403\\u70b9\\u8fa3\\u7684\\u665a\\u4e0a\\u3002")}`;
  if (profile.time === u("\\u6162\\u6162\\u7096")) return `${name}${u("\\uff0c\\u6162\\u6162\\u7096\\u5230\\u9999\\u5473\\u51fa\\u6765\\u3002")}`;
  if (profile.mood === u("\\u6e05\\u723d\\u70b9")) return `${name}${u("\\uff0c\\u6e05\\u6e05\\u723d\\u723d\\u4e5f\\u5f88\\u597d\\u5403\\u3002")}`;
  return `${name}${u("\\uff0c\\u662f\\u53ef\\u4ee5\\u88ab\\u94a6\\u70b9\\u7684\\u5bb6\\u5e38\\u83dc\\u3002")}`;
}

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
    ? `<img class="dish-photo" src="${e(selectedDish.photo)}" alt="${e(selectedDish.name)}" />`
    : `<div class="dish-photo placeholder" aria-hidden="true">${selectedDish.icon ?? "\u2661"}</div>`;
  featuredDish.innerHTML = `
    <div>
      <h2 class="dish-name">${e(selectedDish.name)}</h2>
      <p class="dish-note">${e(selectedDish.note)}</p>
      <div class="tag-row">
        <span class="tag">${e(selectedDish.mood)}</span>
        <span class="tag">${e(selectedDish.time)}</span>
        ${selectedDish.tags.map((tag) => `<span class="tag">${e(tag)}</span>`).join("")}
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
      ? `<img class="card-photo" src="${e(dish.photo)}" alt="${e(dish.name)}" />`
      : `<div class="card-photo dish-photo placeholder" aria-hidden="true">${dish.icon ?? "\u2661"}</div>`;
    button.innerHTML = `
      ${cardPhoto}
      <span>
        <strong>${e(dish.name)}</strong>
        <p>${e(dish.note)}</p>
      </span>
      <span class="tag-row">
        <span class="tag">${e(dish.time)}</span>
        <span class="tag">${e(dish.mood)}</span>
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
      <span>${e(dish.name)}</span>
      <button class="remove-button" type="button" aria-label="${u("\\u53d6\\u6d88\\u6536\\u85cf")} ${e(dish.name)}">x</button>
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
