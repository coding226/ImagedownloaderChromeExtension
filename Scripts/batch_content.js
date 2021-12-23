/*let currentTime = new Date();
let currentDate = currentTime.getFullYear()+"."+(currentTime.getMonth()+1)+"."+currentTime.getDate();
currentTime = currentTime.getHours()+"."+currentTime.getMinutes()+"."+currentTime.getSeconds();
let url = new URL(window.location.href);
let domainName = url.hostname;
let stockObject = {  //populate an object to be save, it contains basic information
  pageURL: window.location.href,
  domain: domainName,
  titleName: document.title,
  date: currentDate,
  time: currentTime,
  tabType: domainName,
  incognito: chrome.extension.inIncognitoContext
};*/

if (window.location.href.indexOf("https://www.furaffinity.net/view") > -1 && stockObject.domain == "www.furaffinity.net") {
  chrome.storage.local.get(null, function(old){
    var currentCount = old.targetCount;
    if (currentCount < old.imageCount) { //if count hasn't been met and there's still a next
      currentCount++;
      furaffinityPage(null, stockObject, "batch");
      if ($("a:contains('Next')").length == 0) { //if there's no next
        chrome.storage.local.set({imageCount: currentCount}); //set imageCount as current as end of progress
      }
      console.log("ongoing: ",old.batch,"; errors:",old.errorList,"; total ",old.targetCount);
      chrome.storage.local.set({targetCount: currentCount});
    }
    if (old.downloadAllStatus) {
      furaffinityPage(null, stockObject, old.downloadAllStatus);
    }
    if (currentCount == old.imageCount) { //if count has been met
      console.log("finished: ",old.batch,";errors:",old.errorList,old.targetCount);
    }
  });
}

if (window.location.href.indexOf("www.hentai-foundry.com/pictures/") > -1 && stockObject.domain == "www.hentai-foundry.com") {
  chrome.storage.local.get(null, function(old){
    //console.log("hf", old.downloadAllStatus);
    if (old.downloadAllStatus) {
      console.log("hf1", old.downloadAllStatus);
      //hfBatch();
      hFpage(null, stockObject)
    }
  });
}
if (window.location.href.indexOf("www.newgrounds.com/") > -1 && stockObject.domain == "www.newgrounds.com") {
  chrome.storage.local.get(null, function(old){
    //console.log("nG", old.downloadAllStatus);
    if (old.downloadAllStatus) {
      //console.log("nG1", old.downloadAllStatus);
      //newGroundBatch();
      newGroundpage(null, stockObject);
    }
  });
}
if (window.location.href.indexOf("https://www.deviantart.com/") > -1 && stockObject.domain == "www.deviantart.com") {
  chrome.storage.local.get(null, function(old){
    //console.log("dA", old.downloadAllStatus);
    if (old.downloadAllStatus) {
      console.log("dA1", old.downloadAllStatus);
      deviantArtPage(null, stockObject,true);
    }
  });
}

function twitterBatch(articleList) {
  chrome.storage.local.get(null, function(old){
    currentCount = old.count;
    if (currentCount == old.imageCount || (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      console.log("finished: ",old.batch,";errors:",old.errorList,old.count);
    }
    if (currentCount < old.imageCount && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      console.log("ongoing: ",old.batch,"; errors:",old.errorList,"; total ",old.count);
      chrome.storage.local.set({count: currentCount});
      var target = articleList.length;
      if (old.imageCount < articleList.length) {
        target = old.imageCount;
      }
      for (var v = 0; v < target; v++) {
        var givenBatch = setTimeout(twiBatch(articleList[v], old.batch, old.errorList),1000);
        if (givenBatch.length >= old.batch.length+1) {
          currentCount++;
        }
        //console.log(currentCount, givenBatch);
        chrome.storage.local.set({batch: givenBatch, count: currentCount});

        if (v == old.imageCount-1) {
          console.log("finished: ",old.batch,";errors:",old.errorList,old.count);
        }
      }
      if (currentCount < old.imageCount) {
        console.log(currentCount, givenBatch);
        window.scrollBy(0,window.innerHeight/2);
        twitterBatch($("article"));
      }
    }
  });
}

function twiBatch(givenArticle, batch, errorList) {
  var currentTime = new Date();
  var currentDate = currentTime.getFullYear()+"."+(currentTime.getMonth()+1)+"."+currentTime.getDate();
  var currentTime = currentTime.getHours()+"."+currentTime.getMinutes()+"."+currentTime.getSeconds();
  var returnObj = {
    domainName: "twitter",
    date: currentDate,
    time: currentTime};
  //currentCount++;
  //console.log(articleList[v], currentCount);
  var article = givenArticle;
  try {
    returnObj.pageURL = $(article).find("A > time")[0].closest("A").href;
    returnObj.pageCode = returnObj.pageURL.split("/")[5];
    var userBannerText = $(article).find("[class='css-1dbjc4n r-1wbh5a2 r-dnmrzs']")[1].textContent.split("@");
    returnObj.userName = userBannerText[0];
    returnObj.userCode = returnObj.pageURL.split("/")[3];

    var imageList = $(article).find("img").slice(1);
    var batchList = [];

    for (var i = 0; i < imageList.length; i++) {
      var imageObj = Object.assign({},returnObj);
      var imageWrap = imageList[i];
      imageObj.imageLink = imageWrap.src.split("?")[0] + "." + imageWrap.src.split("/")[imageWrap.src.split("/").length - 1].split("?")[1].substring(7,10) +
        twitterImageOriginal;
      if (imageList.length > 1) {
        imageObj.type = "batch";
        imageObj.imageNo = i+1;
      }
      batchList.push(imageObj);
    }
    if (batchList.length == 1) {
      batchList = batchList[0];
    }

    console.log(batch, givenArticle, returnObj);
    batch.push(returnObj);
    return batch;
  } catch(e) {
    console.log(e, givenArticle, returnObj);
    errorList.push({e, returnObj});
    chrome.storage.local.set({errorList: errorList});
    return batch;
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.storage.local.get(null, function(old) {
    if (request.message == "start action") {
      console.log("start: ",old.batch,";errors:",old.errorList,"; total ",old.targetCount);
      chrome.storage.local.set({targetCount: 0, batch: [], errorList: []});
      if (window.location.href.indexOf("twitter.com/") > -1) {twitterBatch($("article"));}
    } else if (request.message == "stop action") {
      var currentCount = old.targetCount;
      console.log("end: ",old.batch,";errors:",old.errorList,old.targetCount);
      chrome.storage.local.set({imageCount: currentCount});
    } else if (request.message == "started download") {
      var currentCount = old.targetCount;
      console.log("start download: ",old.batch,";errors:",old.errorList,old.targetCount);
      chrome.storage.local.set({imageCount: currentCount});
      chrome.runtime.sendMessage({BatchList: old.batch, operation: "download"});
    }
  });
});
