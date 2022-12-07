console.log('Starting extension...');

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

            // Get the current tab
            const tab = tabs[0];
            // Get the current tab url
            const url = tab.url;
      
            if (url === 'https://ead.ipleiria.pt/2022-23/login/index.php') {
                  console.log('User is on the login page');

                  // Get the username and password input fields
                  chrome.scripting.executeScript({target: {tabId: tab.id}, function: () => {
                        const username = document.getElementById("username");
                        const password = document.getElementById("password");
                        const loginButton = document.getElementById("loginbtn");

                        // Click the confirm button
                        const confirmar = document.getElementsByClassName("btn btn-primary")[0]
                        if (confirmar) {
                              confirmar.click();
                        }

                        username.value = "";
                        password.value = "";

                        // Click the login button
                        loginButton.click();

                        // Get the current tab url
                        const url = window.location.href;
                        if (url === 'https://ead.ipleiria.pt/2022-23/my/') {
                              console.log('User is logged in');

                              // Get the current tab id
                              const tabId = chrome.devtools.inspectedWindow.tabId;

                              // Send a message to the background script
                              chrome.runtime.sendMessage({tabId: tabId, message: "logged-in"}, (result) => {
                                    console.log(result);
                              });
                        }
                  }}, (result) => {
                        console.log(result);
                  });
            }
      });
});
