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

// this creates menu item
function onOpen() {
  DocumentApp.getUi().createMenu('Custom Add-on')
      .addItem('Fetch Data', 'fetchData')
      .addItem('Open Sidebar', 'showSidebar')
      .addItem('Reload Sidebar', 'showSidebar')  // NEW MENU OPTION
      .addToUi();
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


function getDoc() {
  try {
    const doc = DocumentApp.openById('15e3EIbRqtJOZWUtPwTZG9zjTpoCQ5b1VFtNl8KZS_Lo');
    const body = doc.getBody();
    return body.getText();
  } catch (error) {
    Logger.log('Error in getDoc: ' + error);
    return 'Error reading document: ' + error.toString();
  }
}

function testgetDoc() {
  // Logger.log(getDoc())
  Logger.log("TEST")
}
