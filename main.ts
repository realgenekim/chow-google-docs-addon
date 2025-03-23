function myFunction() {
  
}

function onHomepage(e) {
  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("CHOW Assistnat"))
    .addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newTextParagraph().setText("Hello from CHOW Assistant!")
        )
    )
    .build();
  return card;
}

function onOpen(e) {
  DocumentApp.getUi()
    .createAddonMenu()  // Add-on menu in the Docs UI
    .addItem("Do XYZ Task", "doXyzTask")
    .addToUi();
}
function onInstall(e) {
  onOpen(e);  // Ensure the menu is added when the add-on is installed
}

function triggerSidebarReload() {
  // Wait a moment before reopening to ensure the sidebar has fully closed
  Utilities.sleep(300);  // Small delay to prevent execution race conditions
  showSidebar();  // Reopens the sidebar
}

function showSidebar() {

  var timestamp = new Date().getTime(); // Cache-busting timestamp
  var html = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle("CHOW Workbench")
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  
  // Inject JavaScript to reload only if code has changed
  html.append('<script>var cacheBuster = "' + timestamp + '";</script>');

  DocumentApp.getUi().showSidebar(html);
}

function showAlert() {
  const ui = DocumentApp.getUi();
  const response = ui.alert(
    'Hello!',
    'Would you like to proceed?',
    ui.ButtonSet.YES_NO
  );
  
  if (response === ui.Button.YES) {
    // Do something when user clicks Yes
    ui.alert('You clicked Yes!');
  }
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle("CHOW Workbench");
  DocumentApp.getUi().showSidebar(html);
}

function getSelectedText() {
  const doc = DocumentApp.getActiveDocument();
  const selection = doc.getSelection();
  
  if (!selection) {
    return "No text selected";
  }
  
  const elements = selection.getSelectedElements();
  let selectedText = "";
  
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i].getElement();
    if (element.editAsText) {
      selectedText += element.asText().getText();
    }
  }
  
  return selectedText || "No text selected";
}


// Import the necessary variables from the assemble_prompt.ts file
// @ts-ignore - these are defined in assemble_prompt.ts
const { PART1_SUMMARY, PART2_SUMMARY, PROMPTS } = this;

// Initialize global variables from properties
let globalContentBook = PropertiesService.getUserProperties().getProperty('globalContentBook') || "";
let globalSelection = PropertiesService.getUserProperties().getProperty('globalSelection') || "";
let selectedPromptOption = PropertiesService.getUserProperties().getProperty('selectedPromptOption') || "put-in-artifacts";

/**
 * Gets all available prompt options from the PROMPTS array
 * @return {Array} Array containing prompt options with id, label, and text properties
 */
function getPromptOptions() {
  // Return a copy of the PROMPTS array
  return PROMPTS ? JSON.parse(JSON.stringify(PROMPTS)) : [];
}

/**
 * Generate a prompt using the selected prompt option
 * @param {string} promptOptionId - The ID of the prompt option to use
 * @return {string} The generated prompt in JSON format
 */
function generatePromptWithOption(promptOptionId) {
  // Save the selected option to properties
  selectedPromptOption = promptOptionId;
  PropertiesService.getUserProperties().setProperty('selectedPromptOption', promptOptionId);
  
  // Log the selected prompt option
  Logger.log(`Using prompt option: ${promptOptionId}`);
  
  // Generate the prompt with the selected template
  const promptSections = assemblePrompt(globalContentBook, globalSelection);
  
  // Find the selected prompt template
  const selectedPrompt = PROMPTS.find(prompt => prompt.id === promptOptionId);
  
  // Modify the YOUR_TASK section with the selected prompt template
  if (selectedPrompt) {
    // Find and replace the YOUR_TASK section
    for (let i = 0; i < promptSections.length; i++) {
      if (promptSections[i]["your-task"]) {
        promptSections[i]["your-task"] = selectedPrompt.text;
        break;
      }
    }
  }
  
  const result = JSON.stringify(promptSections, null, 2);
  
  // Log what mode we're using (full content or with Part 1/Part 2 summary)
  const isPart2 = globalContentBook.startsWith('# Part 2');
  const isPart3 = globalContentBook.startsWith('# Part 3');
  
  if (isPart2) {
    Logger.log('Generated prompt for Part 2 with PART1_SUMMARY constant (no need to load Part 1 document)');
    // Calculate sizes for comparison
    const fullSize = result.length;
    const part1SummarySize = PART1_SUMMARY.length;
    Logger.log(`Using PART1_SUMMARY saves approximately ${Math.round((1 - part1SummarySize/30000) * 100)}% of context window compared to full Part 1`);
  } else if (isPart3) {
    Logger.log('Generated prompt for Part 3 with both PART1_SUMMARY and PART2_SUMMARY constants');
    // Calculate sizes for comparison
    const part1SummarySize = PART1_SUMMARY.length;
    const part2SummarySize = PART2_SUMMARY.length;
    Logger.log(`Using summaries saves significant context window space compared to full documents`);
  } else {
    Logger.log('Generated prompt with full manuscript content');
  }
  
  return result;
}

