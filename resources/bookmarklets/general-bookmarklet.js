/**
 * General-Purpose Bookmarklet for creating quote posts
 * Works on any website (not just Feedly)
 * Source: This file is the development source for the general-purpose bookmarklet
 *
 * Instructions:
 * 1. Create a new bookmark in your browser
 * 2. Name it: "Create Quote Post"
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
 * Minified bookmarklet (copy everything after javascript:):
 */

/* javascript:!function(){function t(t){return t.replace(/"/g,'\\"')}const e=function(){const t={author:null,title:null,date:null,url:window.location.href,selectedText:null};function e(t){for(const e of t){const t=document.querySelector(e);if(t&&t.getAttribute("content"))return t.getAttribute("content").trim()}return null}const n=e(['meta[name="author"]','meta[property="article:author"]','meta[name="creator"]','meta[property="og:author"]']);if(n)t.author=n;else{const n=e(['meta[property="og:site_name"]','meta[name="application-name"]','meta[name="apple-mobile-web-app-title"]']);t.author=n||"Unknown"}const o=e(['meta[property="og:title"]','meta[property="twitter:title"]','meta[name="title"]']);if(o)t.title=o;else{const e=document.querySelector("title");t.title=e?e.innerText.trim():""}const a=e(['meta[property="article:published_time"]','meta[property="datePublished"]','meta[name="publish_date"]','meta[name="date"]']);if(a){const e=a.match(/(\d{4}-\d{2}-\d{2})/);t.date=e?e[1]:null}t.date||(t.date=(new Date).toISOString().split("T")[0]);const r=window.getSelection();r.toString().trim()&&(t.selectedText=r.toString().trim());const i=document.querySelectorAll('meta[property="article:tag"]'),p=[];for(const t of i){const e=t.getAttribute("content");e&&e.trim()&&p.push(e.trim())}return t.tags=p,t}();!function(e){const n="qpb-styles";if(!document.getElementById(n)){const t=document.createElement("style");t.id=n,t.textContent=".qpb-overlay{position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;background:rgba(0,0,0,.5)!important;z-index:9999!important;pointer-events:none!important}.qpb-overlay *{box-sizing:border-box!important;margin:0!important;padding:0!important;font:inherit!important}.qpb-dialog{position:fixed!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;width:90%!important;max-width:700px!important;max-height:90vh!important;background:#fff!important;border-radius:8px!important;box-shadow:0 4px 20px rgba(0,0,0,.3)!important;z-index:10000!important;padding:20px!important;overflow-y:auto!important;color:#333!important;pointer-events:auto!important}.qpb-dialog h2{margin:0 0 20px 0!important;font-size:20px!important;font-weight:bold!important}.qpb-dialog p{margin:0 0 10px 0!important;font-size:14px!important;color:#666!important}.qpb-dialog label{display:block!important;margin-bottom:5px!important;font-weight:bold!important;font-size:14px!important;color:#333!important}.qpb-dialog textarea{width:100%!important;padding:8px!important;font-size:13px!important;border:1px solid #ddd!important;border-radius:4px!important;resize:vertical!important;color:#333!important;background:#fff!important;font-family:monospace!important}.qpb-command-textarea{height:250px!important;white-space:pre-wrap!important;overflow-wrap:break-word!important;user-select:all!important;margin-bottom:15px!important}.qpb-buttons{display:flex!important;gap:10px!important;margin-top:20px!important}.qpb-btn{flex:1!important;padding:12px!important;border:none!important;border-radius:4px!important;cursor:pointer!important;font-size:14px!important;font-weight:bold!important}.qpb-btn-green{background:#4CAF50!important;color:#fff!important}.qpb-btn-gray{background:#999!important;color:#fff!important}",document.head.appendChild(t)}const o=document.createElement("div");o.className="qpb-overlay";const a=document.createElement("div");a.className="qpb-dialog";const r=document.createElement("h2");r.textContent="Create Quote Post";const i=document.createElement("div"),p=(t,e,n="")=>{const o=document.createElement("div");o.style.marginBottom="15px !important";const a=document.createElement("label");a.textContent=t;const r=document.createElement("textarea");return r.value=e||"",r.placeholder=n,r.style.minHeight="Quote"===t||"Commentary"===t?"100px !important":"40px !important",r.style.fontFamily="Quote"===t||"Commentary"===t?"monospace !important":"inherit !important",o.appendChild(a),o.appendChild(r),{container:o,input:r}},m=p("Author",e.author),l=p("Source URL",e.url),d=p("Article Title",e.title),c=p("Publication Date (YYYY-MM-DD)",e.date),u=p("Tags (comma-separated)",(e.tags||[]).join(", ")),s=p("Quote",e.selectedText||e.highlights?.join("\n\n")||"","Highlight and click the bookmark to capture text..."),b=p("Your Commentary",e.comments?.join("\n\n")||"","Enter or edit your commentary...");i.appendChild(m.container),i.appendChild(l.container),i.appendChild(d.container),i.appendChild(c.container),i.appendChild(u.container),i.appendChild(s.container),i.appendChild(b.container);const h=document.createElement("div");h.className="qpb-buttons";const g=document.createElement("button");g.textContent="Generate Command",g.className="qpb-btn qpb-btn-green";const x=document.createElement("button");x.textContent="Cancel",x.className="qpb-btn qpb-btn-gray";const y=()=>{document.body.contains(o)&&document.body.removeChild(o),document.body.contains(a)&&document.body.removeChild(a)};g.onclick=()=>{const e=s.input.value.trim(),n=b.input.value.trim();if(!e&&!n)return void alert("At least one of quote or commentary is required");const o={quote:e,commentary:n,author:m.input.value.trim(),url:l.input.value.trim(),title:d.input.value.trim(),date:c.input.value.trim(),tags:u.input.value.trim()};y(),function(e){const n=function(e,n){let o=`node tools/create-quote-post.js \\\n  --author "${t(e.author)}" \\\n  --url "${e.url}" \\\n  --title "${t(e.title)}" \\\n  --date "${e.date}"`;return n.tags&&(o+=` \\\n  --tags "${t(n.tags)}"`),n.quote&&(o+=` \\\n  --quote "${t(n.quote)}"`),n.commentary&&(o+=` \\\n  --commentary "${t(n.commentary)}"`),o}({author:e.author,url:e.url,title:e.title,date:e.date},{tags:e.tags,quote:e.quote,commentary:e.commentary}),o=document.createElement("div");o.className="qpb-overlay";const a=document.createElement("div");a.className="qpb-dialog",a.style.maxWidth="650px !important";const r=document.createElement("h2");r.textContent="Copy your command";const i=document.createElement("p");i.textContent="Select all text and copy (Ctrl+A then Ctrl+C):";const p=document.createElement("textarea");p.value=n,p.className="qpb-command-textarea",p.style.fontSize="11px !important";const m=document.createElement("div");m.className="qpb-buttons";const l=document.createElement("button");l.textContent="📋 Copy to Clipboard",l.className="qpb-btn qpb-btn-green",l.onclick=async()=>{try{await navigator.clipboard.writeText(n),l.textContent="✓ Copied!",setTimeout(()=>{l.textContent="📋 Copy to Clipboard"},2e3)}catch(t){l.textContent="Copy failed",console.error("Copy failed:",t)}};const d=document.createElement("button");d.textContent="Done",d.className="qpb-btn qpb-btn-gray";const c=()=>{document.body.contains(o)&&document.body.removeChild(o),document.body.contains(a)&&document.body.removeChild(a)};d.onclick=c,o.onclick=c,m.appendChild(l),m.appendChild(d),a.appendChild(r),a.appendChild(i),a.appendChild(p),a.appendChild(m),document.body.appendChild(o),document.body.appendChild(a)}(o)},x.onclick=y,o.onclick=y,h.appendChild(g),h.appendChild(x),a.appendChild(r),a.appendChild(i),a.appendChild(h),document.body.appendChild(o),document.body.appendChild(a)}({author:e.author,url:e.url,title:e.title,date:e.date,selectedText:e.selectedText,highlights:[],comments:[],tags:e.tags||[]})}();
 */

