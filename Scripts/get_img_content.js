//page source varibles
const redditPageGalleryClassIcon = "_61i6grM3um1yuw4GrN97P", redditUserNameWrap = "_2tbHP6ZydRpjI44J3syuqC _23wugcdiaj44hdfugIAlnX oQctV4n0yUb0uiHDdGnmE",redditCrosspostWrap = "_2ED-O3JtIcOqp8iIL1G5cg";
const redditTitleWrap = "--posttitletextcolor", redditURLWrap = "_3jOxDPIQ0KaOWpzvSQo-1s", redditArticle = "[data-test-id],[data-click-id='background']";
const deviantArtDownloadIcon = "a[target='_blank'][download]";
const twitterImageOriginal = ":orig", twitterUserBannerWrap = "css-1dbjc4n r-1wbh5a2 r-dnmrzs";
const twitterContentGallery = "css-1dbjc4n r-18u37iz r-1pi2tsx r-13qz1uu";
const furaffinityContentTitle = "submission-title", furaffinityCreatoreWrap = "submission-id-sub-container", furfinityNextButton = "a:contains('Next')";
const tumblrImageWrapper = "_28CuW _31Nl5", tumblrHeaderWrap = "hlOCn", tumblrArticle = "kBP3A", tumblrReblogArticle = "pzcaM", tumblrReblogBanner = "pB3nk", tumblrContent = "8ieP";
const pixivWorkWrap = "sc-1mz6e1e-1 QBVJO";
const newGTitle = "pod-head", newGUser = "item-details-main", nGPostBody = ".column.wide.right > .pod > [class='pod-body']";
const hFTitle = "imageTitle", hFUser = "boxtitle", hFcontent = "#picBox > .boxbody > img";
const imgurTitle = "Gallery-Title", imgurUser = "author-name", imgurGallery = "Gallery-Content--media", imgurVideo = "PostVideo-video-wrapper";
const instaDotList = "Yi5aA", instaHighDot = ".Yi5aA.XCodT", instaLeftButton = ".coreSpriteLeftChevron", instaRightButton = ".coreSpriteRightChevron", instaImageWrapClass = "eLAPa";
const instaContentClass = ".FFVAD,.tWeCl", instaUserBanner = "o-MQd";
var dAList = [];

function imgContentCalled() {
  return "imgContentCalled is called";
}
//console.log("called",window);

let currentTime = new Date();
let currentDate = currentTime.getFullYear()+"."+(currentTime.getMonth()+1)+"."+currentTime.getDate();
currentTime = currentTime.getHours()+"."+currentTime.getMinutes()+"."+currentTime.getSeconds();
let url = new URL(window.location.href);
let domainName = url.hostname;
let stockObject = {  //populate an object to be save, it contains basic information
  pageURL: window.location.href,
  domain: domainName,
  title: document.title,
  date: currentDate,
  time: currentTime,
  incognito: chrome.extension.inIncognitoContext
};

window.addEventListener('contextmenu', function(mouseInfo) {
  //console.log(mouseInfo.path);
  //console.log(mouseInfo.target);
  chrome.storage.local.get(null, function(old) {
    //console.log("storage object",old);
  });
  let toSend;

  if (domainName == "www.reddit.com") toSend = redditPage(mouseInfo, stockObject); //if it's reddit page
  else if (domainName == "www.deviantart.com") toSend = deviantArtPage(mouseInfo, stockObject); // if it's a DeviantArt page
  else if (domainName == "twitter.com" || domainName == "mobile.twitter.com") toSend = twitterPage(mouseInfo, stockObject); // if it's a twitter page
  else if (domainName == "www.furaffinity.net") toSend = furaffinityPage(mouseInfo, stockObject); // if it's a furfinity Page
  else if (domainName == "www.instagram.com") toSend = instaPage(mouseInfo, stockObject); // if it's a instagram page
  else if (domainName.split(".")[1] == "tumblr") toSend = tumblrPage(mouseInfo, stockObject); // if it's a tumblr or tumblr blogs
  //else if (domainName == "www.pixiv.net") pixivPage(linkList);
  else if (domainName == "www.hentai-foundry.com") toSend = hFpage(mouseInfo.target, stockObject); // if it's a hentai-foundary page
  else if (domainName == "www.newgrounds.com") toSend = newGroundpage(mouseInfo, stockObject); // if it's a newGrounds page
  else if (domainName == "imgur.com") toSend = imgurPage(mouseInfo, stockObject); // if it's a newGrounds page
  else if (domainName == "www.patreon.com") toSend = patreonPage(mouseInfo, stockObject); // if it's a patreon page
  else if (domainName == "www.xiaohongshu.com") toSend = xHBPage(mouseInfo, stockObject); // if it's a patreon page
  else toSend = networkPage(mouseInfo, stockObject); // if it's a every other page with a image inside

  for (var key in toSend) {
    if (toSend[key] != null) {
        for (const [childKey, childValue] of Object.entries(toSend[key])) {
        if (childValue == null || childValue == undefined) {
          console.log("console.error();", toSend,childKey,childValue);
          errorBar(key +" is missing "+childKey);
          return;
        }
      }
    }
  }
  if ((toSend.CurrentPage || toSend.BatchList) != null) {
    if (toSend.errorInfo == undefined) console.log("send ", toSend);
    chrome.runtime.sendMessage(toSend);
  }
});

