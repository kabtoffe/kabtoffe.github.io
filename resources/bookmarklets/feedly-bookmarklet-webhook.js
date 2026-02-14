/**
 * Feedly Bookmarklet for creating quote posts via Webhook
 * Sends data directly to n8n webhook instead of generating a bash command
 *
 * Instructions:
 * 1. Create a new bookmark in your browser
 * 2. Name it: "Create Quote Post (Feedly Webhook)"
 * 3. Paste the minified code below as the URL (starts with javascript:)
 * 4. Visit a Feedly article and click the bookmark
 *
 * Minified bookmarklet (copy everything after javascript:):
 * [MINIFIED VERSION GOES HERE - generate with minifier]
 */

// Non-minified version for development/understanding:

// IMPORTANT: Replace with your actual n8n webhook URL
// Example: https://your-n8n-instance.com/webhook/create-blog-post
const WEBHOOK_URL = "https://your-n8n-instance.com/webhook/your-webhook-id";

function extractFeedlyData() {
  // Extract article title
  const titleEl = document.querySelector("a.ArticleTitle");
  const title = titleEl ? titleEl.innerText : "";
  const url = titleEl ? titleEl.href : "";

  // Extract author from metadata
  let author = "Unknown";
  const authorsSpan = document.querySelector("span.authors");
  if (authorsSpan) {
    author = authorsSpan.innerText.replace(/^by\s+/, "").trim();
  }

  // Fallback: try to get author from source info if still unknown
  if (author === "Unknown") {
    const sourceInfo = document.querySelector(".EntryMetadataBasic__source-info");
    if (sourceInfo) {
      const sourceText = sourceInfo.innerText.trim();
      if (sourceText) {
        author = sourceText;
      }
    }
  }

  // Extract publication date from metadata
  let date = new Date().toISOString().split("T")[0];
  const dateSpan = document.querySelector(".EntryMetadataWrapper span[title]");
  if (dateSpan) {
    const dateText = dateSpan.getAttribute("title");
    const match = dateText.match(/Published: (\w+),\s+(\d+)\s+(\w+)\s+(\d+)/);
    if (match) {
      const [_, _day_name, day, month, year] = match;
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIndex = monthNames.indexOf(month) + 1;
      date = `${year}-${String(monthIndex).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }

  // Helper function to check if element has TextHighlight class (excludes AI variants like TextHighlight--leo)
  function isTextHighlight(element) {
    return element.classList && element.classList.contains("TextHighlight");
  }

  // Helper function to convert HTML with links to markdown
  function htmlToMarkdown(element) {
    // If the element itself is an <a> tag, convert it to markdown link
    if (element.tagName === "A" && element.href) {
      const linkText = Array.from(element.childNodes)
        .map(node => node.nodeType === 3 ? node.textContent : (node.innerText || node.textContent || ""))
        .join("")
        .trim();
      return `[${linkText}](${element.href})`;
    }

    let text = "";
    element.childNodes.forEach(node => {
      if (node.nodeType === 3) { // Text node
        text += node.textContent;
      } else if (node.nodeType === 1) { // Element node
        if (node.tagName === "A" && node.href) {
          text += `[${node.innerText.trim()}](${node.href})`;
        } else if (isTextHighlight(node)) {
          text += htmlToMarkdown(node);
        } else {
          text += node.innerText;
        }
      }
    });
    return text;
  }

  // Extract highlights grouped by paragraph to preserve structure
  const paragraphsWithHighlights = new Set();
  const highlightElements = document.querySelectorAll('[class~="TextHighlight"]');

  // Find all parent paragraphs that contain highlights
  highlightElements.forEach(el => {
    let parent = el.parentElement;
    while (parent && parent.tagName !== "P") {
      parent = parent.parentElement;
    }
    if (parent && parent.tagName === "P") {
      paragraphsWithHighlights.add(parent);
    }
  });

  // Get all paragraphs and find indices of those with highlights
  const allParagraphs = Array.from(document.querySelectorAll('p'));
  const highlightedIndices = [];
  allParagraphs.forEach((p, index) => {
    if (paragraphsWithHighlights.has(p)) {
      highlightedIndices.push(index);
    }
  });

  // Extract and group highlights with [...] between non-consecutive paragraphs
  const highlights = [];
  highlightedIndices.forEach((pIndex, idx) => {
    if (idx > 0 && pIndex - highlightedIndices[idx - 1] > 1) {
      highlights.push("[...]");
    }

    const p = allParagraphs[pIndex];
    const highlightedElements = p.querySelectorAll('[class~="TextHighlight"]');
    const highlightedEls = Array.from(highlightedElements);
    const parts = [];

    highlightedEls.forEach((el, elIdx) => {
      let text;
      if (el.querySelector("a") || el.tagName === "A") {
        text = htmlToMarkdown(el).trim();
      } else {
        text = (el.innerText || "").trim();
      }

      // Clean up spacing before punctuation
      text = text.replace(/\s+([,.;:!?\)])/g, "$1");
      parts.push(text);

      // Check if there's text between this highlight and the next
      if (elIdx < highlightedEls.length - 1) {
        let sibling = el.nextSibling;
        while (sibling && sibling !== highlightedEls[elIdx + 1]) {
          if (sibling.nodeType === 3) { // Text node
            if (sibling.textContent.trim()) {
              parts.push("...");
              break;
            }
          } else if (sibling.nodeType === 1) { // Element node
            if (sibling.tagName !== "IMG" && sibling.tagName !== "BR" &&
                sibling.tagName !== "SCRIPT" && sibling.tagName !== "STYLE" &&
                sibling.textContent.trim()) {
              parts.push("...");
              break;
            }
          }
          sibling = sibling.nextSibling;
        }
      }
    });

    let highlightText = parts.filter(p => p).join(" ");
    // Final cleanup of spacing before punctuation
    highlightText = highlightText.replace(/\s+([,.;:!?\)])/g, "$1");
    if (highlightText) {
      highlights.push(highlightText);
    }
  });

  // Extract notes/comments from Feedly
  const noteElements = document.querySelectorAll("div.Comment__body p.Comment__text");
  const comments = Array.from(noteElements)
    .map(el => el.innerText.trim())
    .filter(text => text);

  // Extract board names as tags
  let boardNames = [];

  // Try to find boards in entry metadata or save locations
  const boardElements = document.querySelectorAll(
    ".EntryMetadataBasic__boards, " +
    ".entry-boards, " +
    "[class*='board'][class*='item'], " +
    ".EntryStackablePrompts strong"
  );

  const seenBoards = new Set();
  for (const el of boardElements) {
    const boardText = el.innerText.trim();
    if (boardText && !seenBoards.has(boardText)) {
      boardNames.push(boardText);
      seenBoards.add(boardText);
    }
  }

  // Fallback: look for any elements with board-related class names
  if (boardNames.length === 0) {
    const allElements = document.querySelectorAll("[class*='board' i]");
    for (const el of allElements) {
      const text = el.innerText.trim();
      // Filter out UI elements and keep only reasonable board names
      if (text && text.length > 0 && text.length < 100 && !seenBoards.has(text)) {
        boardNames.push(text);
        seenBoards.add(text);
      }
    }
  }

  return {
    title,
    url,
    author,
    date,
    highlights,
    comments,
    boardNames
  };
}

function setupStyles() {
  const styleId = "qpb-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `.qpb-overlay{position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;background:rgba(0,0,0,.5)!important;z-index:9999!important;pointer-events:none!important}.qpb-overlay *{box-sizing:border-box!important;margin:0!important;padding:0!important;font:inherit!important}.qpb-dialog{position:fixed!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;width:90%!important;max-width:700px!important;max-height:90vh!important;background:#fff!important;border-radius:8px!important;box-shadow:0 4px 20px rgba(0,0,0,.3)!important;z-index:10000!important;padding:20px!important;overflow-y:auto!important;color:#333!important;pointer-events:auto!important}.qpb-dialog h2{margin:0 0 20px 0!important;font-size:20px!important;font-weight:bold!important}.qpb-dialog p{margin:0 0 10px 0!important;font-size:14px!important;color:#666!important}.qpb-dialog label{display:block!important;margin-bottom:5px!important;font-weight:bold!important;font-size:14px!important;color:#333!important}.qpb-dialog textarea{width:100%!important;padding:8px!important;font-size:13px!important;border:1px solid #ddd!important;border-radius:4px!important;resize:vertical!important;color:#333!important;background:#fff!important;font-family:monospace!important}.qpb-command-textarea{height:250px!important;white-space:pre-wrap!important;overflow-wrap:break-word!important;user-select:all!important;margin-bottom:15px!important}.qpb-buttons{display:flex!important;gap:10px!important;margin-top:20px!important}.qpb-btn{flex:1!important;padding:12px!important;border:none!important;border-radius:4px!important;cursor:pointer!important;font-size:14px!important;font-weight:bold!important}.qpb-btn-green{background:#4CAF50!important;color:#fff!important}.qpb-btn-blue{background:#2196F3!important;color:#fff!important}.qpb-btn-gray{background:#999!important;color:#fff!important}.qpb-status{padding:10px!important;border-radius:4px!important;margin-top:10px!important;text-align:center!important;font-weight:bold!important}.qpb-status-success{background:#d4edda!important;color:#155724!important;border:1px solid #c3e6cb!important}.qpb-status-error{background:#f8d7da!important;color:#721c24!important;border:1px solid #f5c6cb!important}`;
    document.head.appendChild(style);
  }
}

function closeDialog(overlay, dialog) {
  if (document.body.contains(overlay)) {
    document.body.removeChild(overlay);
  }
  if (document.body.contains(dialog)) {
    document.body.removeChild(dialog);
  }
}

function buildPayload(formData) {
  const payload = {
    url: formData.url
  };

  if (formData.author && formData.author !== "Unknown") {
    payload.author = formData.author;
  }
  if (formData.title) {
    payload.title = formData.title;
  }
  if (formData.date) {
    payload.date = formData.date;
  }

  const quote = formData.quote?.trim();
  const commentary = formData.commentary?.trim();

  if (!quote && !commentary) {
    throw new Error("At least one of quote or commentary is required");
  }

  if (quote) {
    payload.quote = quote;
  }
  if (commentary) {
    payload.commentary = commentary;
  }

  if (formData.tags) {
    payload.tags = formData.tags;
  }

  return payload;
}

function sendToWebhook(payload, statusEl, sendBtn) {
  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json().catch(() => ({})); // Some endpoints don't return JSON
    })
    .then(data => {
      statusEl.className = "qpb-status qpb-status-success";
      statusEl.textContent = "✓ Sent successfully! Your post is being created...";
      sendBtn.textContent = "Send to Webhook";
      sendBtn.disabled = false;
    })
    .catch(error => {
      statusEl.className = "qpb-status qpb-status-error";
      statusEl.textContent = `✗ Error: ${error.message}`;
      sendBtn.textContent = "Send to Webhook";
      sendBtn.disabled = false;
    });
}

