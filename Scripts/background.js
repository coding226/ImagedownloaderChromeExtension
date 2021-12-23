var globalGivenObj, globalGivenName;
var currentGivenPage, currentBatchList;
const nameList = ["AsteriskReplacement","BSlashReplacement"," ColonReplacement"," DQuoateReplacement","DeviantArtName","DotReplacement","FSlashReplacement"
,"GeneralName","GeqReplacement","HFName","InstagramName","LeqReplacement","QuestionReplacement","RedditName","TildReplacement","TumblrName",
"TwitterName","VBarReplacement","dAUserFolder","furUserFolder","furaffinityName","imgurName","individualSave","instaUserFolder","newGroundsName","subRedditFolder","tumblrUserFolder","twitterUserFolder"];
const keyList = ["{Domain}","{Page URL}","{Title}","{Page Code}","{User Code}","{imageNo}","{User Name}","{Date}","{Time}","{Original User}","{Original Code}","{Original URL}","{SubReddit}"];

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    bkg.log("recieved",message);
    if (message.CurrentPage != null) {
      currentGivenPage = message.CurrentPage;
      //sendMessage({operation: "printMessage", content: message.CurrentPage, message:" indid recieved" });
      if (message.operation == "download") {
        if (message.CurrentPage.domain == "www.deviantart.com") {
          chrome.storage.local.get(["dABatch","dABatchReady"],(given)=>{
            let holder = given.dABatch;
            bkg.log(given, holder);
            holder.push(message.CurrentPage);
            sendMessage({operation: "printMessage", content: holder, message: `indid ${given}` });
            chrome.storage.local.set({dABatch: holder});
            if (message.CurrentPage.type = "intercept - all") chrome.tabs.remove(sender.tab.id);
          });
        }
        pageCheck(message.CurrentPage);
      }
    }
    if (message.BatchList != null) {
      bkg.log(message.BatchList, "batch recieved");
      sendMessage({operation: "printMessage", content: message.BatchList, message:" batch recieved7" });
      currentBatchList = message.BatchList;
      if (message.operation == "download")  batchCheck(message.BatchList);
    }
    //close current tab from image
    if (message.closeThisPage) chrome.tabs.remove(sender.tab.id);
    if (message.errorInfo != null) errorBar(errorInfo);
  }
);