window.onmousedown = function(event) {
  if (event.target.className != null && event.target.className.indexOf("imageDownloader_") > -1) {
    if (event.target.id == "imageDownloader_singleDownloader") {
      console.log(event.target, event);
      if (domainName == "twitter.com" || domainName == "mobile.twitter.com") chrome.runtime.sendMessage({CurrentPage: twitterPage(event, stockObject).CurrentPage,operation: "download"}) // if it's a twitter page
      else if (domainName == "www.instagram.com") chrome.runtime.sendMessage({CurrentPage: instaPage(event, stockObject).CurrentPage, operation: "download"}); // if it's a instagram page
      else if (domainName == "www.newgrounds.com") chrome.runtime.sendMessage({CurrentPage: newGroundpage(event, stockObject).CurrentPage, operation: "download"}); // if it's a newGrounds page
    } else if (event.target.id == "imageDownloader_allDownloader") {
      if (domainName == "www.instagram.com") {
        (async () => {
          const payload = await instaPage(event,stockObject);
          console.log("thumbPayload after function:", payload)
          chrome.runtime.sendMessage({BatchList: payload, operation: "download"});
        })();
      }
    }
  }
}

function redditPage(mouseInfo, stockObject) {
  try {
    let returnObj = Object.assign({},stockObject);
    let articleNo = 0;
    let article = $(mouseInfo.target).closest(redditArticle)[0];
    if ($(article).find("."+redditCrosspostWrap).length > 0) article = $(article).find("."+redditCrosspostWrap)[0];
    returnObj.pageURL = $(article).find("."+redditURLWrap)[0].href;
    returnObj.pageCode = returnObj.pageURL.split("/")[6];
    returnObj.subReddit = returnObj.pageURL.split("/")[4];
    returnObj.imageLink = mouseInfo.target.src;
    if (returnObj.imageLink.charAt(returnObj.imageLink.indexOf("preview")-1) != '-') returnObj.imageLink = returnObj.imageLink.split("?")[0].replace("preview", "i");
    returnObj.fileExt = returnObj.imageLink.split("?")[0].split(".")[returnObj.imageLink.split("?")[0].split(".").length - 1];
    if (mouseInfo.target.tagName == "VIDEO") {
      returnObj.imageLink = $(mouseInfo.target).find("source")[0].src;
      returnObj.fileExt = "mp4";
    }
    returnObj.userName = $(article).find("._2tbHP6ZydRpjI44J3syuqC._23wugcdiaj44hdfugIAlnX.oQctV4n0yUb0uiHDdGnmE")[0].textContent.split("/")[1];
    returnObj.title = $(article).find("[style^="+redditTitleWrap+"]")[0].textContent;
    return getBatches(returnObj, $(article).find("li"));
  } catch(e) {
    console.log(e);
    return {CurrentPage: null, BatchList: null, errorInfo: e};
  }
}

function deviantArtPage(mouseInfo, stockObject, operation) {
  try {
    let returnObj = Object.assign({},stockObject);
    const linkList = returnObj.pageURL.split("/");
    returnObj.pageCode = linkList[linkList.length - 1].split("-")[linkList[linkList.length - 1].split("-").length - 1];
    let workClasswrap = $("div[draggable*='true'] > img")[0];//mouseInfo.target;
    returnObj.imageLink = workClasswrap.src;
    if ($(deviantArtDownloadIcon).length != 0) {
      returnObj.imageLink = $(deviantArtDownloadIcon)[0].href;
      returnObj.type = "intercept";
    }
    returnObj.fileExt = returnObj.imageLink.split(".")[3].substring(0,3);
    returnObj.title = workClasswrap.alt;
    returnObj.userName = linkList[3];
    if (operation) {
      returnObj.type = "intercept - all";
      chrome.runtime.sendMessage({CurrentPage: returnObj, operation: "download"});
    }
    return {CurrentPage: returnObj, batchList: null};
  } catch(e) {
    console.log(e);
    for (var i = 0; i < $("a[data-hook='deviation_link'][aria-label]").length; i++) {
      if (dAList.indexOf($("a[data-hook='deviation_link'][aria-label]")[i].href) == -1) dAList.push($("a[data-hook='deviation_link'][aria-label]")[i].href);
    }
    console.log(dAList.length);
    if (e == "TypeError: Cannot read properties of undefined (reading 'src')"
    && stockObject.pageURL.indexOf("/gallery/") > -1) return {CurrentPage: null, BatchList: {domain: "www.deviantart.com", currentBatch: dAList}};
    return {CurrentPage: null, BatchList: null, errorInfo: e};
  }
}