function showDialog(feedlyData) {
  setupStyles();

  const overlay = document.createElement("div");
  overlay.className = "qpb-overlay";

  const dialog = document.createElement("div");
  dialog.className = "qpb-dialog";

  const title = document.createElement("h2");
  title.textContent = "Create Quote Post from Feedly";

  const form = document.createElement("div");

  // Helper to create form fields
  function createField(label, value, placeholder = "") {
    const container = document.createElement("div");
    container.style.marginBottom = "15px !important";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;

    const textarea = document.createElement("textarea");
    textarea.value = value || "";
    textarea.placeholder = placeholder;
    textarea.style.minHeight = ["Quote", "Commentary"].includes(label)
      ? "100px !important"
      : "40px !important";
    textarea.style.fontFamily = ["Quote", "Commentary"].includes(label)
      ? "monospace !important"
      : "inherit !important";

    container.appendChild(labelEl);
    container.appendChild(textarea);

    return { container, input: textarea };
  }

  const authorField = createField("Author", feedlyData.author);
  const urlField = createField("Source URL", feedlyData.url);
  const titleField = createField("Article Title", feedlyData.title);
  const dateField = createField("Publication Date (YYYY-MM-DD)", feedlyData.date);
  const tagsField = createField("Tags (comma-separated)", (feedlyData.boardNames || []).join(", "));
  const quoteField = createField(
    "Quote",
    feedlyData.highlights?.join("\n\n") || "",
    "Feedly highlights will appear here..."
  );
  const commentaryField = createField(
    "Your Commentary",
    feedlyData.comments?.join("\n\n") || "",
    "Feedly notes will appear here..."
  );

  form.appendChild(authorField.container);
  form.appendChild(urlField.container);
  form.appendChild(titleField.container);
  form.appendChild(dateField.container);
  form.appendChild(tagsField.container);
  form.appendChild(quoteField.container);
  form.appendChild(commentaryField.container);

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "qpb-buttons";

  const statusEl = document.createElement("div");
  statusEl.style.display = "none";

  const sendWebhookBtn = document.createElement("button");
  sendWebhookBtn.textContent = "Send to Webhook";
  sendWebhookBtn.className = "qpb-btn qpb-btn-blue";

  const generateCmdBtn = document.createElement("button");
  generateCmdBtn.textContent = "Generate Command";
  generateCmdBtn.className = "qpb-btn qpb-btn-green";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.className = "qpb-btn qpb-btn-gray";

  const cleanup = () => closeDialog(overlay, dialog);

  sendWebhookBtn.onclick = () => {
    try {
      const quote = quoteField.input.value.trim();
      const commentary = commentaryField.input.value.trim();

      if (!quote && !commentary) {
        alert("At least one of quote or commentary is required");
        return;
      }

      const payload = {
        quote: quote,
        commentary: commentary,
        author: authorField.input.value.trim(),
        url: urlField.input.value.trim(),
        title: titleField.input.value.trim(),
        date: dateField.input.value.trim(),
        tags: tagsField.input.value.trim()
      };

      // Build and validate payload
      const cleanPayload = buildPayload(payload);

      // Show status
      statusEl.style.display = "block";
      statusEl.className = "qpb-status";
      statusEl.textContent = "Sending...";

      // Send webhook
      sendToWebhook(cleanPayload, statusEl, sendWebhookBtn);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  generateCmdBtn.onclick = () => {
    try {
      const quote = quoteField.input.value.trim();
      const commentary = commentaryField.input.value.trim();

      if (!quote && !commentary) {
        alert("At least one of quote or commentary is required");
        return;
      }

      const formData = {
        quote: quote,
        commentary: commentary,
        author: authorField.input.value.trim(),
        url: urlField.input.value.trim(),
        title: titleField.input.value.trim(),
        date: dateField.input.value.trim(),
        tags: tagsField.input.value.trim()
      };

      cleanup();
      showCommandDialog(formData);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  cancelBtn.onclick = cleanup;
  overlay.onclick = cleanup;

  buttonContainer.appendChild(sendWebhookBtn);
  buttonContainer.appendChild(generateCmdBtn);
  buttonContainer.appendChild(cancelBtn);

  dialog.appendChild(title);
  dialog.appendChild(form);
  dialog.appendChild(statusEl);
  dialog.appendChild(buttonContainer);

  document.body.appendChild(overlay);
  document.body.appendChild(dialog);
}

function showCommandDialog(formData) {
  setupStyles();

  function escapeQuotes(str) {
    return str.replace(/"/g, '\\"');
  }

  // Build bash command
  let command = `node tools/create-quote-post.js \\\n  --author "${escapeQuotes(
    formData.author
  )}" \\\n  --url "${formData.url}" \\\n  --title "${escapeQuotes(formData.title)}" \\\n  --date "${formData.date}"`;

  if (formData.tags) {
    command += ` \\\n  --tags "${escapeQuotes(formData.tags)}"`;
  }
  if (formData.quote) {
    command += ` \\\n  --quote "${escapeQuotes(formData.quote)}"`;
  }
  if (formData.commentary) {
    command += ` \\\n  --commentary "${escapeQuotes(formData.commentary)}"`;
  }

  const overlay = document.createElement("div");
  overlay.className = "qpb-overlay";

  const dialog = document.createElement("div");
  dialog.className = "qpb-dialog";
  dialog.style.maxWidth = "650px !important";

  const title = document.createElement("h2");
  title.textContent = "Copy your command";

  const instructions = document.createElement("p");
  instructions.textContent = "Select all text and copy (Ctrl+A then Ctrl+C):";

  const textarea = document.createElement("textarea");
  textarea.value = command;
  textarea.className = "qpb-command-textarea";
  textarea.style.fontSize = "11px !important";

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "qpb-buttons";

  const copyBtn = document.createElement("button");
  copyBtn.textContent = "📋 Copy to Clipboard";
  copyBtn.className = "qpb-btn qpb-btn-green";
  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(command);
      copyBtn.textContent = "✓ Copied!";
      setTimeout(() => {
        copyBtn.textContent = "📋 Copy to Clipboard";
      }, 2000);
    } catch (err) {
      copyBtn.textContent = "Copy failed";
      console.error("Copy failed:", err);
    }
  };

  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.className = "qpb-btn qpb-btn-gray";

  const cleanup = () => closeDialog(overlay, dialog);
  doneBtn.onclick = cleanup;
  overlay.onclick = cleanup;

  buttonContainer.appendChild(copyBtn);
  buttonContainer.appendChild(doneBtn);

  dialog.appendChild(title);
  dialog.appendChild(instructions);
  dialog.appendChild(textarea);
  dialog.appendChild(buttonContainer);

  document.body.appendChild(overlay);
  document.body.appendChild(dialog);
}

// Main execution
!function() {
  const feedlyData = extractFeedlyData();
  showDialog(feedlyData);
}();
