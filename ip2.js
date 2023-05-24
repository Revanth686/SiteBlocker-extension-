document.addEventListener("DOMContentLoaded", () => {
  var pages = ["example.com"];
  var myArray = [];
  var add = document.querySelector("#add");
  var clr = document.querySelector("#clr");
  var items = document.querySelectorAll("#delit");
  var table = document.querySelector("#tb1");
  var item = "google.com"; //default domain
  var p1 = new Promise(function content_data(resolve, reject) {
    let params = {
      active: true,
      currentWindow: true,
    };
    chrome.tabs.query(params, async function (tabs) {
      var tab = tabs[0];
      var ur = await tab.url;
      resolve(ur);
    });
  });
  var chkinlst = 0;
  var domain = 0;
  async function automatic() {
    chkinlst = await p1; //url
    domain = await chkinlst.match(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
    )[1]; //domain
  }
  function check(chkinlst, pages) {
    var flg = 0;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i] == chkinlst) {
        flg = 1;
        add.disabled = true;
        return 0;
      }
    }
    if (flg == 0) {
      add.disabled = false;
      return 1;
    }
  }

  function store_in_bg(lru) {
    return new Promise(async function (resolve) {
      await chrome.runtime.sendMessage({ message: ["revanth", lru] }, res);
      function res(response) {
        resolve(response.array1); //store and get stored array
      }
    });
  }
  function clrd() {
    return new Promise(async function (resolve) {
      await chrome.runtime.sendMessage(
        { message: "clear" },
        function res(response) {
          resolve(response.msg);
        }
      );
    });
  }
  function getar_bg() {
    return new Promise(async function (resolve) {
      await chrome.runtime.sendMessage({ message: "give_arr" }, res);
      function res(response) {
        resolve(response.array); //getting arr in bg
      }
    });
  }

  add.onclick = async function () {
    await automatic(); //after domain adn url being set
    var cpo = await getar_bg();
    if (check(chkinlst, cpo)) {
      var cpy = await store_in_bg(chkinlst); //sendng url to store and getting arr
      var adom = await cpy[cpy.length - 1].match(
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
      )[1]; //domain
      var tr = document.createElement("tr");
      tr.setAttribute("id", "delit");
      if(cpy[cpy.length-1].length>50){
        tr.innerHTML = `
            <td ><p>${adom}</p><p style="font-size:50%;">${
          cpy[cpy.length - 1].slice(0,50)
        }...</p></td>
            `;
        table.append(tr);
      }
      else{
        tr.innerHTML = `
            <td ><p>${adom}</p><p style="font-size:50%;">${
          cpy[cpy.length - 1]
        }</p></td>
            `;
        table.append(tr);
      }
    }
  };
  clr.onclick = async function () {
    table.remove();
    let cr = await clrd();
  };
  async function lcl() {        //for auto loadin of table with data from bgscript after start
    var l = await getar_bg();
    if (l.length != 0) {
      for (let li = 0; li < l.length; li++) {
        var lr = document.createElement("tr");
        lr.setAttribute("id", "delit");
        var ldom = l[li].match(
          /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
        )[1]; //domain
        if(l[li].length>50){
          lr.innerHTML = `
              <td ><p>${ldom}</p><p style="font-size:50%;">${
            l[li].slice(0,50)
          }...</p></td>
              `;
          table.append(lr);
        }
        else{
          lr.innerHTML = `
              <td ><p>${ldom}</p><p style="font-size:50%;">${
            l[li]
          }</p></td>
              `;
          table.append(lr);
        }
      }
    }
  }
  lcl();
});
