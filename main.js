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
      .setTitle("My Add-on");
  DocumentApp.getUi().showSidebar(html);
}