function twitterPage(mouseInfo, stockObject) {
  try {
    let returnObj = Object.assign({},stockObject);
    let articleNo = 0;
    if (returnObj.pageURL.split("/")[returnObj.pageURL.split("/").length - 2] == "photo") {
      var article = $("article")[0];
    } else {
      var article = $(mouseInfo.target).closest("article")[0];
        if (mouseInfo.target.className == "imageDownloader_DownloadButton") {
          //console.log($(article).find("video")[0]);
          returnObj.imageLink = $(article).find("video")[0].src;
          //console.log($(article).find("a"));
          returnObj.pageURL = $(article).find("a")[2].href;
        if (returnObj.pageURL.indexOf("status") ==-1) returnObj.pageURL = $(article).find("a")[3].baseURI;
        } else {
          var imageWrap = $(mouseInfo.target).closest("A")[0];
          returnObj.pageURL = imageWrap.href.substring(0,imageWrap.href.lastIndexOf("photo"));
        }
    }
    returnObj.pageCode = returnObj.pageURL.split("/")[5];
    console.log(returnObj, returnObj.pageCode, returnObj.pageURL);
    let userBannerText = $(article).find("[role='link']")[1].textContent.split("@");
    returnObj.userName = userBannerText[0];
    returnObj.userCode = returnObj.pageURL.split("/")[3];
    if (mouseInfo.target.className == "imageDownloader_DownloadButton") {
      returnObj.imageLink = $(article).find("video")[0].src;
      returnObj.fileExt = returnObj.imageLink.split(".")[returnObj.imageLink.split(".").length - 1];
    } else {
      returnObj.fileExt = mouseInfo.target.src.split("/")[mouseInfo.target.src.split("/").length - 1].split("?")[1].substring(7,10);
      returnObj.imageLink = mouseInfo.target.src.split("?")[0] + "." + returnObj.fileExt + twitterImageOriginal;
    }
    if ($(article).find("[class='"+twitterContentGallery+"']").length != 0) returnObj.imageNo = imageWrap.href.split("/")[imageWrap.href.split("/").length-1];
    return getBatches(returnObj, $($(article).find("[class='"+twitterContentGallery+"']")[0]).find("A"));
  } catch(e) {
    console.log(e);
    return {CurrentPage: null, BatchList: null, errorInfo: e};
  }
}

function furaffinityPage(mouseInfo, stockObject, operation) {
  try {
    let returnObj = Object.assign({},stockObject);
    returnObj.title = $("div."+furaffinityContentTitle)[0].innerText;
    returnObj.pageCode = returnObj.pageURL.split("/")[4];
    if (mouseInfo != null) {
      returnObj.imageLink = mouseInfo.path[0].src;
      returnObj.userName = $(mouseInfo.path[3]).find("."+furaffinityCreatoreWrap)[0].children[1].innerText;
    } else {
      returnObj.imageLink = $("#submissionImg")[0].src;
      returnObj.userName = $("[class='"+furaffinityCreatoreWrap+"']")[0].children[1].textContent;
    }
    returnObj.fileExt = returnObj.imageLink.split(".")[returnObj.imageLink.split(".").length - 1];
    if (operation == "batch") {
      chrome.storage.local.get(null, function(old){
        let batch = old.batch;
        batch.push(returnObj);
        chrome.storage.local.set({batch: batch});
        if ($(furfinityNextButton).length > 0) $(furfinityNextButton)[0].click();
      });}
    if (operation == true) chrome.runtime.sendMessage({CurrentPage: returnObj, operation: "download", closeThisPage: true});
    else return {CurrentPage: returnObj};
  } catch(e) {
    if (operation == "batch") {
      console.log("ade", operation, returnObj);
      chrome.storage.local.get(null, function(old){
      var errlist = old.errorList;
        errlist.push(window.location.href);
        errlist.push(e);
        chrome.storage.local.set({errorList: errlist});
        $(furfinityNextButton)[0].click();
      });
    }
    console.log(e);
    return {CurrentPage: null, BatchList: null, errorInfo: e};
  }
}

