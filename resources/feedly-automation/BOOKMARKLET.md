# Feedly Quote Post Bookmarklet

This bookmarklet extracts article data from Feedly and generates a ready-to-run bash command to create a quote post.

## Installation

1. **Create a new bookmark** in your browser
2. **Name it:** `Create Quote Post` (or whatever you prefer)
3. **Paste this minified bookmarklet as the URL:**

```javascript
javascript:(function(){function extractFeedlyData(){const titleEl=document.querySelector("a.ArticleTitle");const title=titleEl?titleEl.innerText:"";const url=titleEl?titleEl.href:"";let author="Unknown";const authorsSpan=document.querySelector("span.authors");if(authorsSpan){author=authorsSpan.innerText.replace(/^by\s+/,"").trim();}let date=new Date().toISOString().split("T")[0];const dateSpan=document.querySelector(".EntryMetadataWrapper span[title]");if(dateSpan){const dateText=dateSpan.getAttribute("title");const match=dateText.match(/Published: (\w+),\s+(\d+)\s+(\w+)\s+(\d+)/);if(match){const[_,_day_name,day,month,year]=match;const monthNames=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];const monthIndex=monthNames.indexOf(month)+1;date=`${year}-${String(monthIndex).padStart(2,"0")}-${String(day).padStart(2,"0")}`;};}const paragraphsWithHighlights=new Set();const highlightElements=document.querySelectorAll(".TextHighlight");highlightElements.forEach(el=>{let parent=el.parentElement;while(parent&&parent.tagName!=="P"){parent=parent.parentElement;}if(parent&&parent.tagName==="P"){paragraphsWithHighlights.add(parent);}});const highlights=Array.from(paragraphsWithHighlights).map(p=>{const textHighlights=p.querySelectorAll(".TextHighlight");return Array.from(textHighlights).map(el=>el.innerText.trim()).filter(h=>h).join(" ");}).filter(h=>h);const commentElements=document.querySelectorAll("div.Comment__body p.Comment__text");const comments=Array.from(commentElements).map(el=>el.innerText.trim()).filter(c=>c);let tags=[];const boardContainer=document.querySelector(".EntryStackablePrompts");if(boardContainer){const boardNameElement=boardContainer.querySelector("strong");if(boardNameElement){const boardName=boardNameElement.innerText.trim();if(boardName){tags.push(boardName);}}}return{title,url,author,date,highlights,comments,tags};}function escapeForBash(str){return str.replace(/"/g,'\\"');}function generateCommand(data,content){let cmd=`node tools/create-quote-post.js \\\n  --author "${escapeForBash(data.author)}" \\\n  --url "${data.url}" \\\n  --title "${escapeForBash(data.title)}" \\\n  --date "${data.date}"`;if(content.tags){cmd+=` \\\n  --tags "${escapeForBash(content.tags)}"`;}if(content.quote){cmd+=` \\\n  --quote "${escapeForBash(content.quote)}"`;}if(content.commentary){cmd+=` \\\n  --commentary "${escapeForBash(content.commentary)}"`;}return cmd;}function showEditForm(data){const overlay=document.createElement("div");overlay.style.position="fixed";overlay.style.top="0";overlay.style.left="0";overlay.style.width="100%";overlay.style.height="100%";overlay.style.backgroundColor="rgba(0, 0, 0, 0.5)";overlay.style.zIndex="9999";const dialog=document.createElement("div");dialog.style.position="fixed";dialog.style.top="50%";dialog.style.left="50%";dialog.style.transform="translate(-50%, -50%)";dialog.style.width="90%";dialog.style.maxWidth="700px";dialog.style.maxHeight="90vh";dialog.style.backgroundColor="white";dialog.style.borderRadius="8px";dialog.style.boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)";dialog.style.zIndex="10000";dialog.style.padding="20px";dialog.style.fontFamily="sans-serif";dialog.style.overflowY="auto";const title=document.createElement("h2");title.textContent="Create Quote Post";title.style.margin="0 0 20px 0";title.style.fontSize="20px";const form=document.createElement("div");const createField=(label,value,placeholder="")=>{const container=document.createElement("div");container.style.marginBottom="15px";const labelEl=document.createElement("label");labelEl.textContent=label;labelEl.style.display="block";labelEl.style.marginBottom="5px";labelEl.style.fontWeight="bold";labelEl.style.fontSize="14px";const input=document.createElement("textarea");input.value=value||"";input.placeholder=placeholder;input.style.width="100%";input.style.padding="8px";input.style.fontFamily=label==="Quote"||label==="Commentary"?"monospace":"sans-serif";input.style.fontSize="13px";input.style.border="1px solid #ddd";input.style.borderRadius="4px";input.style.boxSizing="border-box";input.style.minHeight=label==="Quote"||label==="Commentary"?"100px":"40px";input.style.resize="vertical";container.appendChild(labelEl);container.appendChild(input);return{container,input};};const authorField=createField("Author",data.author);const urlField=createField("Source URL",data.url);const titleField=createField("Article Title",data.title);const dateField=createField("Publication Date (YYYY-MM-DD)",data.date);const tagsField=createField("Tags (comma-separated)",(data.tags||[]).join(", "));const quoteField=createField("Quote",data.highlights.join("\n\n"),"Enter or edit the quote...");const commentaryField=createField("Your Commentary",data.comments.join("\n\n"),"Enter or edit your commentary...");form.appendChild(authorField.container);form.appendChild(urlField.container);form.appendChild(titleField.container);form.appendChild(dateField.container);form.appendChild(tagsField.container);form.appendChild(quoteField.container);form.appendChild(commentaryField.container);const buttonContainer=document.createElement("div");buttonContainer.style.display="flex";buttonContainer.style.gap="10px";buttonContainer.style.marginTop="20px";const generateBtn=document.createElement("button");generateBtn.textContent="Generate Command";generateBtn.style.flex="1";generateBtn.style.padding="12px";generateBtn.style.backgroundColor="#4CAF50";generateBtn.style.color="white";generateBtn.style.border="none";generateBtn.style.borderRadius="4px";generateBtn.style.cursor="pointer";generateBtn.style.fontSize="14px";generateBtn.style.fontWeight="bold";const cancelBtn=document.createElement("button");cancelBtn.textContent="Cancel";cancelBtn.style.flex="1";cancelBtn.style.padding="12px";cancelBtn.style.backgroundColor="#999";cancelBtn.style.color="white";cancelBtn.style.border="none";cancelBtn.style.borderRadius="4px";cancelBtn.style.cursor="pointer";cancelBtn.style.fontSize="14px";const removeDialog=()=>{if(document.body.contains(overlay)){document.body.removeChild(overlay);}if(document.body.contains(dialog)){document.body.removeChild(dialog);}};generateBtn.onclick=()=>{const quote=quoteField.input.value.trim();const commentary=commentaryField.input.value.trim();if(!quote&&!commentary){alert("At least one of quote or commentary is required");return;}const content={quote,commentary,author:authorField.input.value.trim(),url:urlField.input.value.trim(),title:titleField.input.value.trim(),date:dateField.input.value.trim(),tags:tagsField.input.value.trim()};removeDialog();showCommandDialog(content);};cancelBtn.onclick=removeDialog;overlay.onclick=removeDialog;buttonContainer.appendChild(generateBtn);buttonContainer.appendChild(cancelBtn);dialog.appendChild(title);dialog.appendChild(form);dialog.appendChild(buttonContainer);document.body.appendChild(overlay);document.body.appendChild(dialog);}function showCommandDialog(content){const command=generateCommand({author:content.author,url:content.url,title:content.title,date:content.date},{tags:content.tags,quote:content.quote,commentary:content.commentary});const overlay=document.createElement("div");overlay.style.position="fixed";overlay.style.top="0";overlay.style.left="0";overlay.style.width="100%";overlay.style.height="100%";overlay.style.backgroundColor="rgba(0, 0, 0, 0.5)";overlay.style.zIndex="9999";overlay.style.pointerEvents="none";const dialog=document.createElement("div");dialog.style.position="fixed";dialog.style.top="50%";dialog.style.left="50%";dialog.style.transform="translate(-50%, -50%)";dialog.style.width="90%";dialog.style.maxWidth="650px";dialog.style.backgroundColor="white";dialog.style.borderRadius="8px";dialog.style.boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)";dialog.style.zIndex="10000";dialog.style.padding="20px";dialog.style.fontFamily="sans-serif";dialog.style.pointerEvents="auto";const title=document.createElement("h2");title.textContent="Copy your command";title.style.margin="0 0 15px 0";title.style.fontSize="18px";const instructions=document.createElement("p");instructions.textContent="Click the copy button or select all text and copy (Ctrl+A then Ctrl+C):";instructions.style.margin="0 0 10px 0";instructions.style.fontSize="14px";instructions.style.color="#666";const textarea=document.createElement("textarea");textarea.value=command;textarea.readOnly=false;textarea.style.width="100%";textarea.style.height="250px";textarea.style.padding="10px";textarea.style.fontFamily="monospace";textarea.style.fontSize="11px";textarea.style.border="1px solid #ddd";textarea.style.borderRadius="4px";textarea.style.boxSizing="border-box";textarea.style.marginBottom="15px";textarea.style.whiteSpace="pre-wrap";textarea.style.overflowWrap="break-word";textarea.style.userSelect="all";const buttonContainer=document.createElement("div");buttonContainer.style.display="flex";buttonContainer.style.gap="10px";const copyBtn=document.createElement("button");copyBtn.textContent="📋 Copy to Clipboard";copyBtn.style.flex="1";copyBtn.style.padding="10px 20px";copyBtn.style.backgroundColor="#4CAF50";copyBtn.style.color="white";copyBtn.style.border="none";copyBtn.style.borderRadius="4px";copyBtn.style.cursor="pointer";copyBtn.style.fontSize="14px";copyBtn.onclick=async()=>{try{await navigator.clipboard.writeText(command);copyBtn.textContent="✓ Copied!";setTimeout(()=>{copyBtn.textContent="📋 Copy to Clipboard";},2000);}catch(err){copyBtn.textContent="Copy failed";console.error("Copy failed:",err);}};const doneBtn=document.createElement("button");doneBtn.textContent="Done";doneBtn.style.flex="1";doneBtn.style.padding="10px 20px";doneBtn.style.backgroundColor="#999";doneBtn.style.color="white";doneBtn.style.border="none";doneBtn.style.borderRadius="4px";doneBtn.style.cursor="pointer";doneBtn.style.fontSize="14px";const removeDialog=()=>{if(document.body.contains(overlay)){document.body.removeChild(overlay);}if(document.body.contains(dialog)){document.body.removeChild(dialog);}};doneBtn.onclick=removeDialog;overlay.onclick=removeDialog;buttonContainer.appendChild(copyBtn);buttonContainer.appendChild(doneBtn);dialog.appendChild(title);dialog.appendChild(instructions);dialog.appendChild(textarea);dialog.appendChild(buttonContainer);document.body.appendChild(overlay);document.body.appendChild(dialog);}const feedlyData=extractFeedlyData();showEditForm(feedlyData);})();
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
