const axios = require("axios");

async function scanWebsite(url) {

    let score = 100;

    const risks = [];
    const recommendations = [];

    const originalURL = url;

    try {

        if (
            !url.startsWith("http://") &&
            !url.startsWith("https://")
        ) {

            url = "https://" + url;

        }

        const response = await axios.get(
            url,
            {
                timeout: 15000,

                maxRedirects: 10,

                validateStatus: () => true,

                headers: {
                    "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0 Safari/537.36"
                }
            }
        );

        const headers =
        response.headers || {};

        // HTTPS CHECK

        if (
            originalURL.startsWith("http://")
        ) {

            score -= 35;

            risks.push(
                "Website uses HTTP instead of HTTPS."
            );

            recommendations.push(
                "Switch to HTTPS immediately."
            );

        }

        // STATUS CODE CHECK

        if (
            response.status >= 400
        ) {

            score -= 15;

            risks.push(
                `Website returned HTTP ${response.status}.`
            );

            recommendations.push(
                "Investigate server errors."
            );

        }

        // REDIRECT CHECK

        try {

            const finalURL =
            response.request?.res?.responseUrl;

            if (
                finalURL &&
                finalURL.startsWith("http://")
            ) {

                score -= 15;

                risks.push(
                    "Redirects to insecure HTTP."
                );

                recommendations.push(
                    "Use HTTPS redirects only."
                );

            }

        }

        catch(err){}

        // HSTS

        if (
            !headers[
                "strict-transport-security"
            ]
        ) {

            score -= 15;

            risks.push(
                "Missing HSTS header."
            );

        }

        // CSP

        if (
            !headers[
                "content-security-policy"
            ]
        ) {

            score -= 15;

            risks.push(
                "Missing Content Security Policy."
            );

        }

        // X-FRAME

        if (
            !headers[
                "x-frame-options"
            ]
        ) {

            score -= 10;

            risks.push(
                "Missing X-Frame-Options."
            );

        }

        // X-CONTENT

        if (
            !headers[
                "x-content-type-options"
            ]
        ) {

            score -= 10;

            risks.push(
                "Missing X-Content-Type-Options."
            );

        }

        // REFERRER

        if (
            !headers[
                "referrer-policy"
            ]
        ) {

            score -= 5;

            risks.push(
                "Missing Referrer Policy."
            );

        }

        // PERMISSIONS

        if (
            !headers[
                "permissions-policy"
            ]
        ) {

            score -= 5;

            risks.push(
                "Missing Permissions Policy."
            );

        }

    }

    catch(error){

        console.log(
            "SCAN ERROR:",
            error.message
        );

        return {

            score: 25,

            riskLevel:
            "High Risk",

            risks: [
                "Website could not be analyzed."
            ],

            recommendations: [
                "Check connectivity and website availability."
            ],

            alternatives: []

        };

    }

    if(score < 0){

        score = 0;

    }

    let riskLevel = "Safe";

    if(score < 80){

        riskLevel =
        "Moderate Risk";

    }

    if(score < 50){

        riskLevel =
        "High Risk";

    }

    if(risks.length === 0){

        risks.push(
            "No major issues detected."
        );

        recommendations.push(
            "Continue following security best practices."
        );

    }

    const lowerURL =
    url.toLowerCase();

    let alternatives = [];

    if(
        lowerURL.includes("movie") ||
        lowerURL.includes("film") ||
        lowerURL.includes("stream") ||
        lowerURL.includes("video")
    ){

        alternatives = [

            {
                name:"Netflix",
                description:"Streaming Platform",
                url:"https://www.netflix.com"
            },

            {
                name:"Prime Video",
                description:"Amazon Streaming",
                url:"https://www.primevideo.com"
            },

            {
                name:"Disney+",
                description:"Movies and TV",
                url:"https://www.disneyplus.com"
            }

        ];

    }

    else if(

        lowerURL.includes("photo") ||
        lowerURL.includes("image") ||
        lowerURL.includes("gallery") ||

        lowerURL.includes("jpg") ||
        lowerURL.includes("jpeg") ||
        lowerURL.includes("png") ||
        lowerURL.includes("gif") ||
        lowerURL.includes("webp") ||
        lowerURL.includes("svg")

    ){

        alternatives = [

            {
                name:"Google Photos",
                description:"Cloud Photo Storage",
                url:"https://photos.google.com"
            },

            {
                name:"Flickr",
                description:"Photo Sharing",
                url:"https://www.flickr.com"
            },

            {
                name:"Adobe Express",
                description:"Image Editing",
                url:"https://www.adobe.com"
            }

        ];

    }

    else if(

        lowerURL.includes("shop") ||
        lowerURL.includes("store") ||
        lowerURL.includes("buy")

    ){

        alternatives = [

            {
                name:"Amazon",
                description:"Shopping Platform",
                url:"https://www.amazon.com"
            },

            {
                name:"Flipkart",
                description:"Indian Marketplace",
                url:"https://www.flipkart.com"
            },

            {
                name:"eBay",
                description:"Online Marketplace",
                url:"https://www.ebay.com"
            }

        ];

    }

    else {

        alternatives = [

            {
                name:"Google",
                description:"Search Engine",
                url:"https://www.google.com"
            },

            {
                name:"DuckDuckGo",
                description:"Privacy Search",
                url:"https://duckduckgo.com"
            },

            {
                name:"Bing",
                description:"Microsoft Search",
                url:"https://www.bing.com"
            }

        ];

    }

    return {

        score,
        riskLevel,
        risks,
        recommendations,
        alternatives

    };

}

module.exports = scanWebsite;
