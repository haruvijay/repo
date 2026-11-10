// Task 1: Grab DOM elements
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultsContainer = document.getElementById("results");

// Task 1 & 4: Catch the search event and prevent page reload
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Stop page from refreshing

  const query = input.value.trim();

  // Task 4: Ignore empty searches
  if (!query) return;

  await handleSearch(query);
});

// Task 2: Fetch data from the Wikimedia Commons API
async function handleSearch(query) {
  // Use encodeURIComponent to support multi-word queries cleanly
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
    query
  )}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*`;

  try {
    const response = await fetch(url);

    // Check response status before parsing
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const data = await response.json();

    // Safely extract items array
    const items =
      data.query && data.query.pages ? Object.values(data.query.pages) : [];

    renderResults(items, query);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Task 3 & 5: Render items into cards in the DOM
function renderResults(items, query) {
  // Clear old results before adding new ones
  resultsContainer.innerHTML = "";

  if (items.length === 0) {
    resultsContainer.innerHTML = "<p>No images found. Try another search!</p>";
    return;
  }

  // Task 5 Enhancement: Display result count heading
  const countHeading = document.createElement("h3");
  countHeading.textContent = `Showing ${items.length} results for "${query}"`;
  countHeading.style.gridColumn = "1 / -1";
  resultsContainer.appendChild(countHeading);

  // Loop through items and build cards
  items.forEach((item) => {
    const imageUrl =
      item.imageinfo && item.imageinfo[0] ? item.imageinfo[0].thumburl : "";
    if (!imageUrl) return;

    // Build card structure
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = item.title;

    const caption = document.createElement("p");
    caption.textContent = item.title.replace("File:", "");

    // Assemble card
    card.appendChild(img);
    card.appendChild(caption);

    // Task 5 Enhancement: Make card open full image in a new tab
    const link = document.createElement("a");
    link.href = item.imageinfo[0].descriptionurl || imageUrl;
    link.target = "_blank";
    link.style.textDecoration = "none";
    link.style.color = "inherit";
    link.appendChild(card);

    resultsContainer.appendChild(link);
  });
}