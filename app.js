const express                =    require("express"),
      app                    =    express(),
      bodyParser             =    require("body-parser"),
	 passport               =    require("passport"),
      localStrategy          =    require("passport-local"),
	 methodOverride         =    require("method-override"),
      passportLocalMongoose  =    require("passport-local-mongoose"),
      mongoose               =    require("mongoose"),
	 flash                  =    require("connect-flash"),
      Campground             =    require("./models/campground"),
	 Comment                =    require("./models/comment"),
	 User                   =    require("./models/user"),
	 seedDB                 =    require("./seeds");

const commentRoutes          =    require("./routes/comments"),
	 campgroundRoutes       =    require("./routes/campgrounds"),
	 indexRoutes            =    require("./routes/index")

// seedDB();

mongoose.connect("mongodb://localhost/yelp_camp_v12");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//passport configuration
app.use(require("express-session")({
	secret: "Once again he wins",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error       = req.flash("error");
	res.locals.success     = req.flash("success");
     next();
});
//requiring routes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, () => {
	console.log("server is listening")
});

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("The YelpCamp server has started");
});