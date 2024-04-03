require('dotenv').config(); // Environment vairabiles
const express = require ("express"); // Express package import
const cors = require("cors"); // CORS package import
const axios = require("axios"); // Axios packagge import

// Server initialization
const app = express();

// Allowing requests on any URL
app.use(cors());

// Array with all routes available on the API
const api_routes = [
    "/",
    "/comics",
    "/comics/:characterId",
    "/comic/:comicId",
    "/characters",
    "/character/:characterId"
]

// Array with all queries available on the API
const api_queries = [
    "limit",
    "skip",
    "title",
    "name"
]

// Loop on all the routes available on the API
for (let i = 0; i < api_routes.length; i++) {
    let route = api_routes[i]; // Setting a dynamic key for each route

    app.get(route, async (req, res) => { // `route` value is dynamically set on the get method > /comics, /characters...
    

        // HANDLING CLIENT QUERIES
        let clientQueries = []; // Empty array to store all queries passed by the client
        let clientQueriesUrl = ""; // Empty string to join the queries that will be concatenated into the API call url

        // If the client has passed querries
        if (req.query) {
            clientQueries = Object.keys(req.query); // Pushing all the keys of the client queries object into the clientQueries array
            // Loop on all the queries available on the API
            for (let i = 0; i < api_queries.length; i++) {
                const apiQuery = api_queries[i]; // Setting a dynamic key for each query
                // Loop on the clientQueries array
                for (let j = 0; j < clientQueries.length; j++) {
                    let clientQuery = clientQueries[j]; // Setting a dynamic key for each client query
                    // If the client query matches with one of the queries available on the API
                    if (clientQuery === apiQuery) {
                        let queryValue = req.query[clientQuery].replaceAll(" ", "+"); // queryValue is assigned the value of the matching query in the req.query object, spaces are replaced for title and name items
                        clientQueriesUrl = clientQueriesUrl + `&${clientQuery}=${queryValue}`; // concatenating each query and its value to match with the url syntax
                    }
                }
            }
        }

        // HANDLING PARAMS
        // If the client has passed params
        if (req.params) {
            let param = Object.keys(req.params)[0]; // Setting a dynamic key for the client param
            route = route.replace(`:${param}`, req.params[param]); // Replacing its value in the `route` variable 
        }

        // API CALL
        try {
            // Axios request on the matching URL with environment variables
            const response = await axios.get(`${process.env.API_URL}${route}?apiKey=${process.env.API_KEY}${clientQueriesUrl}`)
            if (response.data.count === 0) {
                // If nothing has been found with the client params
                res.status(400).json({message: `Bad request`});
            } else {
                res.status(200).json(response.data);
            }
        } catch (error) {
            res.status(500).json(error.message);
        }
    })
}

app.all("*", (req, res) => {
    res.status(404).json({message: "This route does not exist"});
})

app.listen(process.env.PORT, () => {
    console.log("Server running");
})