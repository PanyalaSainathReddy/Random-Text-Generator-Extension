const genForm = document.getElementById('generator-form');
const genBtn = document.getElementById('gen-btn');
const copyBtn = document.getElementById('copy-btn');

// default count value is 5 & default option is 'paras;
let count = 5, option = "paras", tempCount = 0, tempOption = "", texts = "Bacon ipsum dolor amet corned beef ullamco venison leberkas, ribeye dolore occaecat frankfurter pork belly chuck ground round tail ea cupidatat turducken.  Turkey sirloin pork chop biltong reprehenderit irure swine ad ham short loin sunt short ribs do.  Nisi commodo boudin minim occaecat short loin.  Drumstick buffalo brisket sirloin doner.  Flank andouille nulla laboris sirloin anim.  Laborum enim nostrud, filet mignon pig kielbasa shank.  Drumstick cillum prosciutto picanha dolore ea, culpa adipisicing kielbasa. \n\nUt aliquip pork loin labore.  Brisket andouille voluptate corned beef duis.  Rump voluptate jowl chuck pork loin, veniam aliquip swine beef.  Fatback andouille quis ipsum irure dolore.  Frankfurter exercitation pig et fugiat flank.  Eiusmod qui minim, adipisicing filet mignon sint ex landjaeger in id beef picanha jowl tail. \n\nPorchetta fugiat quis ea.  Swine dolore tempor, doner drumstick landjaeger qui sausage strip steak est boudin fugiat beef nostrud.  Cow cupidatat leberkas, jerky fatback tail nisi.  Dolore venison bacon duis, pork frankfurter ut.  Voluptate chuck pork chop, sed short loin buffalo meatball pork belly adipisicing quis fugiat boudin. \n\nSausage ribeye aute officia.  Enim sed beef rump, boudin labore picanha salami t-bone dolore adipisicing short ribs anim ball tip venison.  Ut frankfurter landjaeger picanha consectetur andouille voluptate.  Ullamco nulla consectetur non aliqua corned beef exercitation bresaola tongue kevin dolore.  Adipisicing deserunt sirloin capicola tri-tip ham doner aliqua do burgdoggen ullamco mollit pork chop pariatur jowl.  Rump anim veniam, magna eu boudin labore beef enim dolore et culpa consectetur andouille laboris.  Alcatra sirloin dolore non shankle biltong. \n\nCapicola non shoulder biltong.  Pork loin nostrud in, tail laborum strip steak incididunt exercitation pork ullamco fatback.  Pork brisket in, consectetur excepteur prosciutto culpa leberkas ad minim meatball pig officia.  Jowl fugiat tenderloin excepteur, drumstick pig chuck chicken meatball jerky laborum.";

// get user input count value
function getValues(){
    count = parseInt(genForm.gen_count.value);
    option = genForm.gen_options.value;
    validateValues();

    let url = `https://baconipsum.com/api/?type=meat-and-filler&${option}=${count}&start-with-lorem=1`;
    fetchContent(url);
}

// input text and option validation
function validateValues(){
    if(option === "words"){
        [tempCount, tempOption] = [count, option];
        [option, count] = ["paras", 100]; // 100 paragraphs will be generated and then words will be extracted from it

        if(tempCount > 2000){
            invalidInput();
            tempCount = 2000; // max words which can be generated is 2000 only
            genForm.gen_count.value = "2000";
        } else if(tempCount < 1 || isNaN(tempCount)){
            invalidInput();
            tempCount = 5; // min words is 5 
            genForm.gen_count.value = "5";
        }
    } else {
        tempCount = "";
        // paragraphs and sentences > 100 is not allowed
        if(count > 100){
            invalidInput();
            count = 100; // setting by default to 100 if larger value is entered
            genForm.gen_count.value = "100";
        } else if(count < 1 || isNaN(count)){
            invalidInput();
            count = 5;
            genForm.gen_count.value = "5"; // if value < 1 or invalid value is entered, then by default the value will be set to 5
        }
    }
}

function invalidInput(){
    genForm.gen_count.style.borderColor = "#ff6a67";
    setTimeout(() => {
        genForm.gen_count.style.borderColor = "#d3dbe4";
    }, 1000);
}

// fetching the randomly generated text
async function fetchContent(url){
    let response = await fetch(url);
    if(response.status === 200){
        let data = await response.json();
        displayGenContent(data);
    } else {
        alert("An error occurred");
    }
}

// displaying the generated random text
function displayGenContent(data){
    console.log(data);
    // we will generate entered no. of words by using paragraphs
    if(tempOption === "words"){
        tempOption = "";
        // in case of words by default 100 paragraphs will be generated
        texts = data.join();
        if(tempCount <= texts.length){
            let textArray = texts.split(" ");
            let selectedText = textArray.splice(0, tempCount).join(" "); // selecting only the user entered no. of words
            texts = selectedText;
            chrome.storage.sync.set({'loremText': texts});
            console.log(texts);
            return;
        }
        chrome.storage.sync.set({'loremText': texts});
        console.log(texts);
    } else {
        texts = data.join("\n\n"); // \n for breaking lines for para
        chrome.storage.sync.set({'loremText': texts});
        console.log(texts)
    }
}

// copy text to clipboard
function copyToClipboard(){
    chrome.storage.sync.get('loremText', function(data) {
      navigator.clipboard.writeText(data.loremText);
    });
}

// event listeners
genBtn.addEventListener('click', getValues);
copyBtn.addEventListener('click', copyToClipboard);