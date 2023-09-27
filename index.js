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

// Creating a new product
server.post("/products", function (req, res, next) {
    console.log("**********************");
    console.log("products POST: received request");
    console.log("POST /products params=>" + JSON.stringify(req.params));
    console.log("POST / products body=>" + JSON.stringify(req.body));
    totalPostCount++;
  
    // validation of manadatory fields
    if (req.body.name === undefined) {
      // If there are any errors, pass them to next in the correct format
      return next(new errors.BadRequestError("name must be supplied"));
    }
    if (req.body.price === undefined) {
      // If there are any errors, pass them to next in the correct format
      return next(new errors.BadRequestError("price must be supplied"));
    }
    if (req.body.quantity === undefined) {
      // If there are any errors, pass them to next in the correct format
      return next(new errors.BadRequestError("quantity must be supplied"));
    }
  
    let newProduct = {
      productId: req.body.productId,
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
    };
    //   Create the product using the presistence engine
    productsSave.create(newProduct, function (error, product) {
      // If there are any errors, pass them to next in the correct format
      if (error) return next(new Error(JSON.stringify(error.errors)));
  
      // Send the product if no issues
      res.send(201, product);
      console.log(
        "Processed Request Count--> GET:",
        totalGetCount + " , " + "POST:",
        totalPostCount
      );
    });
    console.log("products POST: sending response");
  });
  
  // Delete all products
server.del("/products", function (req, res, next) {
    console.log("DELETE /products params=>" + JSON.stringify(req.params));
  
    // Delete all products from the persistence engine
    productsSave.deleteMany({}, function (error) {
      console.log(`${req.method} ${req.url}: sending response`);
  
      // If there are any errors, pass them to next in the correct format
      if (error) {
        return next(new Error(JSON.stringify(error.errors)));
      }
      // Send a success response indicating the number of products deleted
      res.send(204);
      console.log("DELETE /products: all products are deleted");
    });
  });