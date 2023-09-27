let SERVER_NAME = "product-api";
let PORT = 5000;
let HOST = "127.0.0.1";

//counters for GET and POST request
let totalCountForGet = 0;
let totalCountForPost = 0;

let errors = require("restify-errors");
let restify = require("restify"),
  // Get a persistence engine for the users
  productsSave = require("save")("products"),
  // Create the restify server
  server = restify.createServer({ name: SERVER_NAME });

server.listen(PORT, HOST, function () {
  console.log("Server %s listening at %s", server.name, server.url);
  console.log("**** Resources: ****");
  console.log("********************");
  console.log("Endpoints: %s method: GET, POST, DELETE ", server.url);
  console.log("/products");
  console.log("/products/:id");
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all products that are in the system
server.get("/products", function (req, res, next) {
  console.log("********************");
  console.log("products GET: received request");
  console.log("GET /products params=>" + JSON.stringify(req.params));
  totalGetCount++;

  // Find each and ecery attribute within the given collection
  productsSave.find({}, function (error, products) {
    // Return all of the products which are there in the system
    res.send(products);
    console.log(
      "Processed Request Count--> GET:",
      totalCountForGet + " , " + "POST:",
      totalCountForPost
    );
  });
  console.log("products GET: sending response");
});