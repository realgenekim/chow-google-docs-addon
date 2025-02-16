function exportDocToMarkdown() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const numChildren = body.getNumChildren();
  let markdownText = "";
  // Track numbering for ordered lists by list ID and nesting level
  const listCounters = {};

  for (let i = 0; i < numChildren; i++) {
    const element = body.getChild(i);
    const type = element.getType();
    let prefix = "";
    let content = "";

    // Handle Paragraph (including Headings) elements
    if (type === DocumentApp.ElementType.PARAGRAPH) {
      const paragraph = element;
      // Skip table of contents or empty paragraphs
      if (paragraph.getType() === DocumentApp.ElementType.TABLE_OF_CONTENTS || paragraph.getText().trim() === "") {
        continue;
      }
      // Determine heading level
      const heading = paragraph.getHeading();
      if (heading !== DocumentApp.ParagraphHeading.NORMAL && heading !== DocumentApp.ParagraphHeading.NONE) {
        // Add '#' for each heading level
        switch (heading) {
          case DocumentApp.ParagraphHeading.HEADING6: prefix += "#";
          case DocumentApp.ParagraphHeading.HEADING5: prefix += "#";
          case DocumentApp.ParagraphHeading.HEADING4: prefix += "#";
          case DocumentApp.ParagraphHeading.HEADING3: prefix += "#";
          case DocumentApp.ParagraphHeading.HEADING2: prefix += "#";
          case DocumentApp.ParagraphHeading.HEADING1: prefix += "# ";
        }
      } else {
        // Not a heading: check for indent to format as blockquote
        const indent = paragraph.getIndentStart();
        if (indent && indent > 0) {
          // Determine blockquote level (approximately 1 '>' per 0.5 inch indent)
          const level = Math.max(1, Math.floor(indent / 36));
          prefix = ">".repeat(level) + " ";
        }
      }
    }
    // Handle ListItem elements (bulleted or numbered lists)
    else if (type === DocumentApp.ElementType.LIST_ITEM) {
      const listItem = element;
      const nesting = listItem.getNestingLevel();
      // Indent nested list items
      prefix = "  ".repeat(nesting);
      // Determine list marker (bullet or number)
      const glyphType = listItem.getGlyphType();
      if (glyphType === DocumentApp.GlyphType.BULLET || glyphType === DocumentApp.GlyphType.HOLLOW_BULLET 
          || glyphType === DocumentApp.GlyphType.SQUARE_BULLET) {
        // Bullet list item
        prefix += "- ";
      } else {
        // Numbered list item
        const listId = listItem.getListId();
        const key = listId + "-" + nesting;
        listCounters[key] = (listCounters[key] || 0) + 1;
        prefix += listCounters[key] + ". ";
      }
    } else {
      // Skip other element types (tables, images, etc.)
      continue;
    }

    // Build the content string by iterating through child elements (text runs, footnotes, etc.)
    for (let j = 0; j < element.getNumChildren(); j++) {
      const child = element.getChild(j);
      if (child.getType() === DocumentApp.ElementType.TEXT) {
        content += formatTextRun(child);
      } else if (child.getType() === DocumentApp.ElementType.FOOTNOTE) {
        // Include footnote content in parentheses
        content += "(" + child.getFootnoteContents().getText() + ")";
      } else {
        // Ignore other child elements (images, page breaks, etc.)
        continue;
      }
    }

    if (content.trim() === "") continue;  // skip adding if no content

    // Add the formatted line to the output with appropriate newlines
    if (type === DocumentApp.ElementType.LIST_ITEM) {
      // List items: no blank line between items
      markdownText += prefix + content + "\n";
      // If next element is not a list item, add an extra newline to end the list
      const nextType = (i < numChildren - 1) ? body.getChild(i + 1).getType() : null;
      if (nextType !== DocumentApp.ElementType.LIST_ITEM) {
        markdownText += "\n";
      }
    } else {
      // Paragraph or heading: follow with a blank line
      markdownText += prefix + content + "\n\n";
    }
  }

  Logger.log(markdownText);
  // You can also return markdownText or output it (e.g., email it or insert into a document) as needed.
}

function formatTextRun(textElem) {
  // Convert a Text element to Markdown, preserving bold, italic, underline, and hyperlinks
  let mdText = "";
  const text = textElem.getText();
  const indices = textElem.getTextAttributeIndices();
  for (let k = 0; k < indices.length; k++) {
    const startIndex = indices[k];
    const endIndex = (k < indices.length - 1) ? indices[k + 1] : text.length;
    let substring = text.substring(startIndex, endIndex);

    // Get text styling at startIndex
    const bold = textElem.isBold(startIndex);
    const italic = textElem.isItalic(startIndex);
    const underline = textElem.isUnderline(startIndex);
    const linkUrl = textElem.getLinkUrl(startIndex);

    // Apply markdown/HTML based on styles
    if (linkUrl) {
      // Format as a hyperlink
      if (underline && (bold || italic)) {
        // If underlined plus other styles, use HTML tags to combine (to avoid markdown parsing issues)
        if (bold && italic) {
          substring = "<u><strong><em>" + substring + "</em></strong></u>";
        } else if (bold) {
          substring = "<u><strong>" + substring + "</strong></u>";
        } else if (italic) {
          substring = "<u><em>" + substring + "</em></u>";
        } else {
          substring = "<u>" + substring + "</u>";
        }
      } else {
        // Use Markdown for bold/italic if no underline or no combo
        if (bold && italic) {
          substring = "**_" + substring + "_**";
        } else if (bold) {
          substring = "**" + substring + "**";
        } else if (italic) {
          substring = "*" + substring + "*";
        } else if (underline) {
          substring = "<u>" + substring + "</u>";
        }
      }
      // Wrap the text in Markdown link syntax
      substring = "[" + substring + "](" + linkUrl + ")";
    } else {
      // Non-hyperlink text
      if (underline && (bold || italic)) {
        // Underlined + other style: use HTML to wrap the combination
        if (bold && italic) {
          substring = "<u><strong><em>" + substring + "</em></strong></u>";
        } else if (bold) {
          substring = "<u><strong>" + substring + "</strong></u>";
        } else if (italic) {
          substring = "<u><em>" + substring + "</em></u>";
        } else {
          substring = "<u>" + substring + "</u>";
        }
      } else {
        // Use pure Markdown syntax for bold/italic when possible
        if (bold && italic) {
          substring = "**_" + substring + "_**";
        } else if (bold) {
          substring = "**" + substring + "**";
        } else if (italic) {
          substring = "*" + substring + "*";
        } else if (underline) {
          substring = "<u>" + substring + "</u>";
        }
      }
    }
    mdText += substring;
  }
  return mdText;
}
