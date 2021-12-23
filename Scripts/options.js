//chrome.storage.sync.remove("dAReady");
chrome.storage.sync.get(null, function(old){
 for (const [key, value] of Object.entries(old)) {
   //console.log($("#"+key)[0],key);
    if ($("#"+key)[0].type == "checkbox") $("#"+key)[0].checked = old[key];
    else $("#"+key)[0].value += old[key];
  }
document.addEventListener('click', function(info){
  //console.log(old);
  /*chrome.storage.local.get(null , function(old){
    console.log(old);
    chrome.storage.local.set({dABatch:[]});
  });*/

  //chrome.storage.sync.set();
  //chrome.storage.sync.remove("dAReady");

  let nameHolder = {}, nameValue;
  if (info.target.type != undefined) {
    if (info.target.type == "submit") {
      if (info.target.className == "typeAdder") {
        clickFunc(info.target.parentElement.children[0], info.target.value);
      }
      if (info.target.className == "submitButton") {
        nameValue = info.target.previousSibling.previousSibling.id;
        nameHolder[nameValue] = info.target.previousSibling.previousSibling.value;
        console.log(nameHolder);
        chrome.storage.sync.set(nameHolder);
      }
      if (info.target.className == "ImageNoSubmit") {
        nameHolder = info.target.previousSibling.previousSibling;
        clickFunc(info.target.parentElement.children[0], nameHolder.value);
        console.log(nameHolder);
      }
      if (info.target.className == "IMNoAdder") {
        clickFunc(info.target.previousSibling, info.target.value);
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
  });
function clickFunc(inputBar, title) {
  inputBar.value += "{" + title +"}";
}
console.log(document);
});
/*{AsteriskReplacement: "",
BSlashReplacement: "",
ColonReplacement: "",
DQuoateReplacement: "",
DeviantArtName: "",
DotReplacement: "",
FSlashReplacement: "",
GeneralName: "",
GeqReplacement: ""
HFName: "",
InstagramName: "",
LeqReplacement: "",
QuestionReplacement: "",
RedditName: "",
TildReplacement: "",
TumblrName: "",
TwitterName: "",
VBarReplacement: "",
furaffinityName: "",
imgurName: "",
newGroundsName: "",
individualSave: false,
instaUserFolder: false,
dAUserFolder: false,
furUserFolder: false}
OG sync object*/
