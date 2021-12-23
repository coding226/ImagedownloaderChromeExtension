var bkg =  chrome.extension.getBackgroundPage().console;
var downloadObj = null;
var batchPageLists =["https://www.reddit.com/*","https://*.tumblr.com/*",
	"https://twitter.com/*","https://mobile.twitter.com/*","https://www.pixiv.net/*", "https://www.instagram.com/*", "https://imgur.com/*", "https://www.newgrounds.com/*","https://www.xiaohongshu.com/*",
	"https://www.deviantart.com/*/gallery/*"];
		/*chrome.storage.local.set({
			BatchPage: "",CurrentPage:  "", batch:  "",count: 0,errorList:  "",imageCount:0,names: {RedditName:""}});*/


function createMenu(){
	chrome.contextMenus.create({title: "Download - Single", /*documentUrlPatterns: ["<all_urls>"],*/ id: "download", contexts: ["image","video"], onclick: pageCheck});
	chrome.contextMenus.create({documentUrlPatterns: batchPageLists,
		title: "Download - All", id: "Download-All", contexts: ["image","video"], onclick: batchCheck});
}

chrome.runtime.onInstalled.addListener(createMenu);
chrome.runtime.onStartup.addListener(createMenu);
/*
chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    bkg.log("recieved",message);
    if (message.CurrentPage != null) {
      bkg.log(message.CurrentPage, "indid recieved");
      currentGivenPage = message.CurrentPage;
      sendMessage({operation: "printMessage", content: message.CurrentPage, message:" indid recieved" });
      if (message.operation == "download") pageCheck();
    }
    if (message.BatchList != null) {
      bkg.log(message.BatchList, "batch recieved");
      sendMessage({operation: "printMessage", content: message.BatchList, message:" batch recieved7" });
      currentBatchList = message.BatchList;
      if (message.operation == "download")  batchCheck();
    }
    //close current tab from image
    if (message.closeThisPage) chrome.tabs.remove(sender.tab.id);
  }
);*/
/*
      /*chrome.storage.sync.set( {
      DeviantArtName: "deviantArt - {Page Code} - {User Name} - {Title}",
      DotReplacement: "." ,
      FSlashReplacement: "-" ,
      GeneralName: "{URL} - {date} - {time}" ,
      GeqReplacement: "",
       HFName: "HF - {User Name} - {Page Code} - {Title}" ,
       InstagramName: "Instagram - {Page Code} - {User Name}${$ - {imageNo}$}$" ,
       LeqReplacement: "" ,
       QuestionReplacement: "" ,
       RedditName: "r-{Subreddit} - {Page Code} - {User Name}${$ - {imageNo}$}$",
        TildReplacement: "^,^" ,
        TumblrName: "Tumblr - {Page Code}${$ - {imageNo}$}$ - {User Name}" ,
        TwitterName: "Twitter - @{User Code} - {Page Code}${$ - {imageNo}$}$" ,
        VBarReplacement: "" ,
        dAUserFolder: false ,
        furUserFolder: false ,
        furaffinityName: "{Page Code} - {Title} - {User Name}" ,
        imgurName: "Imgur - {Page Code} - {Title} - {User Name}$[$ [i] $]$" ,
        individualSave: false ,
        instaUserFolder: true ,
        newGroundsName: "NewGrounds - {Title} - {User Name}"});*/
        //chrome.storage.sync.remove("CurrentPage");*/
