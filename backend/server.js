const express = require("express");
const cors = require("cors");
const path = require("path");

const scanWebsite = require("./scanner");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "..",
            "index.html"
        )
    );

});

app.post("/scan", async (req, res) => {

    try {

        const { url } = req.body;

        if (!url) {

            return res.status(400).json({

                error:
                "Website URL is required"

            });

        }

        const result =
        await scanWebsite(url);

        res.json(result);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            score: 0,

            riskLevel:
            "High Risk",

            risks: [
                "Scanning failed."
            ],

            recommendations: [
                "Verify the URL and try again."
            ],

            alternatives: []

        });

    }

});

app.listen(PORT, () => {

    console.log(
        `SecureScan Pro running on port ${PORT}`
    );

});
