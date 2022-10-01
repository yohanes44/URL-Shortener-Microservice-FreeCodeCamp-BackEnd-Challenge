require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require("body-parser");
var dns = require("dns");
const validUrl = require("valid-url");
const shortId = require("shortid");

const mongoose = require("mongoose");

  
  mongoose.connect("mongodb+srv://john44:john44@nodeexpressprojects.bwwog.mongodb.net/freeCodeCamp_DB?retryWrites=true");



var urlSchema = new mongoose.Schema({
  originaleUrl: String,
  shortUrl: String
})


var allUrl = mongoose.model("allUrl", urlSchema);





var urlEncoded = bodyParser.urlencoded({extended: false});



const port = process.env.PORT || 3000;
app.use(bodyParser.json())
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));




app.get("/api/shorturl/:myShortUrl", async (req, res)=>{

  var {myShortUrl} = req.params;
    

   var checkThis = await allUrl.findOne({shortUrl: myShortUrl});

  if(checkThis){
    res.redirect(checkThis.originaleUrl);
  }
  else if(!checkThis){
    res.json({ error: 'invalid url' });
  }

  
  
})



app.post("/api/shorturl", urlEncoded, async (req, res)=>{
      var myUrl = req.body.url
      var shUrl = shortId.generate();

      var foundedUrl = await allUrl.findOne({originaleUrl: myUrl});
     
   
      if(foundedUrl){
   res.json({ original_url: foundedUrl.originaleUrl, short_url: originaleUrl.shortUrl})
      }
   
     
   else if(!foundedUrl){
   
   
     if(validUrl.isWebUri(myUrl)){
                var urlForMongo = new allUrl({originaleUrl: myUrl,shortUrl: shUrl})
   
         urlForMongo.save(function(err, data){
            if(err) return console.error(err);
            console.log(data);
         }) 
   
     res.json({ original_url: myUrl, short_url: shUrl});
       
     }
   
     else{
        res.json({ error: 'invalid url' });
     }
   
   } 
     
                  
    })
   
   
   
            
   app.listen(port, function() {
     console.log(`Listening on port ${port}`);
   });
   