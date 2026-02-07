# Feedly Quote Post Bookmarklet

This bookmarklet extracts article data from Feedly and generates a ready-to-run bash command to create a quote post.

## Installation

1. **Create a new bookmark** in your browser
2. **Name it:** `Create Quote Post` (or whatever you prefer)
3. **Paste this minified bookmarklet as the URL:**

```javascript
javascript:!function(){function e(e){return e.replace(/"/g,'\\"')}!function(t){const n=document.createElement("div");n.style.position="fixed",n.style.top="0",n.style.left="0",n.style.width="100%",n.style.height="100%",n.style.backgroundColor="rgba(0, 0, 0, 0.5)",n.style.zIndex="9999";const o=document.createElement("div");o.style.position="fixed",o.style.top="50%",o.style.left="50%",o.style.transform="translate(-50%, -50%)",o.style.width="90%",o.style.maxWidth="700px",o.style.maxHeight="90vh",o.style.backgroundColor="white",o.style.borderRadius="8px",o.style.boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)",o.style.zIndex="10000",o.style.padding="20px",o.style.fontFamily="sans-serif",o.style.overflowY="auto";const l=document.createElement("h2");l.textContent="Create Quote Post",l.style.margin="0 0 20px 0",l.style.fontSize="20px";const r=document.createElement("div"),a=(e,t,n="")=>{const o=document.createElement("div");o.style.marginBottom="15px";const l=document.createElement("label");l.textContent=e,l.style.display="block",l.style.marginBottom="5px",l.style.fontWeight="bold",l.style.fontSize="14px";const r=document.createElement("textarea");return r.value=t||"",r.placeholder=n,r.style.width="100%",r.style.padding="8px",r.style.fontFamily="Quote"===e||"Commentary"===e?"monospace":"sans-serif",r.style.fontSize="13px",r.style.border="1px solid #ddd",r.style.borderRadius="4px",r.style.boxSizing="border-box",r.style.minHeight="Quote"===e||"Commentary"===e?"100px":"40px",r.style.resize="vertical",o.appendChild(l),o.appendChild(r),{container:o,input:r}},i=a("Author",t.author),s=a("Source URL",t.url),d=a("Article Title",t.title),c=a("Publication Date (YYYY-MM-DD)",t.date),p=a("Tags (comma-separated)",(t.tags||[]).join(", ")),y=a("Quote",t.highlights.join("\n\n"),"Enter or edit the quote..."),u=a("Your Commentary",t.comments.join("\n\n"),"Enter or edit your commentary...");r.appendChild(i.container),r.appendChild(s.container),r.appendChild(d.container),r.appendChild(c.container),r.appendChild(p.container),r.appendChild(y.container),r.appendChild(u.container);const m=document.createElement("div");m.style.display="flex",m.style.gap="10px",m.style.marginTop="20px";const x=document.createElement("button");x.textContent="Generate Command",x.style.flex="1",x.style.padding="12px",x.style.backgroundColor="#4CAF50",x.style.color="white",x.style.border="none",x.style.borderRadius="4px",x.style.cursor="pointer",x.style.fontSize="14px",x.style.fontWeight="bold";const h=document.createElement("button");h.textContent="Cancel",h.style.flex="1",h.style.padding="12px",h.style.backgroundColor="#999",h.style.color="white",h.style.border="none",h.style.borderRadius="4px",h.style.cursor="pointer",h.style.fontSize="14px";const g=()=>{document.body.contains(n)&&document.body.removeChild(n),document.body.contains(o)&&document.body.removeChild(o)};x.onclick=()=>{const t=y.input.value.trim(),n=u.input.value.trim();if(!t&&!n)return void alert("At least one of quote or commentary is required");const o={quote:t,commentary:n,author:i.input.value.trim(),url:s.input.value.trim(),title:d.input.value.trim(),date:c.input.value.trim(),tags:p.input.value.trim()};g(),function(t){const n=function(t,n){let o=`node tools/create-quote-post.js \\\n  --author "${e(t.author)}" \\\n  --url "${t.url}" \\\n  --title "${e(t.title)}" \\\n  --date "${t.date}"`;return n.tags&&(o+=` \\\n  --tags "${e(n.tags)}"`),n.quote&&(o+=` \\\n  --quote "${e(n.quote)}"`),n.commentary&&(o+=` \\\n  --commentary "${e(n.commentary)}"`),o}({author:t.author,url:t.url,title:t.title,date:t.date},{tags:t.tags,quote:t.quote,commentary:t.commentary}),o=document.createElement("div");o.style.position="fixed",o.style.top="0",o.style.left="0",o.style.width="100%",o.style.height="100%",o.style.backgroundColor="rgba(0, 0, 0, 0.5)",o.style.zIndex="9999",o.style.pointerEvents="none";const l=document.createElement("div");l.style.position="fixed",l.style.top="50%",l.style.left="50%",l.style.transform="translate(-50%, -50%)",l.style.width="90%",l.style.maxWidth="650px",l.style.backgroundColor="white",l.style.borderRadius="8px",l.style.boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)",l.style.zIndex="10000",l.style.padding="20px",l.style.fontFamily="sans-serif",l.style.pointerEvents="auto";const r=document.createElement("h2");r.textContent="Copy your command",r.style.margin="0 0 15px 0",r.style.fontSize="18px";const a=document.createElement("p");a.textContent="Select all text and copy (Ctrl+A then Ctrl+C):",a.style.margin="0 0 10px 0",a.style.fontSize="14px",a.style.color="#666";const i=document.createElement("textarea");i.value=n,i.readOnly=!1,i.style.width="100%",i.style.height="250px",i.style.padding="10px",i.style.fontFamily="monospace",i.style.fontSize="11px",i.style.border="1px solid #ddd",i.style.borderRadius="4px",i.style.boxSizing="border-box",i.style.marginBottom="15px",i.style.whiteSpace="pre-wrap",i.style.overflowWrap="break-word",i.style.userSelect="all";const s=document.createElement("div");s.style.display="flex",s.style.gap="10px";const d=document.createElement("button");d.textContent="📋 Copy to Clipboard",d.style.flex="1",d.style.padding="10px 20px",d.style.backgroundColor="#4CAF50",d.style.color="white",d.style.border="none",d.style.borderRadius="4px",d.style.cursor="pointer",d.style.fontSize="14px",d.onclick=async()=>{try{await navigator.clipboard.writeText(n),d.textContent="✓ Copied!",setTimeout(()=>{d.textContent="📋 Copy to Clipboard"},2e3)}catch(e){d.textContent="Copy failed",console.error("Copy failed:",e)}};const c=document.createElement("button");c.textContent="Done",c.style.flex="1",c.style.padding="10px 20px",c.style.backgroundColor="#999",c.style.color="white",c.style.border="none",c.style.borderRadius="4px",c.style.cursor="pointer",c.style.fontSize="14px";const p=()=>{document.body.contains(o)&&document.body.removeChild(o),document.body.contains(l)&&document.body.removeChild(l)};c.onclick=p,o.onclick=p,s.appendChild(d),s.appendChild(c),l.appendChild(r),l.appendChild(a),l.appendChild(i),l.appendChild(s),document.body.appendChild(o),document.body.appendChild(l)}(o)},h.onclick=g,n.onclick=g,m.appendChild(x),m.appendChild(h),o.appendChild(l),o.appendChild(r),o.appendChild(m),document.body.appendChild(n),document.body.appendChild(o)}(function(){const e=document.querySelector("a.ArticleTitle"),t=e?e.innerText:"",n=e?e.href:"";let o="Unknown";const l=document.querySelector("span.authors");l&&(o=l.innerText.replace(/^by\s+/,"").trim());let r=(new Date).toISOString().split("T")[0];const a=document.querySelector(".EntryMetadataWrapper span[title]");if(a){const e=a.getAttribute("title").match(/Published: (\w+),\s+(\d+)\s+(\w+)\s+(\d+)/);if(e){const[t,n,o,l,a]=e,i=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(l)+1;r=`${a}-${String(i).padStart(2,"0")}-${String(o).padStart(2,"0")}`}}function i(e){if("A"===e.tagName&&e.href)return`[${Array.from(e.childNodes).map(e=>3===e.nodeType?e.textContent:e.innerText||e.textContent||"").join("").trim()}](${e.href})`;let t="";return e.childNodes.forEach(e=>{3===e.nodeType?t+=e.textContent:1===e.nodeType&&("A"===e.tagName&&e.href?t+=`[${e.innerText.trim()}](${e.href})`:function(e){return e.classList&&e.classList.contains("TextHighlight")}(e)?t+=i(e):t+=e.innerText)}),t}const s=new Set;document.querySelectorAll('[class~="TextHighlight"]').forEach(e=>{let t=e.parentElement;for(;t&&"P"!==t.tagName;)t=t.parentElement;t&&"P"===t.tagName&&s.add(t)});const d=Array.from(document.querySelectorAll("p")),c=[];d.forEach((e,t)=>{s.has(e)&&c.push(t)});const p=[];c.forEach((e,t)=>{t>0&&e-c[t-1]>1&&p.push("[...]");const n=d[e].querySelectorAll('[class~="TextHighlight"]'),o=Array.from(n),l=[];o.forEach((e,t)=>{let n;n=e.querySelector("a")||"A"===e.tagName?i(e).trim():(e.innerText||"").trim(),n=n.replace(/\s+([,.;:!?\)])/g,"$1"),l.push(n),t<o.length-1&&function(e,t){let n=e.nextSibling;for(;n&&n!==t;){if(3===n.nodeType){if(n.textContent.trim())return!0}else if(1===n.nodeType&&"IMG"!==n.tagName&&"BR"!==n.tagName&&"SCRIPT"!==n.tagName&&"STYLE"!==n.tagName&&n.textContent.trim())return!0;n=n.nextSibling}return!1}(e,o[t+1])&&l.push("...")});let r=l.filter(e=>e).join(" ");r=r.replace(/\s+([,.;:!?\)])/g,"$1"),r&&p.push(r)});const y=document.querySelectorAll("div.Comment__body p.Comment__text"),u=Array.from(y).map(e=>e.innerText.trim()).filter(e=>e);let m=[];const x=document.querySelector(".EntryStackablePrompts");if(x){const e=x.querySelector("strong");if(e){const t=e.innerText.trim();t&&m.push(t)}}return{title:t,url:n,author:o,date:r,highlights:p,comments:u,tags:m}}())}();
```

