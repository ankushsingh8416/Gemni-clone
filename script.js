const sideNavigation = document.querySelector(".sideNavigation")
const sideBarToggle = document.querySelectorAll(".fa-bars")
const startContentUl = document.querySelector(".startContent ul")
const inputArea = document.querySelector(".inputArea input")
const sendRequest = document.querySelector(".fa-paper-plane")
const chatHistory = document.querySelector(".chatHistory ul")
const startContent = document.querySelector(".startContent")
const chatContent = document.querySelector(".chatContent")
const results = document.querySelector(".results")

const suggestions = [
    {
        question: "How to Start i web devlopment and what is roadmap?",
        icon: "https://assets.simplified.co/icons/dimond/with-shadow/appicon-design-dark.svg"
    },
    {
        question: "What are some tips to improve public speaking skills for beginners?",
        icon: "https://assets.simplified.co/icons/dimond/with-shadow/appicon-magictool-dark.svg"
    },
    {
        question: "Help explain in a kid-friendly way: why do rainbows appear?",
        icon: "https://assets.simplified.co/icons/dimond/with-shadow/appicon-sm-dark.svg"
    },
    {
        question: "Write a JavaScript array and string method",
        icon: "https://assets.simplified.co/icons/dimond/with-shadow/appicon-aiwriter-dark.svg"
    }
]

window.addEventListener("load", () => {
    suggestions.forEach((data) => {
        let item = document.createElement("li");
        item.addEventListener("click", () => {
            getGemniResponse(data.question, true)
        })
        item.innerHTML = `<div class="suggestions">
            <p>${data.question}</p>
            <div class="icon"><img src="${data.icon}" /></div>
        </div>`
        startContentUl.append(item)
    });
})

sideBarToggle.forEach(toggle => {
    toggle.addEventListener("click", () => {
        sideNavigation.classList.toggle('expandClose');
    });
});



inputArea.addEventListener("keyup", (e) => {
    if (!e.target.value.length > 0) {
        sendRequest.style.display = "none"
    } else {
        sendRequest.style.display = "block"
    }
});

sendRequest.addEventListener("click", () => {
    getGemniResponse(inputArea.value, true)
})

const getGemniResponse = (question, appendHistory) => {
    if (appendHistory) {


        let historyLi = document.createElement("li");
        historyLi.addEventListener("click", () => {
            getGemniResponse(question, false)
        })
        historyLi.innerHTML = `<i class="fa-regular fa-message"></i> ${question}`
        chatHistory.prepend(historyLi);
    }
    results.innerHTML = "";
    inputArea.value = "";
    startContent.style.display = "none"
    chatContent.style.display = "block"

    let resultTitle = `
    <div class="resultTitle">
        <img src="https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg" alt="">
        <p>${question}</p>
    </div>`

    let resultData = `
    <div class="resultData">
        <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png" alt="">
        <div class="loader">
            <div class="animatedBG"> </div>
            <div class="animatedBG"> </div>
            <div class="animatedBG"> </div>
        </div>
    </div>`

    results.innerHTML += resultTitle;
    results.innerHTML += resultData;

    const APIURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCvdEBSjT8wGlP9KV-gqD393D7qC4yRlTo';

    fetch(APIURL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: question }] }]
        })
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            document.querySelector(".results .resultData").remove();
            let responseData = jsonEscape(data.candidates[0].content.parts[0].text);
            let responseArray = responseData.split("**")
            let newResponse = "";

            for (let i = 0; i < responseArray.length; i++) {
                if (i == 0 || i % 2 !== 1) {
                    newResponse += responseArray[i]
                }
                else {
                    newResponse += "<strong>" + responseArray[i].split(" ").join("&nbsp") + "</strong>"
                }
            }
            let newResponse2 = newResponse.split("*").join(" ");

            let textArea = document.createElement("textarea");
            textArea.innerHTML = newResponse2

            results.innerHTML += `
        <div class="resultResponse">
            <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png" alt="">
            <div>
            <p id="typeEffect"></p>
            </div>
        </div>`

            let newResponseData = newResponse2.split(" ")
            for (let j = 0; j < newResponseData.length; j++) {
                timeout(j, newResponseData[j] + " ")
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            results.innerHTML = `<p>Error fetching response. Please try again later.</p>`;
        });
}

const timeout = (index, nextWord) => {
    setTimeout(() => {
        document.getElementById("typeEffect").innerHTML += nextWord
    }, 75 * index)

}
const newChat = () => {
    startContent.style.display = "block"
    chatContent.style.display = "none"
}

function jsonEscape(str) {
    return str
        .replace(new RegExp("\r?\n\n", "g"), "<br>")
        .replace(new RegExp("\r?\n", "g"), "<br>");
}


function toggletheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');

    if (currentTheme === 'light') {
        body.setAttribute('data-theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
    }
}
