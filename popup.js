// Utility to trigger native file download
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

async function exportTabs(format) {
    const purpose = document.getElementById('export-purpose').value || "Project_Research";
    const timestamp = new Date().toLocaleString();
    const tabs = await chrome.tabs.query({ currentWindow: true });
    
    let content = "";
    let filename = `${purpose.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.${format}`;

    // Formatting based on choice
    if (format === 'md') {
        content = `# ${purpose}\n*Exported: ${timestamp}*\n\n` + tabs.map(t => `- [${t.title}](${t.url})`).join('\n');
    } else if (format === 'csv') {
        content = `Purpose,${purpose}\nDate,${timestamp}\n\nTitle,URL\n` + tabs.map(t => `"${t.title.replace(/"/g, '""')}","${t.url}"`).join('\n');
    } else {
        content = `PURPOSE: ${purpose}\nDATE: ${timestamp}\n\n` + tabs.map(t => `${t.title}\n${t.url}\n\n`).join('');
    }

    downloadFile(content, filename);
}

document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => exportTabs(e.target.id.split('-')[1]));
});