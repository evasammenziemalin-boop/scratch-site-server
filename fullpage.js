chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tabUrl = new URL(tabs[0].url);
    const match = tabUrl.pathname.match(/\/projects\/(\d+)/);
    if (!match) return alert("Could not detect project ID!");

    const projectId = match[1];
    const apiUrl = `https://api.scratch.mit.edu/projects/${projectId}`;

    fetch(apiUrl, { cache: "no-store" })
        .then(r => r.json())
        .then(json => {
            const notesCredits = json.instructions || "<p>No Notes & Credits found</p>";

            const pageHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${json.title}</title></head>
<body>
${notesCredits}
</body>
</html>
`;

            const blob = new Blob([pageHtml], { type: "text/html" });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, "_blank");
        })
        .catch(e => alert("Error fetching project data."));
});
