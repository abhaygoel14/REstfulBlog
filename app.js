var express= require("express");
var app=express();
var bodyParser=require("body-parser");
var appSanitize=require("express-sanitizer");
var methodOverride= require("method-override");
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(appSanitize());
app.use(methodOverride("_method"));
//MONGOOSE MODEL CONFIG
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type: Date, default:Date.now}
});
//MONGOOSE MODEL config
var Blog=mongoose.model("Blog",blogSchema);
//RESTFUL ROUTES
app.get("/blogs",function(req,res){
   
    Blog.find({},function(err,blogs){
        if(err){
            console.log("ERROR:");

        }else{
            res.render("ind",{blogs:blogs});
        }
    })
   
});
app.get("/",function(req,res){
    
    res.redirect("/blogs")
})
app.get("/blogs/new",function(req,res){
    res.render("new")
});
//CREATE ROUTE
app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    })
});
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog : foundBlog});
        }
    });
  
});
//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
});
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err,removeblog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs");
       }
   });
});
app.listen(3000,function(){
    console.log("BLOG SERVER IS WORKING!!!");
    });