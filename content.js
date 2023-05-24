let lru = window.location.href;
var domm=lru.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1];
var lst;
var dms=[];
var content = document.querySelector("html").innerHTML;

function chng_html() {
  document.querySelector("html").innerHTML = `
        <body style="width:100vw;height:100vh;background-color:rgb(45, 45, 45);color:rgb(229, 249, 249)">
            <div style="padding-left:11vw;padding-top:10vh;">
                <h1>Hmmm... can't reach this page</h1><br><br>
                <h4 style="display:inline">${window.location.hostname}</h4><p style="display:inline">'s server IP address could not be found.</p><br>
                <h4>Try:</h4>
                <ul>
                    <li>Checking the connection</li>
                    <li><p style="color:rgb(22, 8, 238);text-decoration:underline">Checking the proxy, firewall, and DNS settings.</p></li>
                    <li><p style="color:rgb(22, 8, 238);text-decoration:underline">Running Windows Network Diagnostics</p></li>
                </ul>
            </div>
        </body>
        `;
  console.log("nope");
}
function html_bck() {
  console.log(".");
}
function html_bck1() {
  window.location.reload();
  // document.querySelector("html").innerHTML=content
}
function check_ver(arr, srt) {
    if (srt == "clear") {
        html_bck1();
        return;
    }
  let flg = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == domm) {
      flg = 1;
      chng_html();
      break;
    }
  }
  if (flg == 0) {
    html_bck();
  }
}

// Connect to the background script
const port = chrome.runtime.connect({ name: "mycsPort" });

// Send a message to the background script
port.postMessage("Hello from the other end!");

// Listen for messages from the background script
port.onMessage.addListener(function (message) {
  //   console.log(`Received message: ${message}`);
  if (message.eyed === "bgscript") {
    if (message.frm == "clear") {
      check_ver(dms, "clear");
    } else {
        console.log(`Received message: ${message}`);
        lst = message.ar;
        for (let i = 0; i < lst.length; i++){
            if(lst[i].match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1]){
                dms[i] =lst[i].match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1];
            }
            else console.log("unmatched")
        }
        check_ver(dms, "none");
      }
  }
});
