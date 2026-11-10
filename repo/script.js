const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsContainer = document.getElementById("results-container");
const statusMessage = document.getElementById("status-message");
const categoryButtons = document.querySelectorAll(".category");

const inspiration = {
  nature: {
    emoji: "🌿",
    title: "Nature Escape",
    description: "Explore greenery, peaceful forests, and the beauty of the natural world."
  },
  architecture: {
    emoji: "🏛️",
    title: "Architecture",
    description: "Discover inspiring buildings, creative spaces, and remarkable structures."
  },
  art: {
    emoji: "🎨",
    title: "Creative Art",
    description: "Find colour, imagination, illustration, and ideas for your next creation."
  },
  travel: {
    emoji: "✈️",
    title: "Travel Dreams",
    description: "Explore new destinations, memorable journeys, and places to discover."
  },
  ocean: {
    emoji: "🌊",
    title: "Ocean Views",
    description: "Dive into blue waters, beautiful coastlines, and peaceful sea views."
  },
  space: {
    emoji: "🚀",
    title: "Space & Stars",
    description: "Explore galaxies, planets, stars, and the wonders of the universe."
  }
};

function searchInspiration(query) {
  const term = query.trim().toLowerCase();

  resultsContainer.replaceChildren();

  if (!term) {
    statusMessage.textContent = "Please enter a search term or choose a category.";
    return;
  }

  const matches = Object.entries(inspiration).filter(([key, item]) =>
    key.includes(term) ||
    item.title.toLowerCase().includes(term) ||
    item.description.toLowerCase().includes(term)
  );

  if (matches.length === 0) {
    statusMessage.textContent =
      `No exact matches for "${term}". Try nature, art, travel, ocean, or space.`;
    return;
  }

  statusMessage.textContent =
    `Found ${matches.length} inspiration ${matches.length === 1 ? "card" : "cards"}.`;

  matches.forEach(([key, item]) => {
    const card = document.createElement("article");
    card.className = "result-card";

    const icon = document.createElement("div");
    icon.className = "result-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = item.emoji;

    const heading = document.createElement("h3");
    heading.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description;

    const tag = document.createElement("span");
    tag.className = "result-tag";
    tag.textContent = key;

    card.append(icon, heading, description, tag);
    resultsContainer.appendChild(card);
  });
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchInspiration(searchInput.value);
});

categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const query = button.dataset.query;
    searchInput.value = query;
    searchInspiration(query);
  });
});
