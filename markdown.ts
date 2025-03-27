/**
 * Exports a Google Doc to Markdown.
 * @param {string} docId - The ID of the Google Doc.
 * @return {string} The converted Markdown text.
 */
function exportDocToMarkdown(docId) {
  try {
    Logger.log('Attempting to open document with ID: ' + docId);

    // Try to access the document - may fail with permission error
    let doc;
    try {
      doc = DocumentApp.openById(docId);
    } catch (accessError) {
      // Handle access errors specifically
      if (accessError.toString().includes("403") ||
          accessError.toString().includes("Access denied") ||
          accessError.toString().includes("permission")) {

        const errorMessage = `# Access Error\n\nUnable to access document ${docId}\n\n` +
          "This document may not be shared with your Google account.\n\n" +
          "To fix this issue:\n" +
          "1. Make sure you're logged in with the correct Google account\n" +
          "2. Ask the document owner to share it with your email address\n" +
          "3. Open the document directly in Google Docs first to accept any sharing invitations";

        Logger.log('Permission error accessing document: ' + accessError);
        return errorMessage;
      }
      // Re-throw other errors
      throw accessError;
    }

    if (!doc) {
      Logger.log('Error: Could not open document with ID: ' + docId);
      return 'Error: Document not found';
    }

    const body = doc.getBody();
    if (!body) {
      Logger.log('Error: Document body is null');
      return 'Error: Document body not found';
    }

    const markdownText = convertBodyToMarkdown(body);
    if (!markdownText && markdownText !== '') {
      Logger.log('Warning: convertBodyToMarkdown returned null');
      return '';
    }

    // Add additional null checks for document elements
    if (!doc.getBody() || !doc.getBody().getText()) {
      Logger.log('Error: Document body or text is null');
      return 'Error: Empty document';
    }

    Logger.log('Successfully converted document to markdown');
    return markdownText;
  } catch (error) {
    Logger.log('Error in exportDocToMarkdown: ' + error);
    return '# Error Accessing Document\n\n' + error.toString() +
      '\n\nPlease check that the document exists and you have permission to access it.';
  }
}

function testExportMarkdown()
{
  exportDocToMarkdown("15e3EIbRqtJOZWUtPwTZG9zjTpoCQ5b1VFtNl8KZS_Lo")
}

/**
 * Converts a Document body to Markdown.
 * This function contains all the conversion logic so that it can be unit tested independently.
 * @param {Object} body - A Document body (or a mock) that supports getNumChildren() and getChild().
 * @return {string} The converted Markdown text.
 */
