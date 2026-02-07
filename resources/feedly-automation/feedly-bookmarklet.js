/**
 * Feedly Bookmarklet for creating quote posts
 *
 * Instructions:
 * 1. Create a new bookmark in your browser
 * 2. Name it: "Create Quote Post"
 * 3. Paste the minified code below as the URL (starts with javascript:)
 * 4. Visit a Feedly article and click the bookmark
 *
 * Minified bookmarklet (copy everything after javascript:):
 * javascript:(function(){function extractFeedly(){const titleEl=document.querySelector("a.ArticleTitle");const title=titleEl?titleEl.innerText:"";const url=titleEl?titleEl.href:"";const sourceEl=document.querySelector("a[data-source-id]")||document.querySelector(".EntrySource");const author=sourceEl?sourceEl.innerText.replace(/\s+/g," ").trim():"Unknown";const date=new Date().toISOString().split("T")[0];return{title,url,author,date};}const data=extractFeedly();const quote=prompt("Paste the quote here (leave empty to skip):","");const commentary=prompt("Add your commentary (leave empty to skip):","");if(!quote&&!commentary){alert("At least one of quote or commentary is required");return;}const cmd=`node scripts/create-quote-post.js --author "${data.author.replace(/"/g,'\\"')}" --url "${data.url}" --title "${data.title.replace(/"/g,'\\"')}" --date "${data.date}"${quote?` --quote "${quote.replace(/"/g,'\\"')}"`:""} ${commentary?`--commentary "${commentary.replace(/"/g,'\\"')}"`:""} `;const output=`${cmd}`;const textarea=document.createElement("textarea");textarea.value=output;textarea.style.position="fixed";textarea.style.top="10px";textarea.style.right="10px";textarea.style.width="400px";textarea.style.height="150px";textarea.style.zIndex="10000";textarea.style.fontFamily="monospace";textarea.style.fontSize="12px";textarea.style.padding="10px";textarea.style.border="2px solid #333";textarea.style.borderRadius="4px";textarea.style.backgroundColor="#f0f0f0";document.body.appendChild(textarea);textarea.select();document.execCommand("copy");const msg=document.createElement("div");msg.textContent="✓ Command copied to clipboard!";msg.style.position="fixed";msg.style.top="10px";msg.style.left="10px";msg.style.padding="10px 20px";msg.style.backgroundColor="#4CAF50";msg.style.color="white";msg.style.borderRadius="4px";msg.style.zIndex="10001";msg.style.fontFamily="sans-serif";document.body.appendChild(msg);setTimeout(()=>{document.body.removeChild(textarea);document.body.removeChild(msg);},3000);})();
 */

// Non-minified version for development/understanding:

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

  // Extract highlights grouped by paragraph to preserve structure
  const paragraphsWithHighlights = new Set();
  const highlightElements = document.querySelectorAll(".TextHighlight");

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

  // Extract text from each paragraph, joining highlights within it with spaces
  const highlights = Array.from(paragraphsWithHighlights).map(p => {
    const textHighlights = p.querySelectorAll(".TextHighlight");
    return Array.from(textHighlights).map(el => el.innerText.trim()).filter(h => h).join(" ");
  }).filter(h => h);

  // Extract comments/notes
  const commentElements = document.querySelectorAll("div.Comment__body p.Comment__text");
  const comments = Array.from(commentElements).map(el => el.innerText.trim()).filter(c => c);

  // Extract board names from "You saved this article to the [Board Name] board" text
  let tags = [];
  const boardContainer = document.querySelector(".EntryStackablePrompts");
  if (boardContainer) {
    const boardNameElement = boardContainer.querySelector("strong");
    if (boardNameElement) {
      const boardName = boardNameElement.innerText.trim();
      if (boardName) {
        tags.push(boardName);
      }
    }
  }

  return { title, url, author, date, highlights, comments, tags };
}

