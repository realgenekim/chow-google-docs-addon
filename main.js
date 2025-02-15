function myFunction() {
  
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
      .setTitle("My Add-on");
  DocumentApp.getUi().showSidebar(html);
}