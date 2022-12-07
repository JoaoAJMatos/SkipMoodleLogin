console.log('Starting extension...');

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

            // Get the current tab
            const tab = tabs[0];
            // Get the current tab url
            const url = tab.url;
      
            if (url === 'https://ead.ipleiria.pt/2022-23/login/index.php') {
                  console.log('User is on the login page');

                  // If we are able to get the password and username from the chrome storage, then we can proceed to login
                  if (chrome.storage.sync) {
                        chrome.storage.sync.get(['username', 'password'], (result) => {
                              if (result.username && result.password) {
                                    console.log('User credentials found in the chrome storage');
                                    console.log(result.username);
                                    console.log(result.password);

                                    chrome.scripting.executeScript({target: {tabId: tab.id}, function: () => {
                                          const username = document.getElementById("username");
                                          const password = document.getElementById("password");
                                          const loginButton = document.getElementById("loginbtn");
            
                                          // Click the confirm button
                                          const confirmar = document.getElementsByClassName("btn btn-primary")[0]
                                          if (confirmar) {
                                                confirmar.click();
                                          }
            
                                          // Set the username and password values according to the values stored in the chrome storage
                                          chrome.storage.sync.get(['username', 'password'], (result) => {
                                                username.value = result.username;
                                                password.value = result.password;

                                                // Click the login button
                                                loginButton.click();
                                          });
                                    }});
                              } else {
                                    console.log('User credentials not found in the chrome storage');

                                    // If we are not able to get the password and username from the chrome storage, then we need to ask the user to input them
                                    chrome.scripting.executeScript({target: {tabId: tab.id}, function: () => {
                                          const username = document.getElementById("username");
                                          const password = document.getElementById("password");
                                          const loginButton = document.getElementById("loginbtn");

                                          loginButton.addEventListener('click', () => {
                                                chrome.storage.sync.set({username: username.value, password: password.value}, () => {
                                                      console.log('User credentials saved to the chrome storage');
                                                });
                                          });
                                    }});
                              }
                        });
                  }
            }
      });
});