## Usage

1. **Open a Feedly article** in your browser
2. **Highlight text** and **add notes/comments** in Feedly as you read
3. **Click the bookmark** ("Create Quote Post")
4. **An editable form appears** with all fields pre-filled:
   - Author, Source URL, Article Title, Publication Date
   - Quote (pre-filled with your highlights)
   - Your Commentary (pre-filled with your comments)
5. **Edit any fields** as needed - all fields are fully editable
6. **Click "Generate Command"** when ready
7. **A dialog appears** with your complete bash command
8. **Click "📋 Copy to Clipboard"** to copy the command, or manually select using Ctrl+A then Ctrl+C (Cmd+A, Cmd+C on Mac)
9. **Click Done** to close the dialog
10. **Paste and run** the command in your terminal from your blog's root directory

## What It Extracts

- **Title:** From the article title in Feedly
- **URL:** From the article link
- **Author:** From the article source/publication name
- **Date:** Today's date (you can override after creating the post if needed)
- **Highlights:** Auto-extracts all highlighted text from the article using Feedly's `TextHighlight` class
- **Comments:** Auto-extracts any notes/comments you've added in Feedly
- **Quote:** Pre-filled with highlights, but editable
- **Commentary:** Pre-filled with comments, but editable

## Example Output

When you run the bookmarklet, it generates a command like:

```bash
node tools/create-quote-post.js \
  --author "Ben Thompson" \
  --url "https://stratechery.com/2026/microsoft-and-software-survival/" \
  --title "Microsoft and Software Survival" \
  --date "2026-02-07" \
  --quote "That, then, raises the most obvious bear case..." \
  --commentary "Really interesting perspective on software economics"
```

## Troubleshooting

- **Form doesn't appear:** Make sure JavaScript is enabled in your browser and you're viewing a Feedly article (not a feed list).
- **"Unknown" author:** The bookmarklet couldn't find the author in the page DOM. You can edit the Author field in the form.
- **No highlights/comments extracted:** Make sure you've actually highlighted text and added comments in Feedly before clicking the bookmark. The form will still appear with empty Quote/Commentary fields if needed.
- **Copy button not working:** Try manually selecting the text with Ctrl+A and copying with Ctrl+C (Cmd+A, Cmd+C on Mac). The text is fully selectable in the textarea.
- **Command format issue:** Make sure you're in your blog's root directory when running the command. The script paths are relative to the blog root.

## Updating the Bookmarklet

If you make changes to `feedly-bookmarklet.js`, you need to minify the code:

1. Copy the non-minified code from `feedly-bookmarklet.js` (lines after the "Non-minified version" comment)
2. Use an online minifier like [jscompress.com](https://jscompress.com/) or [minifier.org](https://www.minifier.org/)
3. Prepend `javascript:` to the minified output
4. Replace the bookmark URL with the new minified version

## Notes

- This requires the `create-quote-post.js` script and Node.js to be available in your environment
- Run the command from your blog's root directory
- All fields in the form are editable before generating the command
- The textarea in the final dialog is selectable for easy copying
