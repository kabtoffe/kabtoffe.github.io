/**
 * Feedly Bookmarklet for creating quote posts
 * Source: This file is the authoritative source for the Feedly bookmarklet
 *
 * Instructions:
 * 1. Create a new bookmark in your browser
 * 2. Name it: "Create Quote Post (Feedly)"
 * 3. Paste the minified code below as the URL (starts with javascript:)
 * 4. Visit a Feedly article and click the bookmark
 *
 * Minified bookmarklet (copy everything after javascript:):
 */

/* javascript:!function(){function t(t){return t.replace(/"/g,'\\"')}!function(e){const n="qpb-styles";if(!document.getElementById(n)){const t=document.createElement("style");t.id=n,t.textContent=".qpb-overlay{position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;background:rgba(0,0,0,.5)!important;z-index:9999!important;pointer-events:none!important}.qpb-overlay *{box-sizing:border-box!important;margin:0!important;padding:0!important;font:inherit!important}.qpb-dialog{position:fixed!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;width:90%!important;max-width:700px!important;max-height:90vh!important;background:#fff!important;border-radius:8px!important;box-shadow:0 4px 20px rgba(0,0,0,.3)!important;z-index:10000!important;padding:20px!important;overflow-y:auto!important;color:#333!important;pointer-events:auto!important}.qpb-dialog h2{margin:0 0 20px 0!important;font-size:20px!important;font-weight:bold!important}.qpb-dialog p{margin:0 0 10px 0!important;font-size:14px!important;color:#666!important}.qpb-dialog label{display:block!important;margin-bottom:5px!important;font-weight:bold!important;font-size:14px!important;color:#333!important}.qpb-dialog textarea{width:100%!important;padding:8px!important;font-size:13px!important;border:1px solid #ddd!important;border-radius:4px!important;resize:vertical!important;color:#333!important;background:#fff!important;font-family:monospace!important}.qpb-command-textarea{height:250px!important;white-space:pre-wrap!important;overflow-wrap:break-word!important;user-select:all!important;margin-bottom:15px!important}.qpb-buttons{display:flex!important;gap:10px!important;margin-top:20px!important}.qpb-btn{flex:1!important;padding:12px!important;border:none!important;border-radius:4px!important;cursor:pointer!important;font-size:14px!important;font-weight:bold!important}.qpb-btn-green{background:#4CAF50!important;color:#fff!important}.qpb-btn-gray{background:#999!important;color:#fff!important}",document.head.appendChild(t)}const o=document.createElement("div");o.className="qpb-overlay";const a=document.createElement("div");a.className="qpb-dialog";const r=document.createElement("h2");r.textContent="Create Quote Post";const i=document.createElement("div"),p=(t,e,n="")=>{const o=document.createElement("div");o.style.marginBottom="15px !important";const a=document.createElement("label");a.textContent=t;const r=document.createElement("textarea");return r.value=e||"",r.placeholder=n,r.style.minHeight="Quote"===t||"Commentary"===t?"100px !important":"40px !important",r.style.fontFamily="Quote"===t||"Commentary"===t?"monospace !important":"inherit !important",o.appendChild(a),o.appendChild(r),{container:o,input:r}},m=p("Author",e.author),c=p("Source URL",e.url),l=p("Article Title",e.title),d=p("Publication Date (YYYY-MM-DD)",e.date),s=p("Tags (comma-separated)",(e.tags||[]).join(", ")),u=p("Quote",e.highlights.join("\n\n"),"Enter or edit the quote..."),h=p("Your Commentary",e.comments.join("\n\n"),"Enter or edit your commentary...");i.appendChild(m.container),i.appendChild(c.container),i.appendChild(l.container),i.appendChild(d.container),i.appendChild(s.container),i.appendChild(u.container),i.appendChild(h.container);const b=document.createElement("div");b.className="qpb-buttons";const g=document.createElement("button");g.textContent="Generate Command",g.className="qpb-btn qpb-btn-green";const x=document.createElement("button");x.textContent="Cancel",x.className="qpb-btn qpb-btn-gray";const y=()=>{document.body.contains(o)&&document.body.removeChild(o),document.body.contains(a)&&document.body.removeChild(a)};g.onclick=()=>{const e=u.input.value.trim(),n=h.input.value.trim();if(!e&&!n)return void alert("At least one of quote or commentary is required");const o={quote:e,commentary:n,author:m.input.value.trim(),url:c.input.value.trim(),title:l.input.value.trim(),date:d.input.value.trim(),tags:s.input.value.trim()};y(),function(e){const n=function(e,n){let o=`node tools/create-quote-post.js \\\n  --author "${t(e.author)}" \\\n  --url "${e.url}" \\\n  --title "${t(e.title)}" \\\n  --date "${e.date}"`;return n.tags&&(o+=` \\\n  --tags "${t(n.tags)}"`),n.quote&&(o+=` \\\n  --quote "${t(n.quote)}"`),n.commentary&&(o+=` \\\n  --commentary "${t(n.commentary)}"`),o}({author:e.author,url:e.url,title:e.title,date:e.date},{tags:e.tags,quote:e.quote,commentary:e.commentary}),o=document.createElement("div");o.className="qpb-overlay";const a=document.createElement("div");a.className="qpb-dialog",a.style.maxWidth="650px !important";const r=document.createElement("h2");r.textContent="Copy your command";const i=document.createElement("p");i.textContent="Select all text and copy (Ctrl+A then Ctrl+C):";const p=document.createElement("textarea");p.value=n,p.readOnly=!1,p.className="qpb-command-textarea",p.style.fontSize="11px !important";const m=document.createElement("div");m.className="qpb-buttons";const c=document.createElement("button");c.textContent="📋 Copy to Clipboard",c.className="qpb-btn qpb-btn-green",c.onclick=async()=>{try{await navigator.clipboard.writeText(n),c.textContent="✓ Copied!",setTimeout(()=>{c.textContent="📋 Copy to Clipboard"},2e3)}catch(t){c.textContent="Copy failed",console.error("Copy failed:",t)}};const l=document.createElement("button");l.textContent="Done",l.className="qpb-btn qpb-btn-gray";const d=()=>{document.body.contains(o)&&document.body.removeChild(o),document.body.contains(a)&&document.body.removeChild(a)};l.onclick=d,o.onclick=d,m.appendChild(c),m.appendChild(l),a.appendChild(r),a.appendChild(i),a.appendChild(p),a.appendChild(m),document.body.appendChild(o),document.body.appendChild(a)}(o)},x.onclick=y,o.onclick=y,b.appendChild(g),b.appendChild(x),a.appendChild(r),a.appendChild(i),a.appendChild(b),document.body.appendChild(o),document.body.appendChild(a)}(function(){const t=document.querySelector("a.ArticleTitle"),e=t?t.innerText:"",n=t?t.href:"";let o="Unknown";const a=document.querySelector("span.authors");a&&(o=a.innerText.replace(/^by\s+/,"").trim());let r=(new Date).toISOString().split("T")[0];const i=document.querySelector(".EntryMetadataWrapper span[title]");if(i){const t=i.getAttribute("title").match(/Published: (\w+),\s+(\d+)\s+(\w+)\s+(\d+)/);if(t){const[e,n,o,a,i]=t,p=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(a)+1;r=`${i}-${String(p).padStart(2,"0")}-${String(o).padStart(2,"0")}`}}function p(t){if("A"===t.tagName&&t.href)return`[${Array.from(t.childNodes).map(t=>3===t.nodeType?t.textContent:t.innerText||t.textContent||"").join("").trim()}](${t.href})`;let e="";return t.childNodes.forEach(t=>{3===t.nodeType?e+=t.textContent:1===t.nodeType&&("A"===t.tagName&&t.href?e+=`[${t.innerText.trim()}](${t.href})`:function(t){return t.classList&&t.classList.contains("TextHighlight")}(t)?e+=p(t):e+=t.innerText)}),e}const m=new Set;document.querySelectorAll('[class~="TextHighlight"]').forEach(t=>{let e=t.parentElement;for(;e&&"P"!==e.tagName;)e=e.parentElement;e&&"P"===e.tagName&&m.add(e)});const c=Array.from(document.querySelectorAll("p")),l=[];c.forEach((t,e)=>{m.has(t)&&l.push(e)});const d=[];l.forEach((t,e)=>{e>0&&t-l[e-1]>1&&d.push("[...]");const n=c[t].querySelectorAll('[class~="TextHighlight"]'),o=Array.from(n),a=[];o.forEach((t,e)=>{let n;n=t.querySelector("a")||"A"===t.tagName?p(t).trim():(t.innerText||"").trim(),n=n.replace(/\s+([,.;:!?\)])/g,"$1"),a.push(n),e<o.length-1&&function(t,e){let n=t.nextSibling;for(;n&&n!==e;){if(3===n.nodeType){if(n.textContent.trim())return!0}else if(1===n.nodeType&&"IMG"!==n.tagName&&"BR"!==n.tagName&&"SCRIPT"!==n.tagName&&"STYLE"!==n.tagName&&n.textContent.trim())return!0;n=n.nextSibling}return!1}(t,o[e+1])&&a.push("...")});let r=a.filter(t=>t).join(" ");r=r.replace(/\s+([,.;:!?\)])/g,"$1"),r&&d.push(r)});const s=document.querySelectorAll("div.Comment__body p.Comment__text"),u=Array.from(s).map(t=>t.innerText.trim()).filter(t=>t);let h=[];const b=document.querySelector(".EntryStackablePrompts");if(b){const t=b.querySelector("strong");if(t){const e=t.innerText.trim();e&&h.push(e)}}return{title:e,url:n,author:o,date:r,highlights:d,comments:u,tags:h}}())}();
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

  // Helper function to check if there's actual text content between two elements
  function hasActualTextBetween(element1, element2) {
    let current = element1.nextSibling;
    while (current && current !== element2) {
      if (current.nodeType === 3) { // Text node
        if (current.textContent.trim()) {
          return true;
        }
      } else if (current.nodeType === 1) { // Element node
        // Skip images and line breaks, but check for text content
        if (current.tagName !== 'IMG' && current.tagName !== 'BR' && current.tagName !== 'SCRIPT' && current.tagName !== 'STYLE') {
          if (current.textContent.trim()) {
            return true;
          }
        }
      }
      current = current.nextSibling;
    }
    return false;
  }

  // Extract text from each paragraph, preserving markdown links within highlights
  const highlights = [];

  highlightedIndices.forEach((index, arrayIndex) => {
    // Add [...] if there are unhighlighted paragraphs between this and the previous highlighted paragraph
    if (arrayIndex > 0) {
      const prevIndex = highlightedIndices[arrayIndex - 1];
      if (index - prevIndex > 1) {
        highlights.push("[...]");
      }
    }

    // Extract highlights from this paragraph
    const p = allParagraphs[index];
    const textHighlights = p.querySelectorAll('[class~="TextHighlight"]');
    const highlightArray = Array.from(textHighlights);
    const parts = [];

    highlightArray.forEach((el, elIndex) => {
      // Check if this highlight element contains links
      const hasLinks = el.querySelector("a");
      let highlightText;
      if (hasLinks || el.tagName === "A") {
        highlightText = htmlToMarkdown(el).trim();
      } else {
        highlightText = (el.innerText || "").trim();
      }
      // Remove spaces before punctuation
      highlightText = highlightText.replace(/\s+([,.;:!?\)])/g, '$1');
      parts.push(highlightText);

      // Check if there's actual text between this highlight and the next one
      if (elIndex < highlightArray.length - 1) {
        const nextEl = highlightArray[elIndex + 1];
        if (hasActualTextBetween(el, nextEl)) {
          parts.push("...");
        }
      }
    });

    let paragraphHighlights = parts.filter(h => h).join(" ");
    // Remove spaces before punctuation in the final joined text
    paragraphHighlights = paragraphHighlights.replace(/\s+([,.;:!?\)])/g, '$1');
    if (paragraphHighlights) {
      highlights.push(paragraphHighlights);
    }
  });

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
  textarea.readOnly = false;
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
const feedlyData = extractFeedlyData();
showEditForm(feedlyData);