/**
 * Legacy function for backward compatibility
 * @return {string} The generated prompt in JSON format
 */
function generatePromptAndCopyToClipboard() {
  return generatePromptWithOption(selectedPromptOption);
}

function getDoc() {
  // Store markdown content in global variable for later use
  globalContentBook = fetchBookManuscriptMarkdown();
  // Persist to properties
  PropertiesService.getUserProperties().setProperty('globalContentBook', globalContentBook);
  return globalContentBook;
}

function getPart1Doc() {
  try {
    // Store only Part 1 markdown content in global variable
    globalContentBook = fetchBookPart1Markdown();
    
    // Check if the result indicates an access error
    if (globalContentBook.startsWith('# Access Error') || 
        globalContentBook.startsWith('# Error Accessing Document')) {
      
      Logger.log('Access error detected with Part 1 document');
      
      // Add fallback content for Part 1 so the prompt still works
      globalContentBook = `# Part 1

${globalContentBook}

Note: Using placeholder content for Part 1. The actual document could not be accessed.`;
    }
    
    // Persist to properties
    PropertiesService.getUserProperties().setProperty('globalContentBook', globalContentBook);
    return globalContentBook;
  } catch (error) {
    Logger.log('Error in getPart1Doc: ' + error);
    return 'Error: ' + error.toString();
  }
}

function getPart2Doc() {
  try {
    // Store only Part 2 markdown content in global variable
    globalContentBook = fetchBookPart2Markdown();
    
    // Check if the result indicates an access error
    if (globalContentBook.startsWith('# Access Error') || 
        globalContentBook.startsWith('# Error Accessing Document')) {
      
      Logger.log('Access error detected with Part 2 document');
      
      // Add fallback content for Part 2 so the prompt still works
      globalContentBook = `# Part 2

${globalContentBook}

Note: Using placeholder content for Part 2. The actual document could not be accessed.`;
    }
    
    // Persist to properties
    PropertiesService.getUserProperties().setProperty('globalContentBook', globalContentBook);
    return globalContentBook;
  } catch (error) {
    Logger.log('Error in getPart2Doc: ' + error);
    return 'Error: ' + error.toString();
  }
}

/**
 * Fetches only Part 3 markdown.
 * @return {string} Markdown text from Part 3 document.
 */
function getPart3Doc() {
  try {
    // Get markdown for Part 3 with retry logic
    const part3Markdown = retryOperation(() => exportDocToMarkdown(DOC_ID_PART3), 3);
    
    // Check if the content is suspiciously short
    const getWordCount = (text: string): number => text.trim().split(/\s+/).length;
    const wordCount = getWordCount(part3Markdown);
    Logger.log(`Part 3 word count: ${wordCount}`);
    
    if (wordCount < 100) {
      Logger.log(`⚠️ WARNING: Part 3 content is suspiciously short (${wordCount} words). This may indicate an issue with document access or content.`);
      
      // Check if it contains error messages
      if (part3Markdown.includes('Access Error') || part3Markdown.includes('Error Accessing Document')) {
        Logger.log('Part 3 document access error detected');
        return part3Markdown; // Return the error message directly
      } else {
        // Add warning to the content since it's unusually short
        const warningMessage = `
# WARNING: Incomplete Content Detected

The Part 3 document appears to be incomplete. Only ${wordCount} words were loaded, but Part 3 should have approximately 11,000 words.

Possible causes:
1. The document ID may be incorrect
2. You may not have proper access to the document
3. The document may be empty or contain very limited content
4. There may be a technical issue with the document export process

Current document ID: ${DOC_ID_PART3}

${part3Markdown}`;
        return warningMessage;
      }
    }
    
    const formattedMarkdown = "# Part 3\n\n" + part3Markdown;
    
    Logger.log("Part 3 manuscript markdown generated successfully");
    globalContentBook = formattedMarkdown;
    
    // Persist to properties
    PropertiesService.getUserProperties().setProperty('globalContentBook', globalContentBook);
    return globalContentBook;
  } catch (error) {
    Logger.log('Error in getPart3Doc: ' + error);
    return 'Error generating Part 3 markdown: ' + error.toString();
  }
}


/**
 * Document IDs for manuscript parts
 */
const DOC_ID_PART1 = "1Kk4ryuJicTOteqJ4IP9IfocQyTnZ6TIkTQviupB91c4";
const DOC_ID_PART2 = "15e3EIbRqtJOZWUtPwTZG9zjTpoCQ5b1VFtNl8KZS_Lo";
const DOC_ID_PART3 = "1t2VE9Nxc98fq5IPgtv4T0HpvJ-tHpukrpZ0tXlgBDQk"; // Add the real document ID for Part 3

/**
 * Gets information about the active document
 * @return {Object} Document information with title and id
 */
