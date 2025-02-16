/**
 * Exports a Google Doc to Markdown.
 * @param {string} docId - The ID of the Google Doc.
 * @return {string} The converted Markdown text.
 */
function exportDocToMarkdown(docId) {
  try {
    const doc = DocumentApp.openById(docId);
    const body = doc.getBody();
    const markdownText = convertBodyToMarkdown(body);
    Logger.log(markdownText);
    return markdownText;
  } catch (error) {
    Logger.log('Error in exportDocToMarkdown: ' + error);
    return 'Error: ' + error.toString();
  }
}

/**
 * Converts a Document body to Markdown.
 * This function contains all the conversion logic so that it can be unit tested independently.
 * @param {Object} body - A Document body (or a mock) that supports getNumChildren() and getChild().
 * @return {string} The converted Markdown text.
 */
function convertBodyToMarkdown(body) {
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
          // Determine blockquote level (approximately 1 '>' per 36 points of indent)
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
      if (
        glyphType === DocumentApp.GlyphType.BULLET ||
        glyphType === DocumentApp.GlyphType.HOLLOW_BULLET ||
        glyphType === DocumentApp.GlyphType.SQUARE_BULLET
      ) {
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

  return markdownText.trim();
}

/**
 * Formats a Text element into Markdown, preserving inline styles (bold, italic, underline, hyperlinks).
 * @param {Object} textElem - A Text element (or a mock) with the appropriate methods.
 * @return {string} The formatted Markdown string for the text element.
 */
function formatTextRun(textElem) {
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
      // Format as a hyperlink. Prefer Markdown for bold/italic if possible.
      if (bold && italic) {
        substring = "**_" + substring + "_**";
      } else if (bold) {
        substring = "**" + substring + "**";
      } else if (italic) {
        substring = "*" + substring + "*";
      }
      if (underline) {
        substring = "<u>" + substring + "</u>";
      }
      substring = "[" + substring + "](" + linkUrl + ")";
    } else {
      if (bold && italic) {
        substring = "**_" + substring + "_**";
      } else if (bold) {
        substring = "**" + substring + "**";
      } else if (italic) {
        substring = "*" + substring + "*";
      }
      if (underline) {
        substring = "<u>" + substring + "</u>";
      }
    }
    mdText += substring;
  }
  return mdText;
}

/* ================================
   Test Code for Markdown Conversion
   ================================ */

/**
 * Run tests for the markdown conversion logic.
 */
function testMarkdownConversion() {
  // Create a mock body with three children:
  // 1. A heading paragraph.
  // 2. A list item.
  // 3. A paragraph with an indent (blockquote).
  const mockBody = {
    getNumChildren: function() { return 3; },
    getChild: function(i) {
      if (i === 0) {
        // Heading paragraph
        return new MockParagraph("Heading One", DocumentApp.ParagraphHeading.HEADING1, 0);
      } else if (i === 1) {
        // List item (bullet)
        return new MockListItem("List item one", 0, DocumentApp.GlyphType.BULLET, "list1");
      } else if (i === 2) {
        // Indented paragraph (blockquote)
        return new MockParagraph("A blockquote", DocumentApp.ParagraphHeading.NORMAL, 40);
      }
    }
  };

  // Expected Markdown (note the blank lines between blocks)
  const expectedMarkdown =
    "# Heading One\n\n" +
    "- List item one\n\n" +
    "> A blockquote";

  const output = convertBodyToMarkdown(mockBody);
  
  Logger.log("Expected:\n" + expectedMarkdown);
  Logger.log("Output:\n" + output);

  if (output === expectedMarkdown) {
    Logger.log("✅ Test Passed!");
  } else {
    Logger.log("❌ Test Failed!");
  }
}

/**
 * Mock implementation for a Paragraph element.
 * @param {string} text - The text content.
 * @param {string} heading - The heading type (use DocumentApp.ParagraphHeading constants).
 * @param {number} indentStart - The starting indent (in points).
 */
function MockParagraph(text, heading, indentStart) {
  this._text = text;
  this._heading = heading;
  this._indentStart = indentStart;
}

MockParagraph.prototype.getType = function() {
  return DocumentApp.ElementType.PARAGRAPH;
};

MockParagraph.prototype.getText = function() {
  return this._text;
};

MockParagraph.prototype.getHeading = function() {
  return this._heading;
};

MockParagraph.prototype.getIndentStart = function() {
  return this._indentStart;
};

MockParagraph.prototype.getNumChildren = function() {
  return 1;
};

MockParagraph.prototype.getChild = function(index) {
  // For simplicity, always return a basic Text element.
  return new MockText(this._text);
};

/**
 * Mock implementation for a ListItem element.
 * @param {string} text - The text content.
 * @param {number} nestingLevel - The nesting level.
 * @param {string} glyphType - The glyph type (use DocumentApp.GlyphType constants).
 * @param {string} listId - An arbitrary ID to group list items.
 */
function MockListItem(text, nestingLevel, glyphType, listId) {
  this._text = text;
  this._nestingLevel = nestingLevel;
  this._glyphType = glyphType;
  this._listId = listId;
}

MockListItem.prototype.getType = function() {
  return DocumentApp.ElementType.LIST_ITEM;
};

MockListItem.prototype.getText = function() {
  return this._text;
};

MockListItem.prototype.getNestingLevel = function() {
  return this._nestingLevel;
};

MockListItem.prototype.getGlyphType = function() {
  return this._glyphType;
};

MockListItem.prototype.getListId = function() {
  return this._listId;
};

MockListItem.prototype.getNumChildren = function() {
  return 1;
};

MockListItem.prototype.getChild = function(index) {
  return new MockText(this._text);
};

/**
 * Mock implementation for a Text element.
 * @param {string} text - The text content.
 */
function MockText(text) {
  this._text = text;
}

MockText.prototype.getType = function() {
  return DocumentApp.ElementType.TEXT;
};

MockText.prototype.getText = function() {
  return this._text;
};

// For simplicity, assume the entire text has one style run.
MockText.prototype.getTextAttributeIndices = function() {
  return [0];
};

// Default styles: no bold, no italic, no underline, no link.
MockText.prototype.isBold = function(index) { return false; };
MockText.prototype.isItalic = function(index) { return false; };
MockText.prototype.isUnderline = function(index) { return false; };
MockText.prototype.getLinkUrl = function(index) { return null; };
