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

        updateUI(data);

    }

    catch(error){

        console.error(error);

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

};
