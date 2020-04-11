const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const _ = require("lodash");
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
var itemsArray = []; //array is used to transfer data
const itemSchema = { //Schema for single item
  name: String
};
const Item = mongoose.model("Item", itemSchema);
//setting up the custom Lists collection
const listSchema = { //schema for a custom List
  name: String,
  value: [itemSchema]
};
const List = mongoose.model("List", listSchema);

//setting up the home route
app.get("/", function(req, res) {
  Item.find(function(err, items) {
    if (err) {
      console.log("Error in reading from the DB.");
    } else {
      itemsArray = items;
      console.log("Successfully retrived the items and transferred it to the array.");
    }
  });
  console.log("Rendering page with array : " + itemsArray);
  res.render("index", {
    param: "",
    dayName: date.getDayandDate(),
    listItems: itemsArray
  });
});

//setting up the 'about' route
app.get("/about", function(req, res) {
  res.render("about");
});

//setting up the post request to the home route
app.post("/", function(req, res) {
  console.log(req.body);
  if (req.body.ButtonPress == "removeAll") {
    console.log("Removing All Data");
    itemsArray = [];
    Item.deleteMany({}, function(err) {
      if (err)
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
app.post("/delete", function(req, res) {
  if (req.body.listName == "") {
    itemsArray.splice(itemsArray.indexOf(req.body.CheckBox), 1);
    Item.deleteOne({
      name: req.body.CheckBox
    }, function(err) {
      if (err) {
        console.log("error in deleting single item");
      } else {
        console.log("Single Data removed");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({
      name: req.body.listName
    }, {
      $pull: {
        value: {
          name: req.body.CheckBox
        }
      }
    }, function(err, result) {
      if (!err) {
        res.redirect("/" + req.body.listName);
      } else {
        console.log("Error Deleting single item in custom list.");
      }
    });
  }
});

//setting up the routes for custom pages
app.get("/:customListName", function(req, res) {
  let customListName = req.params.customListName;
  customListName = _.capitalize([string = customListName]);
  List.findOne({
    name: customListName
  }, function(err, listFound) {
    if (!err) {
      if (!listFound) {
        //Create New List
        const list = new List({
          name: customListName,
          value: [{
            name: "Buffer Item"
          }]
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("index", {
          param: customListName,
          dayName: listFound.name,
          listItems: listFound.value
        });
      }
    } else {
      console.log("Error retriving list data");
    }
  });
});

//setting up post requests for custom routes
app.post("/:customListName", function(req, res) {
  const customListName = req.params.customListName;
  console.log(req.body);
  if (req.body.ButtonPress == "removeAll") {
    console.log("Removing All Data");
    itemsArray = [];
    List.deleteOne({
      name: customListName
    }, function(err) {
      if (err)
        console.log("Error removing data");
      else {
        console.log("All data removed");
      }
    });
    res.redirect("/" + customListName);
  } else {
    const item = new Item({
      name: req.body.inputItem
    });
    List.findOne({
      name: customListName
    }, function(err, foundList) {
      if (err) {
        console.log("error updating custom List");
      } else {
        foundList.value.push(item);
        foundList.save();
        console.log("Successfully updated custom List, now redirecting");
        res.redirect("/" + customListName);
      }
    });
  }
});

//setting up the srever at port
app.listen(3000, function() {
  console.log("Server running on port 3000.");
});
