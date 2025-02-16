// function triggerSidebarReload() {
//   Utilities.sleep(300);
//   showSidebar();
// }

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle("CHOW Workbench")
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
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

// this creates menu item
function onOpen() {
  DocumentApp.getUi().createMenu('Custom Add-on')
      .addItem('Fetch Data', 'fetchData')
      .addItem('Open Sidebar', 'showSidebar')
      .addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle("CHOW Workbench")
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
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


let globalContentBook = "";  // Declare global variable
let globalSelection = ""

function generatePromptAndCopyToClipboard() {
  const prompt = assemblePrompt(globalContentBook, globalSelection);
  return JSON.stringify(prompt, null, 2); // Returns formatted JSON string
}

function getDoc() {
  // Store markdown content in global variable for later use
  globalContentBook = fetchBookManuscriptMarkdown();
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
    // Get markdown for both parts
    const part1Markdown = exportDocToMarkdown(docId_part01);
    const part2Markdown = exportDocToMarkdown(docId_part2);
    
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
}