function nameChange(givenObj, givenStorageObj) {
  var givenName, foldername = "";
  var imageNoRe, imageNoAn, downloadID=[];
  bkg.log("start",givenObj);

  switch(givenObj.domain) {
    case "www.reddit.com":
      givenName = givenStorageObj.RedditName;
      if (givenStorageObj.subRedditFolder) foldername = "r-" + givenObj.subReddit + "/" + foldername;
      break;
    case "www.deviantart.com":
      givenName = givenStorageObj.DeviantArtName;
      if (givenStorageObj.dAUserFolder) foldername = "dA - "+givenObj.userName + "/";
      break;
    case "mobile.twitter.com":
    case "twitter.com":
      givenName = givenStorageObj.TwitterName;
      if (givenStorageObj.twitterUserFolder) foldername = "@" + givenObj.userCode + "/";
      break;
    case "www.furaffinity.net":
      givenName = givenStorageObj.furaffinityName;
      if (givenStorageObj.furUserFolder) foldername = givenObj.userName + "/";
      break;
    case "www.instagram.com":
      givenName = givenStorageObj.InstagramName;
      if (givenStorageObj.instaUserFolder) foldername = "Instagram - @" + givenObj.userName + "/" + foldername;
      break;
    case "www.tumblr.com":
      givenName = givenStorageObj.TumblrName;
      if (givenStorageObj.tumblrUserFolder) foldername = givenObj.userName + "/" + foldername;
      break;
    case "www.hentai-foundry.com":
      givenName = givenStorageObj.HFName;
      if (givenStorageObj.hFUserFolder) foldername = "HF - "+givenObj.userName + "/";
      break;
    case "www.newgrounds.com":
      givenName = givenStorageObj.newGroundsName;
      if (givenStorageObj.nGUserFolder) foldername = "nG - "+givenObj.userName + "/";
      break;
    case "imgur.com":
      givenName = givenStorageObj.imgurName;
      if (givenObj.title == undefined) {
        givenName = givenName.replace(/ - {Title}/g, "");
      } else {
        givenName = givenName.replace(/{Title}/g, givenObj.title);
      }
      if (givenObj.userName == undefined) {
        givenName = givenName.replace(/ - {User Name}/g, "");
      } else {
        givenName = givenName.replace(/{User Name}/g, givenObj.userName);
      }
      if (givenObj.batch) {
        foldername = givenName + "/";
      }
      if (givenStorageObj.imgurUserFolder) {
        foldername = givenObj.userName + "/";
      }
      break;
    case "www.xiaohongshu.com":
      givenName = givenStorageObj.XiaoHongShuName;
      if (givenStorageObj.xiaoHongShuUserFolder) foldername = "XHS"+givenObj.userName + "/";
      break;
    default:
      givenName = givenStorageObj.GeneralName;
  }


  if (givenObj.batch) foldername += nameModifier(givenName,givenObj, true).trim() + "/";
  givenName = nameModifier(givenName,givenObj, false);
  givenName = givenName.replace(/</g, givenStorageObj.GeqReplacement);
  givenName = givenName.replace(/>/g, givenStorageObj.LeqReplacement);
  givenName = givenName.replace(/:/g, givenStorageObj.ColonReplacement);
  givenName = givenName.replace(/\"/g, givenStorageObj.DQuoateReplacement);
  givenName = givenName.replace(/\//g, givenStorageObj.FSlashReplacement);
  givenName = givenName.replace(/\\/g, givenStorageObj.BSlashReplacement);
  givenName = givenName.replace(/\|/g, givenStorageObj.VBarReplacement);
  givenName = givenName.replace(/\?/g, givenStorageObj.QuestionReplacement);
  givenName = givenName.replace(/\*/g, givenStorageObj.AsteriskReplacement);
  givenName = givenName.replace(/\~/g, givenStorageObj.TildReplacement);
  givenName = givenName.replace(/\./g, givenStorageObj.DotReplacement);
  givenName = givenName.trim();

  givenName = foldername + givenName + "." + givenObj.fileExt;

  bkg.log("procced to download ",foldername, " - fold; name - ", givenName);
  sendMessage({operation: "printMessage", content: `${givenObj} + ${givenObj.imageLink}` });

  if (givenObj.batch) {
    chrome.downloads.download({
      url: givenObj.imageLink,
      filename: givenName,
      saveAs: givenStorageObj.batchSave
    }, function(downloadID) {
      if (downloadID == undefined) {
        bkg.log("error: "+ givenObj.imageLink+" ; " + givenName);
        var errlist = givenStorageObj.console.errorList;
        chrome.storage.local.set({errorList: errlist});
      }
      currentGivenPage = null, currentBatchList= null;
    });
  } else if (givenObj.type == "intercept" || givenObj.type == "intercept - all") {
    currentGivenPage = givenObj;
    globalGivenName = givenName;
    chrome.downloads.download({
      url: givenObj.imageLink,
      filename: givenName,
      saveAs: givenStorageObj.individualSave
    });
    chrome.downloads.onDeterminingFilename.addListener(changeDDLName(downloadItem, suggest));
  } else {
  sendMessage({operation: "printMessage", content: givenObj, message:"downloadin" });
    chrome.downloads.download({
      url: givenObj.imageLink,
      filename: givenName,
      saveAs: givenStorageObj.individualSave
    }, function(downloadID) {
      if (downloadID == undefined) {
        bkg.log("error: "+ givenObj.imageLink+" ; " + givenName);
        sendMessage({operation: "printMessage", content: givenName, message:"errored" });
        const errlist = givenStorageObj.console.errorList;
        chrome.storage.local.set({errorList: errlist});
      }
      currentGivenPage = null, currentBatchList= null;
    });
  }
}

function keyWordReplacer(givenName, givenObj, suppressible) {
  let objectKey;
  for (var i = 0; i < keyList.length; i++) {
    if (givenName.indexOf(keyList[i]) != -1) { //if givenName has the key
      objectKey = (keyList[i].substring(1,keyList[i].length-1).charAt(0).toLowerCase()
        +keyList[i].substring(1,keyList[i].length-1).slice(1)).replace(/\s/g, '');//key value, helps with later functs
    if (suppressible == true && objectKey == "imageNo") return ">NonE-<";
     else if (givenObj[objectKey] == ">-No-"+objectKey+"-<" || (objectKey=="i" && !givenObj.incognito))  return ">NonE-<";//item doesn't exist & can be repressed
     else if (objectKey=="i" && givenObj.incognito)  givenName = givenName.replace("{i}", "[i]");
     else givenName = givenName.replace(keyList[i],givenObj[objectKey]);} //replace key with item
  }
  return givenName;
}
function nameModifier(givenName, givenObj, batches) { //finds items that are cut-off section
  let toReturn = "", list = givenName.split("${$");
  for (var i = 0; i < list.length; i++) {
    if (list[i].indexOf("$}$") != -1) {
      if (keyWordReplacer(list[i].substring(0,list[i].indexOf("$}$")),givenObj,batches) == ">NonE-<") //none-exsting
        list[i] = keyWordReplacer(list[i].slice(list[i].indexOf("$}$")+3),givenObj, batches); //simply corp out the suppressibleelse
        list[i] =
        keyWordReplacer(list[i].substring(0,list[i].indexOf("$}$")),givenObj, false) //replaced syntax
        +list[i].slice(list[i].indexOf("$}$")+3); //rest of the segment
    } else {
      if (i != 0) list[i] = "${$"+list[i]; //if not the first item, then add a supp bracket by the user
    }
    toReturn += keyWordReplacer(list[i],givenObj, false);
  }
  return toReturn;
}

function changeDDLName(downloadItem, suggest){
  chrome.storage.local.set({dAReady: false});
  if (currentGivenPage != null && currentGivenPage.type == "intercept" && downloadItem.url == currentGivenPage.imageLink) {
    bkg.log("intercept ",currentGivenPage, " ; ", downloadItem);
    sendMessage({operation: "printMessage", content: "", message:"gonna change name" });
    suggest({filename: globalGivenName, conflictAction: "uniquify"});
  } else if (currentGivenPage != null && currentGivenPage.type == "intercept" ) {
    sendMessage({operation: "printMessage", content: currentGivenPage, message:"error" });
    bkg.log("error: ", currentGivenPage.imageLink ,downloadItem.url,(downloadItem.url == currentGivenPage.imageLink),currentGivenPage, " ; ", downloadItem );
  } else {
    bkg.log(downloadItem, currentGivenPage);
    sendMessage({operation: "printMessage", content: downloadItem, message:"else?" });
  }
  chrome.storage.local.set({dAReady: true});
  removeEventListner(changeDDLName);
}

function pageCheck(givenObj) {
  let currentPage = givenObj;
  if (givenObj.editable != null) currentPage = currentGivenPage;
  //bkg.log(currentPage, "general");
  if (currentPage.type == "intercept") {
      familiarPage(currentPage);
  } else if (currentPage.type == "intercept - all") {
    let timerCondition = setInterval(()=>{
      chrome.storage.local.get(["dABatch","dAReady"],(given)=>{
        if (given.dABatch.length > 0 && given.dAReady) {
          bkg.log(given.dABatch,given.dAReady);
          familiarPage(given.dABatch[0]);
          chrome.storage.local.set({dABatch: given.dABatch.splice(1,given.dABatch.length)});
        }
        if (given.dABatch.length == 0)  clearInterval(timerCondition);
      });
    },1000);
  } else {
    familiarPage(currentPage);
    bkg.log(currentPage, "downloaded");
  }
}

function batchCheck(givenList) {
  sendMessage({message: "printMessage",content: givenList, message:" batch starsw" });
  let currentBatch = givenList;
  if (givenList.editable != null) currentBatch = currentBatchList;
  //sendMessage({message: "printMessage",content: currentBatch, message:"batch planted" });
    if (currentBatch.domain == "www.instagram.com") {
      bkg.log(currentBatch,"insta");
      chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {operation: "Insta - complete batch", objectStock: currentGivenPage}, response => {
          if (response != undefined) {
            bkg.log(response,"insta");
            for (var i = 0; i < response.length; i++) {
              familiarPage(response[i]);
            }
          }
        });});
    } else if (currentBatch.domain == "www.deviantart.com") {
      sendMessage({message: "printMessage",content: currentBatch, message:" deviant" });
        chrome.storage.local.get("dAReady",(given)=>{
        let timerCondition = setInterval(()=>{
          if (currentBatch.currentBatch.length > 0 && given.dAReady) {
            chrome.tabs.create({ url: currentBatch.currentBatch[0]});
            currentBatch.currentBatch = currentBatch.currentBatch.splice(1,currentBatch.currentBatch.length);
          }
          if (currentBatch.currentBatch.length == 0)  clearInterval(timerCondition);
        },2500);
      });
    } else {
      bkg.log("asda", currentBatch);
      sendMessage({message: "printMessage",content: currentBatch, message:" batch started" });
      for (var i = 0; i < currentBatch.length; i++) {
        familiarPage(currentBatch[i]);
      }
    }
}

function familiarPage(imageObj){
  //bkg.log("called familitar",imageObj);
  //sendMessage({message: "printMessage",content: imageObj, message:"called familiar" });
  chrome.storage.sync.get(null, function(old) {
    nameChange(imageObj, old);
    bkg.log(old);
    chrome.storage.local.get(null, function(old) {bkg.log(old)});
  });
}

function sendMessage(given) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {chrome.tabs.sendMessage(tabs[0].id, given);});
}
