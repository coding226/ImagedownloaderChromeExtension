var downloadStatusButton = document.getElementById("downloadStatus");

chrome.storage.sync.get(null, function(old){
chrome.tabs.query({
    active: true,
    currentWindow: true
}, function(tabs) {
  let tabURL = tabs[0].url;
   for (const [key, value] of Object.entries(old)) {
      if ($("#"+key).length != 0) {
        if ($("#"+key)[0].type == "checkbox") $("#"+key)[0].checked = value;
        else {
          $("#"+key)[0].value += value;
          //console.log($("#"+key)[0].value,$("#"+key)[0]);
          //$("#"+key)[0].size = Math.max(20,tabs[0].width/10);
        }
        $($("#"+key)[0]).closest("div.familiarPageEditor")[0].style.display = "none";
      }
    }
  let url = new URL(tabURL);
  let domainName = url.hostname;
  if (domainName == "www.reddit.com") domainName="subRedditFolder";//if it's reddit page
  else if (domainName == "www.deviantart.com")  domainName="DeviantArtName"; // if it's a DeviantArt page
  else if (domainName == "twitter.com" || domainName == "mobile.twitter.com")  domainName="TwitterName";// if it's a twitter page
  else if (domainName == "www.furaffinity.net")  domainName="furaffinityName"; // if it's a furfinity Page
  else if (domainName == "www.instagram.com")  domainName="InstagramName";// if it's a instagram page
  else if (domainName.split(".")[1] == "tumblr") domainName="TumblrName";// if it's a tumblr or tumblr blogs
  else if (domainName == "www.hentai-foundry.com") domainName="HFName"; // if it's a hentai-foundary page
  else if (domainName == "www.newgrounds.com") domainName="newGroundsName"; // if it's a newGrounds page
  else if (domainName == "imgur.com") domainName="newGroundsName"; // if it's a newGrounds page
  else if (domainName == "www.patreon.com") domainName="imgurName"; // if it's a patreon page
  else domainName="GeneralName";  // if it's a every other page with a image inside
  $($("[id*='"+domainName+"'")[0]).closest("div.familiarPageEditor")[0].style.display="block";
});
  var countBar = $("#imageCount")[0];

  chrome.storage.local.get(["downloadAllStatus","imageCount"], function(given){
    countBar.value = given.imageCount;
    if(given.downloadAllStatus) $("#downloadStatus")[0].textContent = "Download All: ON";
    else $("#downloadStatus")[0].textContent = "Download All: OFF";
  });
  document.addEventListener('click', function(info){
    let nameHolder = {}, nameValue;
    if (info.target.type != undefined) {
      if (info.target.textContent == "submit & run") {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {message: "start action"});
        });
        if (!isNaN(countBar.value)) {
          $("#countStatus")[0].style.visibility = "hidden";
          chrome.storage.local.set({"imageCount": parseInt(countBar.value)});
        } else {
          $("#countStatus")[0].style.visibility = "visible";
        }
      }
      if (info.target.className == "submitButton") {
        nameValue = info.target.previousSibling.previousSibling.id;
        nameHolder[nameValue] = info.target.previousSibling.previousSibling.value;
        console.log(nameHolder);
        chrome.storage.sync.set(nameHolder);
      }
      if (info.target.className == "actionButton") {
        if (info.target.textContent == "End") {
          chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "stop action"});
          });
        }
        if (info.target.textContent == "download") {
          var bkgpg = chrome.extension.getBackgroundPage();
          chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "started download"});
          });
          var list = old.batch;
          for (var i = 0; i < list.length; i++) {
            bkgpg.nameChange(list[i], old);
          }
        }
        if (info.target.id == "downloadStatus") {
          chrome.storage.local.get(null, function(old){
            chrome.storage.local.set({downloadAllStatus: !old.downloadAllStatus});
              //chrome.tabs.sendMessage(tabs[0].id, {message: "Download All"});
          });
        }
      }
      if (info.target.className == "folderNamer" || info.target.className == "saveType") {
        console.log(info.target.checked, info.target.id);
        nameValue = info.target.id;
        nameHolder[nameValue] = info.target.checked;
        console.log(nameHolder);
        chrome.storage.sync.set(nameHolder);
      }
    }

    if (info.target.textContent == "reload") {
      var bkgpg = chrome.extension.getBackgroundPage();
      chrome.runtime.reload()
    }
    if (info.target.textContent == "Open Options") {
      chrome.runtime.openOptionsPage();
    }
  });
});
chrome.storage.onChanged.addListener(function(tab) {
  if (tab != null && tab.downloadAllStatus != null) {
    let status = tab.downloadAllStatus.newValue;
    if (status) $("#downloadStatus")[0].textContent = "Download All: ON";
    else $("#downloadStatus")[0].textContent = "Download All: OFF";
  }
});
