const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsContainer = document.getElementById("results-container");
const statusMessage = document.getElementById("status-message");
const categoryButtons = document.querySelectorAll(".category");

const inspiration = {
  nature: {
    title: "Nature Escape",
    description: "Explore greenery, peaceful forests, and the beauty of nature."
  },
  architecture: {
    title: "Architecture",
    description: "Discover inspiring buildings and creative spaces."
  },
  art: {
    title: "Creative Art",
    description: "Find colour, imagination, illustrations, and creative ideas."
  },
  travel: {
    title: "Travel Dreams",
    description: "Explore new destinations and memorable journeys."
  },
  ocean: {
    title: "Ocean Wonders",
    description: "Discover beautiful oceans, beaches, and marine life."
  }
};

function showStatus(message) {
  if (statusMessage) {
    statusMessage.textContent = message;
  }
}

function clearResults() {
  resultsContainer.replaceChildren();
}

function renderResults(photos, query) {
  if (!photos.length) {
    showStatus("No images found. Try another search.");
    return;
  }

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const card = document.createElement("article");
    card.className = "result-card";

    const image = document.createElement("img");
    image.src = photo.urls.regular;
    image.alt = photo.alt || `Image of ${query}`;
    image.loading = "lazy";

    const caption = document.createElement("p");
    caption.textContent = photo.alt || `Inspiration for ${query}`;

    const categoryButton = document.createElement("button");
    categoryButton.type = "button";
    categoryButton.className = "category";
    categoryButton.textContent = query;
    categoryButton.setAttribute("aria-label", `Search for ${query}`);

    categoryButton.addEventListener("click", () => {
      searchInput.value = query;
      searchImages(query);
    });

    card.append(image, caption, categoryButton);
    fragment.appendChild(card);
  });

  resultsContainer.appendChild(fragment);
  showStatus(`Found ${photos.length} images for "${query}".`);
}

async function searchImages(searchTerm) {
  const query = (searchTerm || searchInput.value).trim();

  if (!query) {
    return;
  }

  clearResults();
  showStatus("Searching for images...");

  if (searchButton) {
    searchButton.disabled = true;
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12`;

    const response = await fetch(url, {
      headers: {
        Authorization: "Client-ID YOUR_UNSPLASH_ACCESS_KEY"
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    renderResults(data.results || [], query);
  } catch (error) {
    console.error("Image search error:", error);
    showStatus("Unable to load images. Check your API key and internet connection.");
  } finally {
    if (searchButton) {
      searchButton.disabled = false;
    }
  }
}

if (searchForm) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchImages();
  });
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    if (category && inspiration[category]) {
      searchInput.value = category;
      searchImages(category);
    }
  });
});