function getActiveDocumentInfo() {
  try {
    const doc = DocumentApp.getActiveDocument();
    if (!doc) {
      return { title: "", id: "" };
    }
    
    return {
      title: doc.getName(),
      id: doc.getId()
    };
  } catch (error) {
    Logger.log('Error getting active document info: ' + error);
    return { title: "", id: "", error: error.toString() };
  }
}

/**
 * Fetches and combines markdown from two specific document parts.
 * @return {string} Combined markdown text from both documents.
 */
function fetchBookManuscriptMarkdown() {
  try {
    // Get markdown for both parts with retry logic
    let part1Markdown = retryOperation(() => exportDocToMarkdown(DOC_ID_PART1), 3);
    let part2Markdown = retryOperation(() => exportDocToMarkdown(DOC_ID_PART2), 3);
    
    // Check for access errors in Part 1
    if (part1Markdown.startsWith('# Access Error') || part1Markdown.startsWith('# Error Accessing Document')) {
      Logger.log('Access error detected with Part 1 document in combined fetch');
      part1Markdown = part1Markdown + "\n\nNote: Using error message for Part 1. The actual document could not be accessed.";
    }
    
    // Check for access errors in Part 2
    if (part2Markdown.startsWith('# Access Error') || part2Markdown.startsWith('# Error Accessing Document')) {
      Logger.log('Access error detected with Part 2 document in combined fetch');
      part2Markdown = part2Markdown + "\n\nNote: Using error message for Part 2. The actual document could not be accessed.";
    }

    // log the word count of the two vars
    const getWordCount = (text: string): number => text.trim().split(/\s+/).length;
    Logger.log(`Part 1 word count: ${getWordCount(part1Markdown)}`);
    Logger.log(`Part 2 word count: ${getWordCount(part2Markdown)}`);

    // Combine with a section divider
    const combinedMarkdown = 
      "# Part 1\n\n" +
      part1Markdown + 
      "\n\n---\n\n" + 
      "# Part 2\n\n" +
      part2Markdown;
    
    Logger.log("Combined manuscript markdown generated successfully");
    return combinedMarkdown;
    
  } catch (error) {
    Logger.log('Error in fetchBookManuscriptMarkdown: ' + error);
    return '# Error Generating Combined Markdown\n\n' + error.toString() + 
      '\n\nPlease check that all documents exist and you have permission to access them.';
  }
}

/**
 * Fetches only Part 1 markdown.
 * @return {string} Markdown text from Part 1 document.
 */
function fetchBookPart1Markdown() {
  try {
    // Get markdown for Part 1 with retry logic
    const part1Markdown = retryOperation(() => exportDocToMarkdown(DOC_ID_PART1), 3);
    
    // log the word count
    const getWordCount = (text: string): number => text.trim().split(/\s+/).length;
    Logger.log(`Part 1 word count: ${getWordCount(part1Markdown)}`);
    
    const formattedMarkdown = "# Part 1\n\n" + part1Markdown;
    
    Logger.log("Part 1 manuscript markdown generated successfully");
    return formattedMarkdown;
    
  } catch (error) {
    Logger.log('Error in fetchBookPart1Markdown: ' + error);
    return 'Error generating Part 1 markdown: ' + error.toString();
  }
}

/**
 * Fetches only Part 2 markdown.
 * @return {string} Markdown text from Part 2 document.
 */
function fetchBookPart2Markdown() {
  try {
    // Get markdown for Part 2 with retry logic
    const part2Markdown = retryOperation(() => exportDocToMarkdown(DOC_ID_PART2), 3);
    
    // log the word count
    const getWordCount = (text: string): number => text.trim().split(/\s+/).length;
    Logger.log(`Part 2 word count: ${getWordCount(part2Markdown)}`);
    
    const formattedMarkdown = "# Part 2\n\n" + part2Markdown;
    
    Logger.log("Part 2 manuscript markdown generated successfully");
    return formattedMarkdown;
    
  } catch (error) {
    Logger.log('Error in fetchBookPart2Markdown: ' + error);
    return 'Error generating Part 2 markdown: ' + error.toString();
  }
}

function setGlobalSelection(text) {
  globalSelection = text;
  // Persist to properties
  PropertiesService.getUserProperties().setProperty('globalSelection', text);
}

/**
 * Retries an operation with exponential backoff.
 * @param {Function} operation - The operation to retry
 * @param {number} maxAttempts - Maximum number of retry attempts
 * @param {number} initialDelay - Initial delay in milliseconds (default: 1000)
 * @return {any} The result of the successful operation
 * @throws {Error} If all retry attempts fail
 */
function retryOperation(operation: () => any, maxAttempts: number, initialDelay: number = 1000): any {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return operation();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) {
        throw new Error(`Failed after ${maxAttempts} attempts. Last error: ${error}`);
      }
      
      // Calculate delay with exponential backoff (1s, 2s, 4s, etc.)
      const delay = initialDelay * Math.pow(2, attempt - 1);
      Logger.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      Utilities.sleep(delay);
    }
  }
  
  throw lastError;
}