function tumblrPage(mouseInfo, stockObject) {
  try {
    let returnObj = Object.assign({},stockObject);
    returnObj.title = ">-No-Title-<";
    returnObj.imageLink = mouseInfo.target;//mouseInfo.target.srcset.split(",")[mouseInfo.path[0].srcset.split(",").length-1].split(" ")[1],
    returnObj.imageLink = returnObj.imageLink.src;
    let article = $(mouseInfo.target).closest("article")[0];
    //console.log(article.children);
    let articleHeader = $(article).find("header")[0];
    let userDataNo = $(articleHeader).find("a."+tumblrHeaderWrap).length-1;
    let articleContent = $(mouseInfo.target).closest("."+tumblrArticle)[0];
    if ($(mouseInfo.target).closest("."+tumblrReblogArticle).length > 0) {
      articleContent = $(mouseInfo.target).closest("."+tumblrReblogArticle)[0];
      console.log("art",$(articleContent).find("."+tumblrReblogBanner)[0],articleContent);
      const originalUserBanner = $($(articleContent).find("."+tumblrReblogBanner)[0]).find("a."+tumblrHeaderWrap)[1];
      returnObj.originalURL = originalUserBanner.href;
      returnObj.originalUser = originalUserBanner.textContent;
      returnObj.originalCode = returnObj.originalURL.split("/")[returnObj.originalURL.split("/").length - 2];
      userDataNo = 1;
      articleContent = $(mouseInfo.target).closest("."+tumblrReblogArticle)[0];
      //console.log("new",$(articleHeader).find("a."+tumblrHeaderWrap)[$(articleHeader).find("a."+tumblrHeaderWrap).length-2],$($(articleContent).find(".pB3nk")[0]).find("a."+tumblrHeaderWrap)[1]);
    }
    returnObj.pageURL = $(articleHeader).find("a."+tumblrHeaderWrap)[userDataNo].href;
    returnObj.userName = $(articleHeader).find("a."+tumblrHeaderWrap)[userDataNo].textContent;
    //console.log("OG",$(articleHeader).find("a."+tumblrHeaderWrap)[1],returnObj.pageURL, returnObj.userName);

    returnObj.pageCode = returnObj.pageURL.split("/")[returnObj.pageURL.split("/").length - 1];
    if (isNaN(returnObj.pageCode)) {
      returnObj.pageCode = returnObj.pageURL.split("/")[returnObj.pageURL.split("/").length - 2];
      returnObj.title = returnObj.pageURL.split("/")[returnObj.pageURL.split("/").length - 1];
    }

    let imageWrap = $(mouseInfo.target).closest("img")[0];
    returnObj.imageLink = imageWrap.srcset.split(",")[imageWrap.srcset.split(",").length - 1];
    returnObj.imageLink = returnObj.imageLink.slice(1, returnObj.imageLink.lastIndexOf(" "));
    returnObj.fileExt = returnObj.imageLink.slice(returnObj.imageLink.lastIndexOf(".")+1,returnObj.imageLink.length);
    if (returnObj.originalUser == undefined) returnObj.originalUser = ">-No-originalUser-<";
    if (returnObj.originalCode == undefined) returnObj.originalCode = ">-No-originalCode-<";
    if (returnObj.originalURL == undefined) returnObj.originalURL = ">-No-originalURL-<";
    let contentList = $(articleContent).find("img[class*="+tumblrContent+"]");
    //console.log("nop", contentList, articleContent);
    return getBatches(returnObj, contentList);
  } catch(e) {
    console.log(e);
    return {CurrentPage: null, BatchList: null, errorInfo: e};
  }
}

function hFpage(mouseInfo, stockObject) {
  try {
    let returnObj = Object.assign({},stockObject), imageWrap = mouseInfo;
    if (imageWrap == null) imageWrap = $(hFcontent)[0];
    returnObj.imageLink = imageWrap.src;
    returnObj.pageCode = returnObj.pageURL.split("/")[6];
    try {
      returnObj.fileExt = imageWrap.getAttribute('onclick').split("\'")[1].split(".")[returnObj.imageLink.split(".").length - 1];
    } catch(e) {
      returnObj.fileExt = returnObj.imageLink.split(".")[returnObj.imageLink.split(".").length - 1];
    }
    returnObj.title = $(document).find("."+hFTitle)[0].textContent;
    returnObj.userName = $($(document).find("."+hFUser)[1]).find('A')[0].textContent;
    if (mouseInfo == null) chrome.runtime.sendMessage({CurrentPage: returnObj, operation: "download", closeThisPage: true});
    else return {CurrentPage: returnObj, batchList: null};
  } catch(e) {
    console.log(e);
    return {CurrentPage: null, BatchList: null, errorInfo: e};
  }
}

