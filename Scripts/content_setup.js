$(document).ready( function() {
  if (window.location.href.indexOf("www.instagram.com") > -1) {
    var articleList = document.getElementsByTagName("article");

    appendButton(articleList);
    function appendButton(list) {
      for (var i = 0; i < list.length; i++) {
        var contentList = $(list.item(i)).find("._9AhH0,.fXIG0");
        for (var j = 0; j < contentList.length; j++) {
          if ($(contentList[j]).find(".imageDownloader_DropdownDownload").length < 1) {
            addDownloadButton(contentList[j], (contentList.length > 1), Math.min($(contentList[j]).width()/8,$(contentList[j]).height()/8));
          }
        }
      }
    }
    appendButton(articleList);
    window.setInterval(function(){
      articleList = document.getElementsByTagName("article");
      appendButton(articleList);
    }, 100);

  }

  if (window.location.href.indexOf("twitter.com") > -1) {
    function appendButton(list) {
      for (var i = 0; i < list.length; i++) {
        var vidWrapper = $(list[i]).find("video");
        if (vidWrapper.length > 0 && list[i].getElementsByClassName("imageDownloader_DropdownDownload").length < 1) {
          var button = document.createElement("IMG");
          button.className = "downloadButton";
          var png = chrome.runtime.getURL('download-graphic-128-2.png');
          button.src = png;
          addDownloadButton($(list[i]).find("[role='group']")[0], false, $($(list[i]).find("[role='group']")[0]).height()*1.1);
        }
      }
    }
    appendButton($(document).find("div > article"));
    window.setInterval(function(){
      appendButton($(document).find("div > article"));
    }, 100);
  }

  if (window.location.href.indexOf("newgrounds.com") > -1) {
      function appendButton(given) {
          if ($(given).find(".imageDownloader_DropdownDownload").length < 1) {
            addDownloadButton($(given).find("[class*='flexbox align-center']")[0], false, parseInt($(given).find("[class*='flexbox align-center']")[0].children[4].offsetHeight)*0.5);
          }
      }
      appendButton($(document).find("[id='ng-global-video-player']")[0]);
      window.setInterval(function(){
        appendButton($(document).find("[id='ng-global-video-player']")[0]);
      }, 100);
    }

  if (window.location.href.indexOf("www.xiaohongshu.com") > -1) {
      function appendButton(given) {
          if ($(given).find(".downloadButton").length < 1) {
          //  console.log(given,$(given).find("source")[0],$(given).find("video")[0],$($(given).find("video")[0]).css("width"));
            var button = document.createElement("IMG");
            button.className = "downloadButton";
            var png = chrome.runtime.getURL('download-graphic-128-2.png');
            button.src = png;
            button.height = 62.5;
            $(given).prepend(button);
          }
      }
      appendButton($(document).find("[class='change-pic']")[0]);
      window.setInterval(function(){
        appendButton($(document).find("[class='change-pic']")[0]);
      }, 100);
    }
});

//error background
function errorBar(givenError) {
    let errorBar = document.createElement('div'), errorText = document.createElement('p');
    errorBar.style.width = "100%"; //same as window width
    errorBar.style.height = "7.5%"; //7.5% of window height
    errorBar.style.position = "fixed"; //fixed at the window
    errorBar.style.top = 0; //fixed at the top
    errorBar.style.background = "rgba(14,35,58,0.3)"; //set backround color and opacity
    errorBar.style.zIndex = 100; //place on top all items
    errorBar.id = "imgReErrBar"; //set ID
    errorText.innerHTML = "There is an error: "+givenError;
    errorText.style.position = "relative"; //relative with errorbar
    errorText.style.color = "white"; //color of text
    errorText.style.textAlign = "center"; //centered
    errorBar.appendChild(errorText); //add text to Bar
    if ($(document).find("#imgReErrBar").length != 0) $(document).find("#imgReErrBar")[0].remove();//remove object
    document.body.appendChild(errorBar); //add it to page, if there isn't
    errorText.style.marginTop = (errorBar.offsetHeight/2-errorText.offsetHeight/2)+"px"; //centered vertically
    errorBar.style.display = "none"; //itinally not showing
     $(errorBar).slideDown("slow");//slowly move it down
    setTimeout(function() {
      $(errorBar).slideUp("slow",()=>{ //slowly move it up
        console.log("removed");
        errorBar.remove(); //remove object
      });
    }, 4000); //move it up in 4 seconds
}

