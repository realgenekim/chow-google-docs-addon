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
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle("My Add-on")
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
      .setTitle("My Add-on");
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


// Initialize global variables from properties
let globalContentBook = PropertiesService.getUserProperties().getProperty('globalContentBook') || "";
let globalSelection = PropertiesService.getUserProperties().getProperty('globalSelection') || "";

function generatePromptAndCopyToClipboard() {
  const prompt = assemblePrompt(globalContentBook, globalSelection);
  return JSON.stringify(prompt, null, 2); // Returns formatted JSON string
}

function getDoc() {
  // Store markdown content in global variable for later use
  globalContentBook = fetchBookManuscriptMarkdown();
  // Persist to properties
  PropertiesService.getUserProperties().setProperty('globalContentBook', globalContentBook);
  return globalContentBook;
}


/**
 * Fetches and combines markdown from two specific document parts.
 * @return {string} Combined markdown text from both documents.
 */
function fetchBookManuscriptMarkdown() {
  const docId_part01 = "1Kk4ryuJicTOteqJ4IP9IfocQyTnZ6TIkTQviupB91c4";
  const docId_part2 = "15e3EIbRqtJOZWUtPwTZG9zjTpoCQ5b1VFtNl8KZS_Lo";
  
  try {
    // Get markdown for both parts with retry logic
    const part1Markdown = retryOperation(() => exportDocToMarkdown(docId_part01), 3);
    const part2Markdown = retryOperation(() => exportDocToMarkdown(docId_part2), 3);

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
    return 'Error generating combined markdown: ' + error.toString();
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