function newGroundpage(mouseInfo, stockObject) {
  try {
    let returnObj = Object.assign({},stockObject);
    if (mouseInfo==null) {
      if ($($(nGPostBody+ " > .image")[0]).find("img")[0].className == "imageDownloader_DownloadButton") {
        returnObj.imageLink = $(document).find("source")[0].src;
      } else {
        returnObj.imageLink = $($(nGPostBody+ " > .image")[0]).find("img")[0].src;
      }
    } else {
      if (mouseInfo.target.className == "imageDownloader_DownloadButton") returnObj.imageLink = $(document).find("source")[0].src;
      else returnObj.imageLink = mouseInfo.target.src;
    }
    returnObj.fileExt = returnObj.imageLink.split("?")[0].split(".")[returnObj.imageLink.split("?")[0].split(".").length - 1];
    returnObj.title = $($(document).find("."+newGTitle)[0]).find('h2')[0].textContent;
    returnObj.userName = $($(document).find("."+newGUser)[0]).find('a')[0].textContent;
    const toSend = getBatches(returnObj, $($(nGPostBody)[0]).find("img"));
    if (mouseInfo == null) chrome.runtime.sendMessage({BatchList: toSend.BatchList, operation: "download", closeThisPage: true});
    else return getBatches(returnObj,$($(mouseInfo.target).closest(".pod-body")[0]).find("img"))
  } catch(e) {
    console.log(e);
    return {CurrentPage: null, BatchList: null, errorInfo: e};
  }
}

function imgurPage(mouseInfo, stockObject) {
  try {
    let returnObj = Object.assign({},stockObject);
    returnObj.imageLink = mouseInfo.target.src;
    if (returnObj.imageLink == "") returnObj.imageLink = mouseInfo.target.firstChild.src;
    returnObj.fileExt = returnObj.imageLink.split("?")[0].split(".")[returnObj.imageLink.split("?")[0].split(".").length - 1];
    returnObj.title = $(document).find("."+imgurTitle)[0].firstChild.firstChild.textContent;
    try {
      returnObj.userName = $(document).find("."+imgurUser)[0].href.split("/")[4];
    } catch(e) {}
    returnObj.pageCode = returnObj.pageURL.split("/")[4];
    return getBatches(returnObj, $(document).find("."+imgurGallery));
  } catch(e) {
    console.log(e);
    return {CurrentPage: null, BatchList: null, errorInfo: e};
  }
}

function patreonPage(mouseInfo, stockObject) {
  try {
    let returnObj = Object.assign({},stockObject), contentList;
      const article = mouseInfo.target.closest("[data-tag='post-card']");//article itself
    console.log("find" ,$($(article).find(".sc-jrAGrp.gRJmcT")[1]).find("img"));//contentList
    if (returnObj.pageURL.split("/")[3] == "home") {
      returnObj.imageLink = mouseInfo.target.src;
      returnObj.fileExt = returnObj.imageLink.split("?")[0].split(".")[returnObj.imageLink.split("?")[0].split(".").length - 1];
      returnObj.titleName = $(article).find("[data-tag='post-title']")[0].textContent;
      returnObj.pageURL = $(article).find("[data-tag='post-published-at']")[0].href;
      returnObj.userName = returnObj.pageURL.split("/")[3];
      contentList = $($(article).find(".sc-jrAGrp.gRJmcT")[1]).find("img");
      if ($(article).find(".sc-jrAGrp.hJpaLq").length > 0) returnObj.attachmentList = $($(article).find(".sc-jrAGrp.hJpaLq")[0]).find("a");
    } else if (returnObj.pageURL.split("/")[3] == "posts") {//sigle post
      returnObj.imageLink = mouseInfo.target.src;
      returnObj.fileExt = returnObj.imageLink.split("?")[0].split(".")[returnObj.imageLink.split("?")[0].split(".").length - 1];
      returnObj.titleName = $(article).find("[data-tag='post-title']")[0].textContent;
      returnObj.pageURL = $(article).find("[data-tag='post-published-at']")[0].href;
      returnObj.userName = returnObj.pageURL.split("/")[3];
    } else { //user page
      returnObj.imageLink = mouseInfo.target.src;
      returnObj.fileExt = returnObj.imageLink.split("?")[0].split(".")[returnObj.imageLink.split("?")[0].split(".").length - 1];
      returnObj.titleName = $(article).find("[data-tag='post-title']")[0].textContent;
      returnObj.pageURL = $(article).find("[data-tag='post-published-at']")[0].href;
      returnObj.userName = returnObj.pageURL.split("/")[3];
    }
    if (returnObj.userName == "posts" || returnObj.userName == "home") {
      //returnObj.userName = $(document).find("[target='_self']")[0].href.split("/")[3];
    }
    //console.log("mouse",getBatches(returnObj,$(mouseInfo.target.closest(".sc-jrAGrp.gRJmcT")).find("img")));
    return getBatches(returnObj,contentList/*$($(mouseInfo.target).closest(".pod-body")[0]).find("img")*/);
  } catch(e) {
    console.log(e);
    return {CurrentPage: null, BatchList: null, errorInfo: e};
  }
}

