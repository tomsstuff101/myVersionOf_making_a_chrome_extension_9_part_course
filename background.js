chrome.runtime.onInstalled.addListener(() => {
  /****************
   * NOTE:
   * console log ISNT in the content here ie main web page
   * Instead you need to look in
   *      chrome://extensions/
   * and click on the service worker link
   *     ` Inspect views service worker `
   *
   * This will open up its own console for the background.js
   */
  console.log("Hello world- background.js exists!");

  // RECEIVING a message
  chrome.runtime.onMessage.addListener((request, sender, sendResponce) => {
    //** NOTE logging to the service worker console
    // send the tab info the user is currently on
    // console.log(
    //   sender.tab
    //     ? "current tab is -->  " + sender.tab.url
    //     : "from the extension"
    // );

    // If message has come from the Content.js, aka 'hello' then send back 'goodbye'
    if (request.greeting === "hello background, love from Content") {
      console.log("Background has received a message!");
      sendResponce({
        farewell: "Reply to Content: goodbye Content, love from Background",
      });
    }

    console.log("++++++++++++++++++++++++++++++++");
    console.log("request.filenameArray ");
    console.log(request.filenameArray);
    console.log("++++++++++++++++++++++++++++++++");

    if (request.filenameArray !== [] && request.filenameArray !== undefined) {
      let filesAddedArray = [];
      console.log("Background has received filenameArray ---> ");

      for (let index = 0; index < request.filenameArray.length; index++) {
        filesAddedArray.push({
          filename: request.filenameArray[index],
          fileURL: sender.tab.url,
        });
        //   console.log(request.filenameArray[index]);
      }
      console.table(filesAddedArray);
      sendResponce({
        gotList: "Reply to Content: I've got the list thanks",
      });
    }
  });

  // Create a simple  context menu
  chrome.contextMenus.create({
    id: "wikipedia",
    title: 'Search for "%s" on Wikipedia',
    contexts: ["selection"],
  });

  // Create a bookmark folder
  // This appears in browse tool bar as 'Other Bookmarks'
  chrome.bookmarks.create({ title: "bookmarks folder" }, function (newFolder) {
    // callback function
    console.log("added folder: ", newFolder.id);
  });

  // Creating a bookmark
  chrome.bookmarks.create(
    {
      title: "Prof Steven Keen on MMT",
      url: "https://twitter.com/ProfSteveKeen/status/1290878540854960128",
    },
    function (newBookmark) {
      console.log("added bookmark : " + newBookmark);
    }
  );
});

// Create listener for Context Menu and create a new tab
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  baseURL = "http://www.wikipedia.org/wiki/";
  let newURL = baseURL + info.selectionText;
  chrome.tabs.create({ url: newURL });
});