// Non-minified version for development/understanding:

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

  // Capture selected/highlighted text
  const selection = window.getSelection();
  if (selection.toString().trim()) {
    metadata.selectedText = selection.toString().trim();
  }

  // Extract tags from article:tag meta tags
  const tagElements = document.querySelectorAll('meta[property="article:tag"]');
  const tags = [];
  for (const el of tagElements) {
    const tagContent = el.getAttribute("content");
    if (tagContent && tagContent.trim()) {
      tags.push(tagContent.trim());
    }
  }
  metadata.tags = tags;

  return metadata;
}

function showEditForm(data) {
  // Inject CSS to prevent site styles from interfering
  const styleId = "qpb-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `.qpb-overlay{position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;background:rgba(0,0,0,.5)!important;z-index:9999!important;pointer-events:none!important}.qpb-overlay *{box-sizing:border-box!important;margin:0!important;padding:0!important;font:inherit!important}.qpb-dialog{position:fixed!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;width:90%!important;max-width:700px!important;max-height:90vh!important;background:#fff!important;border-radius:8px!important;box-shadow:0 4px 20px rgba(0,0,0,.3)!important;z-index:10000!important;padding:20px!important;overflow-y:auto!important;color:#333!important;pointer-events:auto!important}.qpb-dialog h2{margin:0 0 20px 0!important;font-size:20px!important;font-weight:bold!important}.qpb-dialog p{margin:0 0 10px 0!important;font-size:14px!important;color:#666!important}.qpb-dialog label{display:block!important;margin-bottom:5px!important;font-weight:bold!important;font-size:14px!important;color:#333!important}.qpb-dialog textarea{width:100%!important;padding:8px!important;font-size:13px!important;border:1px solid #ddd!important;border-radius:4px!important;resize:vertical!important;color:#333!important;background:#fff!important;font-family:monospace!important}.qpb-command-textarea{height:250px!important;white-space:pre-wrap!important;overflow-wrap:break-word!important;user-select:all!important;margin-bottom:15px!important}.qpb-buttons{display:flex!important;gap:10px!important;margin-top:20px!important}.qpb-btn{flex:1!important;padding:12px!important;border:none!important;border-radius:4px!important;cursor:pointer!important;font-size:14px!important;font-weight:bold!important}.qpb-btn-green{background:#4CAF50!important;color:#fff!important}.qpb-btn-gray{background:#999!important;color:#fff!important}`;
    document.head.appendChild(style);
  }

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "qpb-overlay";

  // Create dialog
  const dialog = document.createElement("div");
  dialog.className = "qpb-dialog";

  // Title
  const title = document.createElement("h2");
  title.textContent = "Create Quote Post";

  // Form container
  const form = document.createElement("div");

  // Helper to create field
  const createField = (label, value, placeholder = "") => {
    const container = document.createElement("div");
    container.style.marginBottom = "15px !important";
    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    const input = document.createElement("textarea");
    input.value = value || "";
    input.placeholder = placeholder;
    input.style.minHeight = label === "Quote" || label === "Commentary" ? "100px !important" : "40px !important";
    input.style.fontFamily = label === "Quote" || label === "Commentary" ? "monospace !important" : "inherit !important";
    container.appendChild(labelEl);
    container.appendChild(input);
    return { container, input };
  };

  // Create fields
  const authorField = createField("Author", data.author);
  const urlField = createField("Source URL", data.url);
  const titleField = createField("Article Title", data.title);
  const dateField = createField("Publication Date (YYYY-MM-DD)", data.date);
  const tagsField = createField("Tags (comma-separated)", (data.tags || []).join(", "));
  const quoteField = createField("Quote", data.selectedText || data.highlights?.join("\n\n") || "", "Highlight and click the bookmark to capture text...");
  const commentaryField = createField("Your Commentary", data.comments?.join("\n\n") || "", "Enter or edit your commentary...");

  form.appendChild(authorField.container);
  form.appendChild(urlField.container);
  form.appendChild(titleField.container);
  form.appendChild(dateField.container);
  form.appendChild(tagsField.container);
  form.appendChild(quoteField.container);
  form.appendChild(commentaryField.container);

  // Buttons container
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "qpb-buttons";

  // Generate button
  const generateBtn = document.createElement("button");
  generateBtn.textContent = "Generate Command";
  generateBtn.className = "qpb-btn qpb-btn-green";

  // Cancel button
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.className = "qpb-btn qpb-btn-gray";

  // Remove dialog function
  const removeDialog = () => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
    if (document.body.contains(dialog)) {
      document.body.removeChild(dialog);
    }
  };

  generateBtn.onclick = () => {
    const quote = quoteField.input.value.trim();
    const commentary = commentaryField.input.value.trim();

    if (!quote && !commentary) {
      alert("At least one of quote or commentary is required");
      return;
    }

    const content = {
      quote,
      commentary,
      author: authorField.input.value.trim(),
      url: urlField.input.value.trim(),
      title: titleField.input.value.trim(),
      date: dateField.input.value.trim(),
      tags: tagsField.input.value.trim()
    };

    removeDialog();
    showCommandDialog(content);
  };

  cancelBtn.onclick = removeDialog;
  overlay.onclick = removeDialog;

  buttonContainer.appendChild(generateBtn);
  buttonContainer.appendChild(cancelBtn);

  dialog.appendChild(title);
  dialog.appendChild(form);
  dialog.appendChild(buttonContainer);

  document.body.appendChild(overlay);
  document.body.appendChild(dialog);
}

