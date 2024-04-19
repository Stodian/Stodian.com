// This function will fetch the GitHub events
async function fetchGitHubEvents(Stodian) {
    const url = `https://api.github.com/users/${Stodian}/events`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`GitHub API responded with status ${response.status}`);
    }
    return response.json();
}

// This function will count the contributions based on PushEvents
function countContributions(events) {
    const contributionsCount = {};
    for (const event of events) {
        if (event.type === 'PushEvent') {
            const date = new Date(event.created_at).toDateString();
            contributionsCount[date] = (contributionsCount[date] || 0) + 1;
        }
    }
    return contributionsCount;
}

// This function will render the contributions graph
function renderGraph(contributions) {
    const graph = document.getElementById('contribution-graph');
    Object.keys(contributions).forEach(date => {
        const count = contributions[date];
        const level = Math.min(Math.floor(count / 10), 4); // You can adjust the scale as needed
        const cell = document.createElement('div');
        cell.className = `graph-cell color-${level}`;
        cell.title = `${date}: ${count} contributions`;
        graph.appendChild(cell);
    });
}

// This function will render the legend
function renderLegend() {
    const legend = document.getElementById('legend');
    for (let i = 0; i < 5; i++) {
        const item = document.createElement('div');
        item.className = 'legend-item';

        const colorBox = document.createElement('div');
        colorBox.className = `legend-color color-${i}`;
        item.appendChild(colorBox);

        const text = document.createTextNode(i === 0 ? 'Less' : (i === 4 ? 'More' : ''));
        item.appendChild(text);

        legend.appendChild(item);
    }
}

// Main function to orchestrate the fetching, processing, and rendering
async function main(username) {
    try {
        const events = await fetchGitHubEvents(username);
        const contributions = countContributions(events);
        renderGraph(contributions);
        renderLegend();
    } catch (error) {
        console.error('Error in fetching or rendering the graph:', error);
    }
}

// Run the main function with your GitHub username
main('Stodian');
