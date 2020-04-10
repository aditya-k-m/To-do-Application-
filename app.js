const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
//got the dependecies ready

/*setting up for use*/
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/toDoListProject", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//initializations
var itemsArray = [];
const itemSchema = {
  name: String
};
const Item = mongoose.model("Item", itemSchema);

//setting up the home route
app.get("/", function(req, res) {
  Item.find(function(err, items) {
    if (err) {
      console.log("Error in reading from the DB.");
    } else {
      let i = 0;
      items.forEach((item, i) => {
        itemsArray[i] = items[i].name;
        i = i + 1;
      });
      console.log("Successfully retrived the items and transferred it to the array.");
    }
  });
  console.log("Rendering page with array : "+itemsArray);
  res.render("index", {
    dayName: date.getDayandDate(),
    listItems: itemsArray
  });
});

//setting up the 'about' route
app.get("/about", function(req, res) {
  res.render("about");
})

//setting up the post request to the home route
app.post("/", function(req, res) {
  console.log(req.body);
  if (req.body.ButtonPress == "removeAll"){
    console.log("Removing All Data");
    itemsArray = [];
    Item.deleteMany({},function(err){
      if(err)
      console.log("Error removing data");
      else {
        console.log("All data removed");
      }
    });
  }
  const item = new Item({
    name: req.body.inputItem
  });
  item.save();
  res.redirect("/");
});

//post request for deleting single item
app.post("/delete", function(req, res){
  itemsArray.splice(itemsArray.indexOf(req.body.CheckBox), 1);
  Item.deleteOne({name: req.body.CheckBox}, function(err){
    if(err){
      console.log("error in deleting single item");
    }
    else {
      console.log("Single Data removed");
    }
  });
  res.redirect("/");
})

//setting up the srever at port
app.listen(3000, function() {
  console.log("Server running on port 3000.");
});