function xHBPage(mouseInfo, stockObject) {
  try {
    let returnObj = Object.assign({},stockObject);
    for(var i = 0; i < $("script:contains('red_id')")[0].innerHTML.split(",").length; i++){
      if ($("*:contains('red_id')")[2].innerHTML.split(",")[i].indexOf("red_id") > -1) {
        returnObj.userCode = $("script:contains('red_id')")[0].innerHTML.split(",")[i];
        returnObj.userCode = returnObj.userCode.split(":")[1].substring(1,returnObj.userCode.split(":")[1].length-1);
      }
    }
    //$($(mouseInfo.target).prev()[0]).find("li[style='width: 500px; height: 500px;']")//current
    //returnObj.pageURL = $(article).find("."+redditURLWrap)[0].href;
    let bkgImg = $($($(mouseInfo.target.parentElement).prev()[0]).find("li[style='width: 500px; height: 500px;']")[0]).find("span")[0].style.backgroundImage;
    returnObj.imageLink = bkgImg.substring(bkgImg.indexOf("ci"),bkgImg.indexOf("\")"));
    console.log($(".name-detail")[0].innerText);
    returnObj.fileExt = returnObj.imageLink.split("/")[returnObj.imageLink.split("/").length - 1];
    returnObj.userName = $(".name-detail")[0].innerText;
    returnObj.title = $(".title")[0].innerText;
    returnObj.pageCode = returnObj.pageURL.split("/")[returnObj.pageURL.split("/").length-1];
    //console.log(getBatches(returnObj, $($(class='change-pic').prev()[0]).find("li")));
    return getBatches(returnObj, $($(mouseInfo.target.parentElement).prev()[0]).find("li"));
  } catch(e) {
    console.log(e);
    return {CurrentPage: null, BatchList: null, errorInfo: e};
  }
}

function networkPage(mouseInfo, stockObject) {
  try {
    let returnObj = Object.assign({},stockObject);
    returnObj.imageLink = mouseInfo.target.src;
    returnObj.fileExt = returnObj.imageLink.split(".")[returnObj.imageLink.split(".").length - 1];
    //console.log(returnObj);
    return {CurrentPage: returnObj, BatchList: null};
  } catch(e) {
    console.log(e);
    return {CurrentPage: null, BatchList: null, errorInfo: e};
  }
}