function addDownloadButton(given, status, size) {
  let buttonOpacity = "1";
  let dropDownButton = document.createElement('button');
  dropDownButton.className = "imageDownloader_DropdownDownload";
  dropDownButton.id = "imageDownloader_singleDownloader";
  dropDownButton.style.background = "url("+chrome.runtime.getURL('download-graphic-128-2.png')+")";
  dropDownButton.style.border = "none";
  dropDownButton.style.width = size+"px";
  dropDownButton.style.height = size+"px";
  dropDownButton.style.backgroundSize = "cover";
  given.append(dropDownButton);
  if (status) {
    //console.log("ad",status);
    dropDownButton.id = "imageDownloader_AllDownloader";
    let dropDownHolder = document.createElement('div');
    dropDownHolder.className = "imageDownloader_DropdownDownload";
    dropDownHolder.id = "imageDownloader_dropDownHolder";
    dropDownHolder.style.display = "none";
    dropDownHolder.style.position = "absolute";
    dropDownHolder.style.backgroundColor = "#9C9C9C";
    dropDownHolder.style.marginTop = size+"px";
    dropDownHolder.style.boxShadow = "1px 3px 15px rgba(0,0,0,0.2)";
    dropDownHolder.style.zIndex = "1";
    let dropDownLinkS = document.createElement("a");
    dropDownLinkS.className = "imageDownloader_DropdownDownload";
    dropDownLinkS.style.color = "white";
    dropDownLinkS.style.textDecoration = "none";
    dropDownLinkS.style.display = "block";
    dropDownLinkS.style.userSelect = "none";
    dropDownLinkS.id = "imageDownloader_singleDownloader";
    dropDownLinkS.textContent = "Download - Single";
    dropDownLinkS.style.border = "1px solid black";
    dropDownHolder.appendChild(dropDownLinkS);
    let dropDownLinkA = dropDownLinkS.cloneNode(true);
    dropDownLinkA.id = "imageDownloader_allDownloader";
    dropDownLinkA.textContent = "Download - All";
    dropDownHolder.appendChild(dropDownLinkA);
    $(dropDownHolder).insertAfter(dropDownButton);
    $(dropDownLinkA).mousedown(()=>{ dropDownLinkA.style.opacity = "0.5";});
    $(dropDownLinkS).mousedown(()=>{ dropDownLinkS.style.opacity = "0.5";});
    $(dropDownLinkA).mouseup(()=>{ dropDownLinkA.style.opacity = "1";});
    $(dropDownLinkS).mouseup(()=>{ dropDownLinkS.style.opacity = "1";});
    $(dropDownButton).click(()=>{
      if ((dropDownHolder.style.display != "none" ||
          event.target.id != "allDownload")
          && event.target.className != "imageDownloader_DropdownDownload") {
          $(dropDownHolder).hide();
      } else {
        $(dropDownHolder).show();
      }
    });
  }
  //if (given.className == "qn-0x") buttonOpacity = 0; console.log(given);
  $(dropDownButton).mousedown(()=>{ dropDownButton.style.opacity = 0.5;});
  $(dropDownButton).mouseup(()=>{ dropDownButton.style.opacity = 1;});
  window.onclick = function(event) {
    if ($("#imageDownloader_dropDownHolder").length > 0){
      if ($("#imageDownloader_AllDownloader")[0].style.display == "none" &&
          (event.target.id == "imageDownloader_AllDownloader"
          || event.target.className == "imageDownloader_DropdownDownload")) {
          $($("#imageDownloader_dropDownHolder")[0]).show();
          console.log($("#imageDownloader_dropDownHolder")[0],"show");
      } else {
        $($("#imageDownloader_dropDownHolder")[0]).hide();
        //$("#imageDownloader_dropDownHolder")[0].style.display = "none";
        console.log($("#imageDownloader_dropDownHolder")[0],"hilde");
      }
    }
  }
}
