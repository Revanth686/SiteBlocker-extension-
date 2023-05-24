let myArray = [];
var port;

function put(myArray){
  return new Promise(async function(resolve,reject){
    await chrome.storage.local.set({ "arr": myArray }, function() {
      resolve("set");
    });
  })
}

function get(key){
  return new Promise(async function(resolve,reject){
    await chrome.storage.local.get([key], function(result) { //arry of keys
      resolve(result[key]);
    });
  })
}
put(myArray);

chrome.runtime.onConnect.addListener(function(newPort) {
  // Save the port for later use
  port = newPort;
  // Listen for messages from the other end of the port
  port.onMessage.addListener(function(message) {
    chk_w_cs("none")
    console.log("Received message in bgsc:", message);
  });
});

function chk_w_cs(ker) {
  if (port) {
    var csmsg;
    async function gms(){
      csmsg={
          eyed:"bgscript",
          frm:ker,
          ar:await get("arr")
      };
    }
    gms().then(()=>{
      port.postMessage(csmsg);
    })
    .catch((err)=>{
      console.log("Error: Port not yet connected.bro ");
    })
  } else {
    console.log("Error: Port not yet connected.bruh");
  }
}
chrome.tabs.query({active: true, currentWindow: true}, async function(tabs){
  chrome.webNavigation.onCompleted.addListener(function(details){
    console.log(`Page loaded mannnn: ${details.url}`);
    chk_w_cs("none");
  }, {url: [{schemes: [`${tabs[0].url}`]}]}); 
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message[0]=="revanth"&&request.message!="clear"&&request.message!="give_arr") {
    lru();
    async function lru(){
      myArray.push(request.message[1]);
      await put(myArray);   //store with key "arr"
      sendResponse({array1:myArray});
      chk_w_cs("none");
    }
    return true;
  }
  else if(request.message=="clear"){
    myArray.length=0;
    put(myArray);
    sendResponse({msg:"Cleared in bg"});
    chk_w_cs("clear");
    return true;
  }
  else if(request.message=="give_arr"){
    gve();
    async function gve(){
      let ar=await get("arr");
      sendResponse({array:ar});
      chk_w_cs();
    }
    return true;
  }
});