function escapeForBash(str) {
  return str.replace(/"/g, '\\"');
}

function generateCommand(data, content) {
  let cmd = `node tools/create-quote-post.js \\
  --author "${escapeForBash(data.author)}" \\
  --url "${data.url}" \\
  --title "${escapeForBash(data.title)}" \\
  --date "${data.date}"`;

  if (content.tags) {
    cmd += ` \\
  --tags "${escapeForBash(content.tags)}"`;
  }

  if (content.quote) {
    cmd += ` \\
  --quote "${escapeForBash(content.quote)}"`;
  }

  if (content.commentary) {
    cmd += ` \\
  --commentary "${escapeForBash(content.commentary)}"`;
  }

  return cmd;
}

function showCommandDialog(content) {
  const command = generateCommand({
    author: content.author,
    url: content.url,
    title: content.title,
    date: content.date
  }, {
    tags: content.tags,
    quote: content.quote,
    commentary: content.commentary
  });

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "qpb-overlay";

  // Create dialog
  const dialog = document.createElement("div");
  dialog.className = "qpb-dialog";
  dialog.style.maxWidth = "650px !important";

  // Title
  const title = document.createElement("h2");
  title.textContent = "Copy your command";

  // Instructions
  const instructions = document.createElement("p");
  instructions.textContent = "Select all text and copy (Ctrl+A then Ctrl+C):";

  // Textarea with command
  const textarea = document.createElement("textarea");
  textarea.value = command;
  textarea.className = "qpb-command-textarea";
  textarea.style.fontSize = "11px !important";

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "qpb-buttons";

  // Copy to clipboard button
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

  // Done button
  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.className = "qpb-btn qpb-btn-gray";

  // Remove dialog function
  const removeDialog = () => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
    if (document.body.contains(dialog)) {
      document.body.removeChild(dialog);
    }
  };

  doneBtn.onclick = removeDialog;
  overlay.onclick = removeDialog;

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
const metadata = extractMetadata();
showEditForm({
  author: metadata.author,
  url: metadata.url,
  title: metadata.title,
  date: metadata.date,
  selectedText: metadata.selectedText,
  highlights: [],
  comments: [],
  tags: metadata.tags || []
});