function instaPage(mouseInfo, stockObject) {
  try {
    var article = $(mouseInfo.target).closest("article")[0], contentList=[], batchList = [],returnObj = Object.assign({},stockObject), intervalStatus, contentObj;
    returnObj.userName = $($(article).find("DIV[class*='"+instaUserBanner+"']")[0]).find("a")[0].textContent;
    let articleLink = $(article.lastChild).find("a")[$(article.lastChild).find("a").length - 1].href;
    returnObj.pageCode = articleLink.split("/")[articleLink.split("/").length - 2];
    if (mouseInfo.target.id == "imageDownloader_allDownloader") {
      //console.log("called upon", returnObj);
      let dotList = Array.prototype.slice.call($(article).find("[class*='"+instaDotList+"']"));
       if (dotList.indexOf($(article).find(instaHighDot)[0]) == dotList.length-1) {
        dir = true;
      } else { //leftmost
        for (var i = dotList.indexOf($(article).find(instaHighDot)[0]); i > 0 ; i--) {
          $(instaLeftButton)[0].click();
        }
        dir = false;
      }console.log(dir/*,$($("IMG[src='"+returnObj.imageLink+"']")[0]).closest("article")[0],$("IMG[src='"+returnObj.imageLink+"']")*/);
    return new Promise((resolve, reject) => {
      intervalStatus = setInterval(function () {
        if (contentList.length == dotList.length) {
          for (var i = 0; i < contentList.length; i++) {
            let imageObj = Object.assign({},returnObj);
            imageObj.batch = true;
            imageObj.imageLink = contentList[i].src;
            if (!dir)   imageObj.imageNo = i+1;
            else imageObj.imageNo = contentList.length-i;
            imageObj.imageNo = ('00'+imageObj.imageNo).slice(-contentList.length.toString().length);
            imageObj.fileExt = imageObj.imageLink.split("?")[0].substr(imageObj.imageLink.split("?")[0].length - 3, 3);
            batchList.push(imageObj);
          }
            //console.log("ended", contentList, batchList);
            resolve(batchList);
            clearInterval(intervalStatus);
        }
        if (dir) $(instaLeftButton)[0].click();
        else $(instaRightButton)[0].click();
        const end = $(article).find(instaContentClass).length-1;
        for (var i=0; i<$(article).find(instaContentClass).length; i++) {
          if (!dir) contentObj = $(article).find(instaContentClass)[$(article).find(instaContentClass).length-Math.abs(i-end)-1];
          else contentObj = $(article).find(instaContentClass)[Math.abs(i-end)];
          if (contentList.indexOf(contentObj) == -1) contentList.push(contentObj);
        }
      }, 10);});
    } else {
      article = $(mouseInfo.target).closest("article")[0];
      if ($($(article).find("DIV[class*='"+instaUserBanner+"']")[0]).find("a").length > 1) returnObj.location = $($(article).find("DIV[class*='"+instaUserBanner+"']")[0]).find("a")[1].textContent;
      let dotList = Array.prototype.slice.call($(article).find("[class*='"+instaDotList+"']"));
      let highLightedDot = $(article).find(instaHighDot)[0];
      if (dotList.indexOf(highLightedDot) > -1) returnObj.imageNo = dotList.indexOf(highLightedDot) + 1;
      else returnObj.imageNo = ">-No-imageNo-<";
      //console.log(mouseInfo.target,$($(mouseInfo.target).closest("[class*='"+instaImageWrapClass+"']")[0]).find(instaContentClass)[0]);
      let imageWrap = $($(mouseInfo.target).closest("[class*='"+instaImageWrapClass+"']")[0]).find(instaContentClass)[0];
      returnObj.imageLink = imageWrap.src;
      returnObj.fileExt = returnObj.imageLink.split("?")[0].substr(returnObj.imageLink.split("?")[0].length - 3, 3);
      return {CurrentPage: returnObj, BatchList: returnObj};
    }
    console.log(returnObj);
  } catch(e){console.log(e);chrome.runtime.sendMessage({CurrentPage: null, BatchList: null});}
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=> {
  if (message.operation == "dA - press All") {
    for (var i = 0; i < /*$("a[data-hook='deviation_link'][aria-label]").length*/3; i++) {
      $("a[data-hook='deviation_link']")[i].setAttribute("target", "_blank");
      console.log("1",$("a[data-hook='deviation_link']")[i]);
      $("a[data-hook='deviation_link']")[i].click();
      $("a[data-hook='deviation_link']")[i].removeAttribute("target");
      //console.log("2",$("a[data-hook='deviation_link']")[i]);
    }

  } /*else if (message.operation == "Insta - complete batch") {
    (async () => {
      const payload = await instaPage(null,message.objectStock);
      console.log("thumbPayload after function:", payload)
      sendResponse(payload);
    })();
    return true;
  }*/
  if (message.operation == "printMessage") {
    console.log("p: ", message.message ,message.content);
  }
  });


