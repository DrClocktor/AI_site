//const OPENAI_API_KEY = ""

const OPENAI_API_KEY = prompt("INSERT API KEY HERE")

// Normal Mode
const promptInput = document.querySelector("#input")
const assistantResponse = document.querySelector(".responseText")
const inputBtnClick = document.querySelector("#inputButton")
const normalSection = document.querySelector("#normalMode")
const toDoBtn = document.querySelector(".toDoBtn")
const foodBtn = document.querySelector(".foodBtn")

// Star Wars
const converterInput = document.querySelector("#converter")
const converterResponse = document.querySelector(".converterResponse")
const converterBtnClick = document.querySelector("#convertButton")
const starWarsSection = document.querySelector("#starWarsMode")

// Switching modes buttons
const normalModeBtn = document.querySelector("#normalModeBtn")
const starWarsModeBtn = document.querySelector("#starWarsBtn")

// AI Roles prompts
const defaultPrompt = 'Assistent'
const toDoPrompt = `Du er en venlig assistent, som er god til at lave daglige rutiner og to do lister, som er tilpasset brugeren. 
                         Dine daglige rutiner og to do lister, som du laver til brugeren, skal være tilpasset til en med ADHD så de er overskuelige. 
                         For at brugeren får mest ud af de daglige rutiner og to do lister, skal du også komme med bud på hvordan man kan holde sig til dem,
                         så man nemmere kan fortsætte med dem uden at man går i stå eller helt stopper med dem, efter kort tid`

const starWarsPrompt = 'You are an wise jedi master full of knowledge, from the Star Wars univers.'
const foodPrompt = 'Du er en mad assistent, som er god til at komme med lækre mad ideér. ' +
    '                     Du skal starte med at spørge hvilken type mad, som brugeren gerne have, og derefter komme med et svar ud fra det'
let promptAI = defaultPrompt
document.addEventListener("DOMContentLoaded", normalMode); // Loads the normal mode first when entering the site


function logSuggestion() {
    // Determine active input and response elements based on the mode
    let activeInput = normalSection.style.display === 'flex' ? promptInput : document.querySelector("#inputSW"); //If normal mode is active use promtInput else use SW input
    let activeResponse = normalSection.style.display === 'flex' ? assistantResponse : document.querySelector(".responseTextSW");

    let promptText = activeInput.value;

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: promptAI
                },
                {
                    role: "user",
                    content: promptText
                }
            ],
            max_tokens: 500 // Her begrænses svaret længde til 500 tokens
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP-fejl: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(suggestionData => {
            activeResponse.textContent = suggestionData.choices[0].message.content; // Display the response in the active mode
           // assistantResponse.textContent = suggestionData.choices[0].message.content,
            console.log(suggestionData.choices[0].message.content)
        })
        .catch(error => {
            console.error('An error occurred:', error);
            activeResponse.textContent = "An error occurred. Please try again later.";
            // assistantResponse.textContent = "Der opstod en fejl. Prøv igen senere.";
        });
}

function textConverter() {
    const converterText = converterInput.value
    converterResponse.textContent = converterText
}

// Mode Switching
function normalMode() {
    normalSection.style.display = 'flex'
    starWarsSection.style.display = 'none'
    promptAI = defaultPrompt
    console.log("Default Mode now active")
}

function starWarsMode() {
    starWarsSection.style.display = 'flex'
    normalSection.style.display = 'none'
    promptAI = starWarsPrompt
    alert("Star Wars mode now active!")
    console.log("Star Wars Mode now active")
}

// Button events
inputBtnClick.addEventListener("click", logSuggestion)
document.querySelector("#inputButtonSW").addEventListener("click", logSuggestion);

converterBtnClick.addEventListener("click", textConverter)

normalModeBtn.addEventListener("click", normalMode)
starWarsModeBtn.addEventListener("click", starWarsMode)

toDoBtn.addEventListener("click", () => {promptAI = toDoPrompt, alert("To Do and routines mode now active!")})
foodBtn.addEventListener("click", () => {promptAI = foodPrompt, alert("Food ideas mode now active!")} )