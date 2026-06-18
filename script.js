async function scanWebsite() {

    const url =
    document.getElementById(
        "websiteInput"
    ).value.trim();

    if (!url) {

        alert(
            "Please enter a website URL."
        );

        return;
    }

    document.getElementById(
        "scoreValue"
    ).textContent = "...";

    document.getElementById(
        "riskLevel"
    ).textContent =
    "Analyzing Website...";

    document.getElementById(
        "riskList"
    ).innerHTML =
    "<li>Checking security...</li>";

    document.getElementById(
        "recommendationList"
    ).innerHTML =
    "<li>Generating recommendations...</li>";

    document.getElementById(
        "alternativeGrid"
    ).innerHTML =
    "<div class='alt-card'>Finding safer alternatives...</div>";

    try {

        const response =
        await fetch(
            "/scan",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    url: url
                })
            }
        );

       const data =
await response.json();

saveScanHistory(url);

updateUI(data);
    }

    catch(error){

        console.error(error);

        alert(
            "Connection Error. Make sure server.js is running."
        );

        document.getElementById(
            "scoreValue"
        ).textContent =
        "ERR";

        document.getElementById(
            "riskLevel"
        ).textContent =
        "Connection Error";

    }

}

function updateUI(data){

    animateScore(
        data.score
    );

    document.getElementById(
        "riskLevel"
    ).textContent =
    data.riskLevel;

    applyTheme(
        data.riskLevel
    );

    let risksHTML = "";

    data.risks.forEach(risk => {

        risksHTML +=
        `<li>${risk}</li>`;

    });

    document.getElementById(
        "riskList"
    ).innerHTML =
    risksHTML;

    let recommendationHTML = "";

    data.recommendations.forEach(rec => {

        recommendationHTML +=
        `<li>${rec}</li>`;

    });

    document.getElementById(
        "recommendationList"
    ).innerHTML =
    recommendationHTML;

    let alternativesHTML = "";

    data.alternatives.forEach(site => {

        alternativesHTML += `
        <div class="alt-card">

            <h3>${site.name}</h3>

            <p>${site.description}</p>

            <br>

            <a
            href="${site.url}"
            target="_blank">

            Visit →

            </a>

        </div>
        `;

    });

    document.getElementById(
        "alternativeGrid"
    ).innerHTML =
    alternativesHTML;

}

function animateScore(target){

    let current = 0;

    const scoreElement =
    document.getElementById(
        "scoreValue"
    );

    const timer =
    setInterval(() => {

        current++;

        scoreElement.textContent =
        current;

        if(current >= target){

            clearInterval(timer);

        }

    }, 15);

}

function applyTheme(riskLevel){

    const root =
    document.documentElement;

    const circle =
    document.getElementById(
        "scoreCircle"
    );

    if(
        riskLevel === "Safe"
    ){

        root.style.setProperty(
            "--theme",
            "#22c55e"
        );

        circle.style.boxShadow =
        "0 0 40px #22c55e";

    }

    else if(
        riskLevel ===
        "Moderate Risk"
    ){

        root.style.setProperty(
            "--theme",
            "#f59e0b"
        );

        circle.style.boxShadow =
        "0 0 40px #f59e0b";

    }

    else{

        root.style.setProperty(
            "--theme",
            "#ef4444"
        );

        circle.style.boxShadow =
        "0 0 40px #ef4444";

    }

}

window.onload = () => {

    document.getElementById(
        "scoreValue"
    ).textContent = "0";

    displayScanHistory();

};

function showFeature(type){


if(type === "https"){

    alert(
        "HTTPS Analysis checks whether a website uses secure encrypted HTTPS connections to protect user data from interception."
    );

}

else if(type === "headers"){

    alert(
        "Security Headers protect websites against attacks such as clickjacking, XSS and MIME-type sniffing."
    );

}

else if(type === "risk"){

    alert(
        "Risk Detection identifies missing security protections and potential vulnerabilities."
    );

}

else if(type === "score"){

    alert(
        "Safety Score is calculated based on HTTPS usage, security headers and overall website security posture."
    );

}

else if(type === "alternatives"){

    alert(
        "Alternative Suggestions recommend safer websites offering similar services."
    );

}


}

function playHighRiskBeep(){

    const audioContext =
    new (
        window.AudioContext ||
        window.webkitAudioContext
    )();

    const oscillator =
    audioContext.createOscillator();

    const gainNode =
    audioContext.createGain();

    oscillator.connect(
        gainNode
    );

    gainNode.connect(
        audioContext.destination
    );

    oscillator.type =
    "sawtooth";

    oscillator.frequency.value =
    700;

    gainNode.gain.value =
    0.2;

    oscillator.start();

    setTimeout(() => {

        oscillator.stop();

    }, 500);

}
function submitFeedback(){


const name =
document.getElementById(
    "feedbackName"
).value;

const feedback =
document.getElementById(
    "feedbackText"
).value;

if(
    !name ||
    !feedback
){

    alert(
        "Please fill all fields."
    );

    return;
}

alert(
    "Thank you for your feedback, " +
    name +
    "!"
);

document.getElementById(
    "feedbackName"
).value = "";

document.getElementById(
    "feedbackText"
).value = "";


}

function saveScanHistory(url){


let history =

JSON.parse(
    localStorage.getItem(
        "scanHistory"
    )
) || [];

history.unshift(url);

history =
[...new Set(history)];

history =
history.slice(0,5);

localStorage.setItem(
    "scanHistory",
    JSON.stringify(history)
);

displayScanHistory();


}

function displayScanHistory(){


const historyBox =
document.getElementById(
    "historyBox"
);

if(!historyBox){

    return;

}

const history =

JSON.parse(
    localStorage.getItem(
        "scanHistory"
    )
) || [];

if(
    history.length === 0
){

    historyBox.innerHTML =
    "No scans yet.";

    return;

}

historyBox.innerHTML =

history.map(url => `<div>${url}</div>`

)
.join("");


}