function showEditForm(data) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9999";

  // Create dialog
  const dialog = document.createElement("div");
  dialog.style.position = "fixed";
  dialog.style.top = "50%";
  dialog.style.left = "50%";
  dialog.style.transform = "translate(-50%, -50%)";
  dialog.style.width = "90%";
  dialog.style.maxWidth = "700px";
  dialog.style.maxHeight = "90vh";
  dialog.style.backgroundColor = "white";
  dialog.style.borderRadius = "8px";
  dialog.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
  dialog.style.zIndex = "10000";
  dialog.style.padding = "20px";
  dialog.style.fontFamily = "sans-serif";
  dialog.style.overflowY = "auto";

  // Title
  const title = document.createElement("h2");
  title.textContent = "Create Quote Post";
  title.style.margin = "0 0 20px 0";
  title.style.fontSize = "20px";

  // Form container
  const form = document.createElement("div");

  // Helper to create field
  const createField = (label, value, placeholder = "") => {
    const container = document.createElement("div");
    container.style.marginBottom = "15px";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    labelEl.style.display = "block";
    labelEl.style.marginBottom = "5px";
    labelEl.style.fontWeight = "bold";
    labelEl.style.fontSize = "14px";

    const input = document.createElement("textarea");
    input.value = value || "";
    input.placeholder = placeholder;
    input.style.width = "100%";
    input.style.padding = "8px";
    input.style.fontFamily = label === "Quote" || label === "Commentary" ? "monospace" : "sans-serif";
    input.style.fontSize = "13px";
    input.style.border = "1px solid #ddd";
    input.style.borderRadius = "4px";
    input.style.boxSizing = "border-box";
    input.style.minHeight = label === "Quote" || label === "Commentary" ? "100px" : "40px";
    input.style.resize = "vertical";

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
  const quoteField = createField("Quote", data.highlights.join("\n\n"), "Enter or edit the quote...");
  const commentaryField = createField("Your Commentary", data.comments.join("\n\n"), "Enter or edit your commentary...");

  form.appendChild(authorField.container);
  form.appendChild(urlField.container);
  form.appendChild(titleField.container);
  form.appendChild(dateField.container);
  form.appendChild(tagsField.container);
  form.appendChild(quoteField.container);
  form.appendChild(commentaryField.container);

  // Buttons container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "10px";
  buttonContainer.style.marginTop = "20px";

  // Generate button
  const generateBtn = document.createElement("button");
  generateBtn.textContent = "Generate Command";
  generateBtn.style.flex = "1";
  generateBtn.style.padding = "12px";
  generateBtn.style.backgroundColor = "#4CAF50";
  generateBtn.style.color = "white";
  generateBtn.style.border = "none";
  generateBtn.style.borderRadius = "4px";
  generateBtn.style.cursor = "pointer";
  generateBtn.style.fontSize = "14px";
  generateBtn.style.fontWeight = "bold";

  // Cancel button
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.flex = "1";
  cancelBtn.style.padding = "12px";
  cancelBtn.style.backgroundColor = "#999";
  cancelBtn.style.color = "white";
  cancelBtn.style.border = "none";
  cancelBtn.style.borderRadius = "4px";
  cancelBtn.style.cursor = "pointer";
  cancelBtn.style.fontSize = "14px";

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
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9999";
  overlay.style.pointerEvents = "none";

  // Create dialog
  const dialog = document.createElement("div");
  dialog.style.position = "fixed";
  dialog.style.top = "50%";
  dialog.style.left = "50%";
  dialog.style.transform = "translate(-50%, -50%)";
  dialog.style.width = "90%";
  dialog.style.maxWidth = "650px";
  dialog.style.backgroundColor = "white";
  dialog.style.borderRadius = "8px";
  dialog.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
  dialog.style.zIndex = "10000";
  dialog.style.padding = "20px";
  dialog.style.fontFamily = "sans-serif";
  dialog.style.pointerEvents = "auto";

  // Title
  const title = document.createElement("h2");
  title.textContent = "Copy your command";
  title.style.margin = "0 0 15px 0";
  title.style.fontSize = "18px";

  // Instructions
  const instructions = document.createElement("p");
  instructions.textContent = "Select all text and copy (Ctrl+A then Ctrl+C):";
  instructions.style.margin = "0 0 10px 0";
  instructions.style.fontSize = "14px";
  instructions.style.color = "#666";

  // Textarea with command
  const textarea = document.createElement("textarea");
  textarea.value = command;
  textarea.readOnly = false;
  textarea.style.width = "100%";
  textarea.style.height = "250px";
  textarea.style.padding = "10px";
  textarea.style.fontFamily = "monospace";
  textarea.style.fontSize = "11px";
  textarea.style.border = "1px solid #ddd";
  textarea.style.borderRadius = "4px";
  textarea.style.boxSizing = "border-box";
  textarea.style.marginBottom = "15px";
  textarea.style.whiteSpace = "pre-wrap";
  textarea.style.overflowWrap = "break-word";
  textarea.style.userSelect = "all";

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "10px";

  // Copy to clipboard button
  const copyBtn = document.createElement("button");
  copyBtn.textContent = "📋 Copy to Clipboard";
  copyBtn.style.flex = "1";
  copyBtn.style.padding = "10px 20px";
  copyBtn.style.backgroundColor = "#4CAF50";
  copyBtn.style.color = "white";
  copyBtn.style.border = "none";
  copyBtn.style.borderRadius = "4px";
  copyBtn.style.cursor = "pointer";
  copyBtn.style.fontSize = "14px";

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
  doneBtn.style.flex = "1";
  doneBtn.style.padding = "10px 20px";
  doneBtn.style.backgroundColor = "#999";
  doneBtn.style.color = "white";
  doneBtn.style.border = "none";
  doneBtn.style.borderRadius = "4px";
  doneBtn.style.cursor = "pointer";
  doneBtn.style.fontSize = "14px";

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
const feedlyData = extractFeedlyData();
showEditForm(feedlyData);
