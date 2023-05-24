document.addEventListener("DOMContentLoaded", () => {  
	var op = document.querySelectorAll(".op");
	var b1=document.querySelector("#b1");
	document.querySelector(".table").style.display="none"
	var p1=new Promise(function content_data(resolve,reject){
		let params={
			active:true,
			currentWindow: true
		}
		chrome.tabs.query(params,async function(tabs){
			var tab=tabs[0];
			var ur=await tab.url;
			var item =await ur.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1];
			document.querySelector("#dom").innerHTML=`${item}`;
			console.log(`the curr tab is ${tab.url} and domain ${item}`)
			resolve(item)
		})
	})
	var stat=true;
	async function fetcher(lru,dns){
		var a1=await fetch(lru+dns);
		var a2=await a1.json();
		if(a2.status=="success"){
			document.querySelector(".table").style.display="block"
			op[1].innerHTML=`${a2.query}`;
			op[0].innerHTML=`${a2.status}`;
			op[2].innerHTML=`${a2.country}`;
			op[3].innerHTML=`${a2.regionName}`;
			op[4].innerHTML=`${a2.city}`;
			op[5].innerHTML=`${a2.zip}`;
			op[6].innerHTML=`${a2.isp}`;
			document.querySelector("#dom").innerHTML=`${dns}`;
		}
		else{stat=false;
			console.log('here false');
	}
	}

	async function final(){
		var dns=await p1;
		await fetcher("http://ip-api.com/json/",dns);
	}
	final();
	b1.onclick=async function(){
		var dns=document.querySelector("#ext").value;
		await fetcher("http://ip-api.com/json/",dns);
		document.querySelector(".table").style.display="block";
		if(ext.value.length==0||stat==false){
			document.querySelector("#outer").style.display="none";
			var alt1=document.createElement("div");
			alt1.innerHTML=`
			<h1>ERROR: 4## FAILED TO FETCH DATA</h1>
			<h3> NOT A VALID DOMAIN</h3>
			<h3> Here are some possible fixes: </h3>
			<ul>
    		<li>Recheck the spelling</li>
    		<li>Check your connection to the internet</li>
    		<li>reopen the extension</li>
			</ul>`;
			document.body.appendChild(alt1);
		}
	}
});
