console.log('Starting extension...');

const login = (tab) => {
      chrome.scripting.executeScript({target: {tabId: tab.id}, function: () => {
            const username = document.getElementById("username");
            const password = document.getElementById("password");
            const loginButton = document.getElementById("loginbtn");

            // Since the ID of the button changes every time we need to do this shenanigan
            const confirmar = document.getElementsByClassName("btn btn-primary")[0]
            if (confirmar) {
                  if (confirmar.id.startsWith("single_button")) {
                        confirmar.click();
                  }
            }

            // Set the username and password values according to the values stored in the chrome storage
            chrome.storage.sync.get(['username', 'password'], (result) => {
                  username.value = result.username;
                  password.value = result.password;

                  // Click the login button
                  loginButton.click();
            });
      }});
}

const waitFormSubmit = (tab) => {
      chrome.scripting.executeScript({target: {tabId: tab.id}, function: () => {
            const username = document.getElementById("username");
            const password = document.getElementById("password");
            const loginButton = document.getElementById("loginbtn");

            // Since the ID of the button changes every time we need to do this shenanigan
            const confirmar = document.getElementsByClassName("btn btn-primary")[0]
            if (confirmar) {
                  if (confirmar.id.startsWith("single_button")) {
                        confirmar.click();
                  }
            }

            loginButton.addEventListener('click', () => {
                  chrome.storage.sync.set({username: username.value, password: password.value}, () => {
                        console.log('User credentials saved to the chrome storage');
                  });
            });
      }});
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

            // Get the current tab
            const tab = tabs[0];
            // Get the current tab url
            const url = tab.url;
      
            if (url === 'https://ead.ipleiria.pt/2025-26/login/index.php') {
                  console.log('User is on the login page');

                  chrome.storage.sync.get(['username', 'password'], (result) => {
                        if (result.username && result.password) {
                              console.log('User credentials found in the chrome storage');
                              login(tab);
                        } else {
                              console.log('User credentials not found in the chrome storage');
                              waitFormSubmit(tab);
                        }
                  });
            }
      });
});
