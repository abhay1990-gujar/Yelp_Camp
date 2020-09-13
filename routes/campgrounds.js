const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

//INDEX Route show all campground
router.get("/", function(req, res){
	//get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
	
});

//CREATE route add new campgrounds to the database
router.post("/", middleware.isLoggedIn, function(req, res){
	const name   = req.body.name;
	const price  = req.body.price;
	const image  = req.body.image;
	const desc   = req.body.description;
	const author = {
		      id: req.user._id,
		username: req.user.username
	}
	const newCampground ={name: name,price: price, image: image, description: desc, author:author};
	
	//creat a new campground and save to DB;
	Campground.create(newCampground, function(err, newlyCreated){
		
		if(err){
			console.log(err);
		} else{
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
});

//NEW show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new")
});

//shows more info about one camp grounds
router.get("/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
     if(err){
			console.log(err);
		  } else{
			  console.log(foundCampground);
			//render show template with that campground
	      res.render("campgrounds/show", {campground: foundCampground});
		  }
	});
});

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campgrounds
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else{
			//redirect to show page
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds")
		}
	});
});


module.exports = router;