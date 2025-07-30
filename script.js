/*
 * Script to display one business idea per day.
 *
 * It fetches the ideas list from a JSON file generated from the CSV and
 * calculates the index of today based on the day of the year.  The selected
 * idea is then rendered into the DOM.  If more or fewer ideas are added to
 * the JSON file, the script automatically cycles through them over the year.
 */

async function loadIdeaOfTheDay() {
  try {
    const response = await fetch('business_ideas.json');
    if (!response.ok) throw new Error(`Unable to load ideas: ${response.statusText}`);
    const ideas = await response.json();
    if (!Array.isArray(ideas) || ideas.length === 0) throw new Error('Ideas data is empty or invalid');

    // Calculate the day of the year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Determine which idea to show based on the day-of-year
    const index = dayOfYear % ideas.length;
    const idea = ideas[index];

    // Render the selected idea into the card
    const card = document.getElementById('idea-card');
    card.innerHTML = '';

    function addRow(label, value) {
      const row = document.createElement('div');
      row.className = 'row';
      const lbl = document.createElement('span');
      lbl.className = 'label';
      lbl.textContent = label + ':';
      const val = document.createElement('span');
      val.className = 'value';
      val.textContent = value;
      row.appendChild(lbl);
      row.appendChild(val);
      card.appendChild(row);
    }

    addRow('Idea', idea['Idea']);
    addRow('Source', idea['Source']);
    // Format market size with commas
    const marketSize = Number(idea['Market Size (₩)']);
    const formattedMarket = isNaN(marketSize) ? idea['Market Size (₩)'] : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KRW', minimumFractionDigits: 0 }).format(marketSize);
    addRow('Market Size', formattedMarket);
    addRow('Competition (1-10)', idea['Competition (1-10)']);
    addRow('Execution Difficulty (1-10)', idea['Execution Difficulty (1-10)']);
    addRow('Korean Fit', idea['Korean Fit Notes']);
  } catch (err) {
    const card = document.getElementById('idea-card');
    card.textContent = `Error: ${err.message}`;
    console.error(err);
  }
}

// Kick off when the DOM is ready
document.addEventListener('DOMContentLoaded', loadIdeaOfTheDay);