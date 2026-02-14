/**
 * General-Purpose Bookmarklet for creating quote posts via Webhook
 * Works on any website (not just Feedly)
 * Sends data directly to n8n webhook instead of generating a bash command
 *
 * Instructions:
 * 1. Create a new bookmark in your browser
 * 2. Name it: "Create Quote Post (Webhook)"
 * 3. Paste the minified code below as the URL (starts with javascript:)
 * 4. Visit any article and click the bookmark
 * 5. Highlight text in the article BEFORE clicking the bookmark to auto-capture it
 *
 * The bookmarklet will extract:
 * - Author from meta tags (og:author, article:author, etc.)
 * - Title from meta tags or <title> tag
 * - Publication date from article meta tags
 * - Any text you've highlighted/selected when clicking the bookmark
 *
 * Then send to webhook: https://n8n.kabtoffe.net/webhook-test/create-blog-post-970e762d-39fc-44a5-a015-907d7c111320
 *
 * Minified bookmarklet (copy everything after javascript:):
 * [MINIFIED VERSION GOES HERE - generate with minifier]
 */

// Non-minified version for development/understanding:

// IMPORTANT: Replace with your actual n8n webhook URL
// Example: https://your-n8n-instance.com/webhook/create-blog-post
const WEBHOOK_URL = "https://your-n8n-instance.com/webhook/your-webhook-id";

function extractMetadata() {
  // Extract from meta tags (same pattern as create-quote-post.js)
  const metadata = {
    author: null,
    title: null,
    date: null,
    url: window.location.href,
    selectedText: null
  };

  // Helper to extract from meta tags
  function getMetaContent(patterns) {
    for (const pattern of patterns) {
      const el = document.querySelector(pattern);
      if (el && el.getAttribute("content")) {
        return el.getAttribute("content").trim();
      }
    }
    return null;
  }

  // Extract author
  const authorMeta = getMetaContent([
    'meta[name="author"]',
    'meta[property="article:author"]',
    'meta[name="creator"]',
    'meta[property="og:author"]'
  ]);

  if (authorMeta) {
    metadata.author = authorMeta;
  } else {
    // Fallback: site name
    const siteName = getMetaContent([
      'meta[property="og:site_name"]',
      'meta[name="application-name"]',
      'meta[name="apple-mobile-web-app-title"]'
    ]);
    metadata.author = siteName || "Unknown";
  }

  // Extract title
  const titleMeta = getMetaContent([
    'meta[property="og:title"]',
    'meta[property="twitter:title"]',
    'meta[name="title"]'
  ]);

  if (titleMeta) {
    metadata.title = titleMeta;
  } else {
    // Fallback: <title> tag
    const titleEl = document.querySelector("title");
    metadata.title = titleEl ? titleEl.innerText.trim() : "";
  }

  // Extract publication date
  const dateMeta = getMetaContent([
    'meta[property="article:published_time"]',
    'meta[property="datePublished"]',
    'meta[name="publish_date"]',
    'meta[name="date"]'
  ]);

  if (dateMeta) {
    // Extract YYYY-MM-DD format (handles ISO format like 2026-02-13 or 2026-02-13T10:30:00)
    const match = dateMeta.match(/(\d{4}-\d{2}-\d{2})/);
    metadata.date = match ? match[1] : null;
  }

  // If no date found, use today
  if (!metadata.date) {
    metadata.date = new Date().toISOString().split("T")[0];
  }

  // Capture highlighted text
  const selection = window.getSelection();
  if (selection.toString().trim()) {
    metadata.selectedText = selection.toString().trim();
  }

  // Extract tags from meta tags
  const tagElements = document.querySelectorAll('meta[property="article:tag"]');
  const tags = [];
  for (const el of tagElements) {
    const content = el.getAttribute("content");
    if (content && content.trim()) {
      tags.push(content.trim());
    }
  }
  metadata.tags = tags;

  return metadata;
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

function showDialog(metadata) {
  setupStyles();

  const overlay = document.createElement("div");
  overlay.className = "qpb-overlay";

  const dialog = document.createElement("div");
  dialog.className = "qpb-dialog";

  const title = document.createElement("h2");
  title.textContent = "Create Quote Post";

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

  const authorField = createField("Author", metadata.author);
  const urlField = createField("Source URL", metadata.url);
  const titleField = createField("Article Title", metadata.title);
  const dateField = createField("Publication Date (YYYY-MM-DD)", metadata.date);
  const tagsField = createField("Tags (comma-separated)", (metadata.tags || []).join(", "));
  const quoteField = createField(
    "Quote",
    metadata.selectedText || "",
    "Highlight and click the bookmark to capture text..."
  );
  const commentaryField = createField(
    "Your Commentary",
    "",
    "Enter or edit your commentary..."
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
  const metadata = extractMetadata();
  showDialog(metadata);
}();
