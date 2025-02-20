let charCodeText = document.getElementById("charCode")
let codeText = document.getElementById("code")
let keyText = document.getElementById("key")

document.addEventListener("keypress", function(event){
    console.log(event)
    /* store the relevant properties that we need in variables 
    change the text content of the elements we selected 
    to the values of the variables we created */
    let key = event.key;
    let keyCode = event.keyCode;
    let code = event.code;
    codeText.textContent = code
    charCodeText.textContent = keyCode
    keyText.textContent = key
})

