const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname+"/date.js");
//got the dependecies ready

/*setting up for use*/
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27107/toDoListProject", {useNewUrlParser: true, useUnifiedTopology: true});

//initializations
var items = [];
const itemSchema = {
  name: String
};
const Item = mongoose.model("Item", itemSchema);

//setting up the home route
app.get("/", function(req, res) {
  res.render("index", {
    dayName: date.getDayandDate(),
    listItems: items
  });
});

//setting up the 'about' route
app.get("/about", function(req, res){
  res.render("about");
})

//setting up the post request to the home route
app.post("/", function(req, res) {
  console.log(req.body);
  items.push(req.body.inputItem);
  res.redirect("/");
});

//setting up the srever at port
app.listen(3000, function() {
  console.log("Server running on port 3000.");
});