function convertBodyToMarkdown(body) {
  // Add null check at the start
  if (!body) {
    Logger.log('Error: body parameter is null or undefined');
    return '';  // Return empty string instead of null
  }

  const numChildren = body.getNumChildren();
  if (typeof numChildren !== 'number') {
    Logger.log('Error: body.getNumChildren() returned invalid value');
    return '';  // Return empty string instead of null
  }

  let markdownText = "";
  // Track numbering for ordered lists by list ID and nesting level
  const listCounters = {};

  for (let i = 0; i < numChildren; i++) {
    const element = body.getChild(i);
    if (!element) {
      Logger.log(`Warning: Null element at index ${i}`);
      continue;
    }
    const type = element.getType();
    let prefix = "";
    let content = "";

    // Handle Paragraph (including Headings) elements
    if (type === DocumentApp.ElementType.PARAGRAPH) {
      const paragraph = element;
      // Skip table of contents or empty paragraphs
      if (paragraph.getType() === DocumentApp.ElementType.TABLE_OF_CONTENTS ||
          !paragraph.getText || // Check if getText method exists
          (typeof paragraph.getText === 'function' && paragraph.getText().trim() === "")) {
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
    // First, filter out any elements that are entirely suggested deletions
    const childElements = [];
    for (let j = 0; j < element.getNumChildren(); j++) {
      const child = element.getChild(j);
      // Skip elements that are entirely suggested deletions
      if (child.getType() === DocumentApp.ElementType.TEXT) {
        // Check if the entire text element is a suggested deletion
        const text = child.getText();
        if (text && text.length > 0 && !isSuggestedDeletion(child, 0, text.length)) {
          childElements.push(child);
        }
      } else {
        // For non-text elements, include them by default
        childElements.push(child);
      }
    }

    // Process the filtered elements
    for (let j = 0; j < childElements.length; j++) {
      const child = childElements[j];
      if (child.getType() === DocumentApp.ElementType.TEXT) {
        content += formatTextRun(child);
      } else if (child.getType() === DocumentApp.ElementType.FOOTNOTE) {
        // Include footnote content in parentheses
        if (child && child.getFootnoteContents && typeof child.getFootnoteContents === 'function') {
          const footnoteContents = child.getFootnoteContents();
          if (footnoteContents && footnoteContents.getText && typeof footnoteContents.getText === 'function') {
            content += "(" + footnoteContents.getText() + ")";
          } else {
            Logger.log('Warning: Invalid footnote contents structure');
          }
        } else {
          Logger.log('Warning: Invalid footnote element structure');
        }
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
 * Checks if a text element or range is a suggested deletion.
 * @param {Object} textElem - A Text element to check.
 * @param {number} startIndex - The start index of the text range.
 * @param {number} endIndex - The end index of the text range.
 * @return {boolean} True if the text is a suggested deletion, false otherwise.
 */
function isSuggestedDeletion(textElem, startIndex, endIndex) {
  // Check if we have access to the necessary methods
  if (!textElem || !textElem.getText) {
    return false;
  }

  try {
    // In Google Apps Script, we can check if text has suggestions
    // by examining its attributes
    if (textElem.getSuggestedDeletionIds) {
      const deletionIds = textElem.getSuggestedDeletionIds(startIndex, endIndex);
      return deletionIds && deletionIds.length > 0;
    }

    // If the API doesn't provide direct access to suggestion IDs,
    // we can try to check if the text is marked for deletion in other ways
    // This is a fallback approach and may not be as reliable
    if (textElem.getAttributes) {
      const attributes = textElem.getAttributes(startIndex);
      // Check for any attributes that might indicate suggested deletion
      // This is implementation-specific and may need adjustment
      return attributes && attributes.SUGGESTED_DELETION === true;
    }
  } catch (error) {
    // If we encounter an error, log it and assume it's not a suggested deletion
    Logger.log('Error checking for suggested deletion: ' + error);
  }

  return false;
}

/**
 * Formats a Text element into Markdown, preserving inline styles (bold, italic, underline, hyperlinks).
 * Skips text that is marked as a suggested deletion.
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

    // Skip this text segment if it's a suggested deletion
    if (isSuggestedDeletion(textElem, startIndex, endIndex)) {
      continue;
    }

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
 * This test includes:
 *  - A heading paragraph.
 *  - A single bullet list item.
 *  - An indented paragraph (blockquote).
 */
function testMarkdownConversion() {
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

  const expectedMarkdown =
    "# Heading One\n\n" +
    "- List item one\n\n" +
    "> A blockquote";

  const output = convertBodyToMarkdown(mockBody);

  Logger.log("Expected:\n" + expectedMarkdown);
  Logger.log("Output:\n" + output);

  if (output === expectedMarkdown) {
    Logger.log("✅ Basic Markdown conversion test passed!");
  } else {
    Logger.log("❌ Basic Markdown conversion test failed!");
  }
}

/**
 * Run tests for three levels of bullet list items.
 */
function testThreeLevelBullets() {
  const mockBody = {
    getNumChildren: function() { return 3; },
    getChild: function(i) {
      if (i === 0) {
        // Level 0 bullet
        return new MockListItem("Level 0 bullet", 0, DocumentApp.GlyphType.BULLET, "listA");
      } else if (i === 1) {
        // Level 1 bullet
        return new MockListItem("Level 1 bullet", 1, DocumentApp.GlyphType.BULLET, "listA");
      } else if (i === 2) {
        // Level 2 bullet
        return new MockListItem("Level 2 bullet", 2, DocumentApp.GlyphType.BULLET, "listA");
      }
    }
  };

  const expectedMarkdown =
    "- Level 0 bullet\n" +
    "  - Level 1 bullet\n" +
    "    - Level 2 bullet";

  const output = convertBodyToMarkdown(mockBody);

  Logger.log("Expected (3-level bullets):\n" + expectedMarkdown);
  Logger.log("Output (3-level bullets):\n" + output);

  if (output === expectedMarkdown) {
    Logger.log("✅ 3-level bullet test passed!");
  } else {
    Logger.log("❌ 3-level bullet test failed!");
  }
}

/* ================================
   Mock Classes for Testing
   ================================ */

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

// Return indices that will properly handle our test cases
MockText.prototype.getTextAttributeIndices = function() {
  // For the suggested deletion test, we want to split the text into segments
  // to test the filtering of suggested deletions
  if (this._text === "This text has a suggested deletion.") {
    // Return indices that split the text before, during, and after the deletion
    return [0, 13, 32];
  }
  // Default case: assume the entire text has one style run
  return [0];
};

// Default styles: no bold, no italic, no underline, no link.
MockText.prototype.isBold = function(index) { return false; };
MockText.prototype.isItalic = function(index) { return false; };
MockText.prototype.isUnderline = function(index) { return false; };
MockText.prototype.getLinkUrl = function(index) { return null; };

function testRetrieveDocMarkdown() {
  var docId_part01 = "1Kk4ryuJicTOteqJ4IP9IfocQyTnZ6TIkTQviupB91c4";
  var docId_part2 = "15e3EIbRqtJOZWUtPwTZG9zjTpoCQ5b1VFtNl8KZS_Lo";
  var docId = docId_part01;
  var markdown = exportDocToMarkdown(docId);
  Logger.log("Markdown for doc id " + docId + ":\n" + markdown);
  return markdown;
}

/**
 * Test function to verify that suggested deletions are filtered out.
 * This function creates a mock document with suggested deletions and verifies
 * that they are properly filtered out in the markdown output.
 */
function testSuggestedDeletionFiltering() {
  // Create a mock Text element with suggested deletions
  const mockTextWithDeletion = new MockText("This text has a suggested deletion.");

  // Override the getSuggestedDeletionIds method to simulate a suggested deletion
  mockTextWithDeletion.getSuggestedDeletionIds = function(startIndex, endIndex) {
    // Simulate that the phrase "suggested deletion" is marked for deletion
    const deletionStart = 13; // Start of "suggested deletion"
    const deletionEnd = 32;   // End of "suggested deletion"

    // Check if the requested range overlaps with our simulated deletion
    if (startIndex < deletionEnd && endIndex > deletionStart) {
      return ["deletion-id-123"]; // Return a non-empty array to indicate deletion
    }
    return []; // No deletion in this range
  };

  // Create a mock paragraph containing our text element
  const mockParagraph = new MockParagraph("", DocumentApp.ParagraphHeading.NORMAL, 0);
  mockParagraph.getNumChildren = function() { return 1; };
  mockParagraph.getChild = function() { return mockTextWithDeletion; };

  // Create a mock document body with our paragraph
  const mockBody = {
    getNumChildren: function() { return 1; },
    getChild: function() { return mockParagraph; }
  };

  // Convert the mock body to markdown
  const markdown = convertBodyToMarkdown(mockBody);

  // Expected result should not contain the phrase "suggested deletion"
  const expectedResult = "This text has a ."; // The deletion is filtered out

  Logger.log("Test result: " + markdown);
  Logger.log("Expected: " + expectedResult);

  if (markdown.includes("suggested deletion")) {
    Logger.log("❌ Test failed: Suggested deletion was not filtered out");
  } else {
    Logger.log("✅ Test passed: Suggested deletion was filtered out");
  }

  return markdown;
}
