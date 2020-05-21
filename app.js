const express=require('express');
const bodyParser=require('body-parser');
const request=require("request");

const https=require('https');
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/",function(req,res){
    
  let location=req.body.city;
 
  baseUrl="http://api.weatherapi.com/v1/current.json?key=b2e0a492ae754235a8d175234201905&q="
  let url=baseUrl+location;
   
  request(url,function(error,response,body){
       let data=JSON.parse(body);
      if(data.error)
      {
        res.sendFile(__dirname+"/failure.html");
       
       
      }
      else {
        let temp=data.current.temp_c;
        let feelsLike=data.current.feelslike_c;
        let precip=data.current.precip_mm;
        let texts=data.current.condition.text;
        let icon=data.current.condition.icon;
        request("http://api.weatherapi.com/v1/forecast.json?key=b2e0a492ae754235a8d175234201905&q="+location+"&days=7",function(err,response,body){
            let week=JSON.parse(body);
            console.log(week);
           
           let maxtemp=[];
           let mintemp=[];
           let info=[];
           let icons=[];
           let date=[];
           let rain=[];
           for(var i=0;i<3;i++)
           {
               maxtemp.push(week.forecast.forecastday[i].day.maxtemp_c);
               mintemp.push(week.forecast.forecastday[i].day.mintemp_c);
               info.push(week.forecast.forecastday[i].day.condition.text);
                icons.push(week.forecast.forecastday[i].day.condition.icon);
                date.push(week.forecast.forecastday[i].date);
                rain.push(week.forecast.forecastday[i].day.daily_chance_of_rain)
           }
           console.log(maxtemp,mintemp,date,info)
            res.render("list",{place:location,celcius:temp,feel:feelsLike,precipitation:precip,text:texts,image:icon,maxtemp,mintemp,info,icons,date,rain});
        
        })
        console.log(data.location.localtime);
       
      
      
      
        
        
       
      }
     
     
  })
  
 
  
});


app.listen(process.env.PORT||3000,function(){
    console.log("server started on port 3000");
});


