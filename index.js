require('dotenv').config(); // Environment vairabiles
const express = require ("express"); // Express package import
const cors = require("cors"); // CORS package import
const axios = require("axios"); // Axios packagge import

// Server initialization
const app = express();

// Allowing requests on any URL
app.use(cors());

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/?apiKey=${process.env.API_KEY}`);
        const data = response.data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

app.get("/characters", async (req, res) => {
    const name = req.query.name?.replaceAll(" ", "+") || "";
    const skip = req.query.skip || "0";
    const limit = req.query.limit || "100";
    console.log(name);
    try {
        const response = await axios.get(`${process.env.API_URL}/characters?apiKey=${process.env.API_KEY}&name=${name}&skip=${skip}&limit=${limit}`);
        const data = response.data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

app.get("/comics", async (req, res) => {
    const title = req.query.title?.replaceAll(" ", "+") || "";
    const skip = req.query.skip || "0";
    const limit = req.query.limit || "100";
    try {
        const response = await axios.get(`${process.env.API_URL}/comics?apiKey=${process.env.API_KEY}&title=${title}&skip=${skip}&limit=${limit}`);
        const data = response.data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

app.get("/comic/:comicId", async (req, res) => {
    const comicdId = req.params["comicId"];
    try {
        const response = await axios.get(`${process.env.API_URL}/comic/${comicdId}?apiKey=${process.env.API_KEY}`);
        const data = response.data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

app.get("/comics/:characterId", async (req, res) => {
    const characterId = req.params["characterId"]
    try {
        const response = await axios.get(`${process.env.API_URL}/comics/${characterId}?apiKey=${process.env.API_KEY}`);
        const data = response.data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

app.get("/character/:characterId", async (req, res) => {
    const characterId = req.params["characterId"]
    try {
        const response = await axios.get(`${process.env.API_URL}/comics/${characterId}?apiKey=${process.env.API_KEY}`);
        const data = response.data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

app.all("*", (req, res) => {
    res.status(404).json({message: "This route does not exist"});
})

app.listen(process.env.PORT, () => {
    console.log("Server running");
})