function getBatches(givenObj, imageList) {
  let batchList = [], imageWrap;
  //console.log(imageList);
  for (var i = 0; i < imageList.length; i++) {
    let imageObj = Object.assign({},givenObj);
    imageObj.batch = true;
    imageObj.imageNo = ('00000' + (i+1)).slice(-imageList.length.toString().length);
    switch(givenObj.domain) {
      case "www.reddit.com":
        imageWrap = $(imageList[i]).find("A,img")[0];
        if (imageWrap.tagName == "A") {
          imageObj.imageLink = imageWrap.href;
        } else {
          imageObj.imageLink = imageWrap.src;
        }
        imageObj.imageLink = imageObj.imageLink.split("?")[0].replace("preview", "i");
        imageObj.fileExt = imageObj.imageLink.split(".")[imageObj.imageLink.split(".").length - 1];
      break;
      case "mobile.twitter.com":
      case "twitter.com":
        imageWrap = $(imageList[i]).find("IMG")[0];
        imageObj.imageLink = imageWrap.src.split("?")[0] + "." + imageWrap.src.split("/")[imageWrap.src.split("/").length - 1].split("?")[1].substring(7,10) +
          twitterImageOriginal;
        imageObj.imageNo = i+1;
      break;
      case "www.tumblr.com":
        imageWrap = imageList[i];
        imageObj.imageLink = imageWrap.srcset.split(",")[imageWrap.srcset.split(",").length - 1];
        imageObj.imageLink = imageObj.imageLink.slice(0, imageObj.imageLink.lastIndexOf(" "));
      break;
      case "www.newgrounds.com":
        imageObj.imageLink = imageList[i].src;
      break;
      case "imgur.com":
        imageWrap = $(imageList[i]).find("img")[1];
        if (imageWrap == undefined) {
          imageWrap = $(imageList[i]).find("."+imgurVideo)[0].firstChild.firstChild;
        }
        imageObj.imageLink = imageWrap.src.split("_")[0]+"."+givenObj.fileExt;
      break;
      case "www.patreon.com":
        imageObj.imageLink = imageList[i].src;
        console.log(imageObj, imageList[i])
      break;
      case "www.xiaohongshu.com":
        imageWrap = imageList[i];
        let bkgImg = $(imageList[i]).find("span")[0].style.backgroundImage;
        imageObj.imageLink = bkgImg.substring(bkgImg.indexOf("ci"),bkgImg.indexOf("\")"));
      break;
      default: ;
    }
    if (JSON.stringify(imageObj.imageLink)== JSON.stringify(givenObj.imageLink)) {
      givenObj.imageNo = ('00000' + (i+1)).slice(-imageList.length.toString().length);
    }
    batchList.push(imageObj);
  }
  if (batchList.length <= 1) {
    batchList = [];
    givenObj.imageNo = ">-No-imageNo-<";
    batchList.push(givenObj);
  }
  //console.log(givenObj, batchList);
  return {CurrentPage: givenObj, BatchList: batchList};
}


function pixivPage() {
  try {
    var returnObj = Object.assign({},stockObject);
    returnObj.pageCode = linkList[2];
    var articleNo = 0;
    while (mouseInfo.path[articleNo].tagName != "A") {
      articleNo++;
    }
    var imageWrap = mouseInfo.path[articleNo];
    returnObj.imageNo = imageWrap.parentElement.parentElement.firstChild.id;
    returnObj.imageLink = imageWrap.href;
    console.log(imageWrap);
    returnObj.fileExt = returnObj.imageLink.split(".")[returnObj.imageLink.split(".").length - 1];
    articleNo = 0;
    while(mouseInfo.path[articleNo].tagName != "MAIN") {
        articleNo++;
    }
    var article = mouseInfo.path[articleNo];
    returnObj.title = $($(article).find("figcaption")[0]).find("h1")[0].textContent;
    var sideBar = article.parentElement.lastChild;
    while (sideBar.tagName != "H2") {
      sideBar = sideBar.firstChild;
    }
    returnObj.userName = sideBar.firstChild.lastChild.firstChild.textContent;
    returnObj.userCode = sideBar.firstChild.lastChild.firstChild.href.split("/")[4];
    var imageList = $(article).find("."+"sc-1mz6e1e-0 esmokC")[0];
    var batchList = [];
    for (var i = 0; i < imageList.childElementCount; i++) {
      if(imageList.children[i].className.indexOf(pixivWorkWrap) > -1) {
        //console.log(imageList.children[i]);
        var imageObj = Object.assign({},returnObj);
        imageObj.batch = true;
        var imagwWrap = imageList.children[i];
        while (imagwWrap.tagName != "A") {
          imagwWrap = imagwWrap.lastChild;
        }
        imageObj.imageLink = imagwWrap.href;
        imageObj.imageNo = i;
        returnObj.fileExt = returnObj.imageLink.split(".")[returnObj.imageLink.split(".").length - 1];
        batchList.push(imageObj);
      }
    }
    //console.log(batchList);
    if (batchList == undefined || batchList.length <= 1) {
      batchList = [];
      batchList.push(returnObj);
    }
    chrome.runtime.sendMessage({BatchList: batchList});
    console.log(returnObj);
    chrome.runtime.sendMessage({CurrentPage: returnObj});
  } catch(e){chrome.runtime.sendMessage({CurrentPage: null, BatchList: null});}
}
