const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
require('dotenv').config();


const app = express();
const port = 3000;
const db = new pg.Client({
    user: process.env.DB_USERNAME,
    host: "localhost",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    post: 5432,
});

db.connect();





app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));





app.get("/index", (req, res) =>{
    res.render("index.ejs");

});

app.get("/" , (req,res) =>{

    db.query("SELECT username, blog FROM blogit" , (err,result) =>{
        if(err){
            console.log("Error fetching data" , err);
        }

        const data = result.rows;

        res.render("mainpage.ejs", {data});
        


    })
    
})

app.get("/publishpage", (req,res) =>{
    const displaycontent = req.query.content;
    res.render("publishpage.ejs" , {content: displaycontent});

})

app.post("/publish", (req, res) =>{
    const blog = req.body.content;
    res.redirect(`/publishpage?content=${encodeURIComponent(blog)}`);
})

app.post("/finalpublish", (req,res) =>{
    const finalblog = req.body.finalblog;
    const user_name = req.body.blogger;

    db.query("INSERT INTO blogit (username , blog) VALUES($1 , $2)", [user_name, finalblog]);
    res.redirect("/");
    
})


    


    

  
app.listen(port , () => {
    console.log(`server running on port ${port}`);
})

