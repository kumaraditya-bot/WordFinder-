let input = document.querySelector("#input");
let searchBtn = document.querySelector("#search");
let apiKey = "fe56774d-699c-41b8-8710-02b7068b1dd8";
let notFound = document.querySelector(".not__found");
let defBox = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");

searchBtn.addEventListener("click", function(e) {
  e.preventDefault();

  //clear data:
  audioBox.innerHTML = "";
  defBox.innerText = "";
  notFound.innerText = "";

  //Get Input data;
  let word = input.value;

  //call Apiget data;
  if (word === "") {
    alert("Word is Required");
  }

  getData(word);

});

async function getData(word) {
  loading.style.display = "block";

   //Ajax call to API:
   const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`);
   const data = await response.json();
   
   //if empty result:
   if(!data.length){
     loading.style.display = "none";
      notFound.innerText = "No results found";
      return;
   }

   //if results are suggestions:
   if(typeof data[0] === "string"){
     loading.style.display = "none";
     let heading = document.createElement('h3');
     heading.innerText = "Did you mean?";
     notFound.appendChild(heading);
     data.forEach(element =>{
       let suggestions = document.createElement('span');
       suggestions.classList.add('suggested');
       suggestions.innerText = element;
       notFound.appendChild(suggestions);
     })
     return;
   }

   //Result Found:
   loading.style.display = "none";
   let defination = data[0].shortdef[0];
   defBox.innerText = defination;

   //Sound:
   let soundName = data[0].hwi.prs[0].sound.audio;
   if(soundName){
     renderSound(soundName);
   }
   console.log(data);
}


  function renderSound(soundName){
    let subdirectory = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subdirectory}/${soundName}.wav?key=${apiKey}`;
    let aud = document.createElement("audio");
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);
  }
  