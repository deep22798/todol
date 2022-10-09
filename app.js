const express=require("express");
const bodyParser= require("body-parser");
const app=express();

const _=require("lodash");

const mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb+srv://admin:admin12345@cluster0.dpm1w4k.mongodb.net/todoDB');



const itemSchema = {
  name:  String, //
};

const listSchema = {
  name:  String, // String is shorthand for {type: String}
  items: [itemSchema]
};

// User model
const Item = mongoose.model('items',itemSchema);
const List = mongoose.model('list',listSchema);







const item1={name:"Hello"};

const item2={name:"Hello"};

const item3={name:"Hello"};

const defaultItems=[item1,item2,item3];

// Function call



app.set("view engine","ejs");

var items=[];

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){

	Item.find({},function(err, foundItems){

		if(foundItems.length===0){
			Item.insertMany(defaultItems).then(function(err){
				if(err){
					console.log(err);
				}else{

					console.log("Data inserted") // Success
				}
			});
		}
		else{


					res.render("list",{listTitle:"Today",newListItem:foundItems});
		}
	});

var today=new Date();
// var currentday=today.toLocaleString();
// var day="";


var option={
  weekday:"long",
  day:"numeric",
  month:"long"
}

var day=today.toLocaleDateString("en-US",option);
// Item.find({},function(err,foundItems){
// 	console.log(foundItems);
// });



});




app.get("/:customListName",function(req,res){
	const customListName =_.capitalize(req.params.customListName);



	List.findOne({
		name:customListName
	},function(err,foundList){
		if(!err){
			if(!foundList){
				const list = new List({
					name:customListName,
					items:defaultItems
				});
				list.save();
				res.redirect("/"+customListName);

			}else{

									res.render("list",{listTitle:foundList.name,newListItem:foundList.items});
			}

		}
	});





	// res.redirect("/");

});


















app.post("/",function(req,res){
const itemName=req.body.newItem;
const linstName= req.body.list;


const item= new Item({
	name:itemName
});

if(linstName === "Today"){

  item.save();
    res.redirect("/");

}else{

  List.findOne({
    name:linstName
  },function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + linstName);
  }
);
}

// items.push(item);

});


app.post("/delete",function(req,res){
	const checkedItemId= req.body.checkbox;
  const listName=req.body.listName;


  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
    	if(!err){
    		console.log("Sucessfull check");
    		res.redirect("/")
    	}
    });

  }else{

List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
  if(!err){
    res.redirect("/" + listName);
  }
});

  }




	console.log(req.body.checkbox);
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
// app.listen(port);




app.listen(port,function(){
  console.log("Server Started on port: 3000");
});
