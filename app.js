const express = require('express');
const axios = require('axios');
const app = express();


app.get('/',async (req,res) => {
    let lat = Number(req.query.lat);
    let lng = Number(req.query.lng);
    if(!lat && !lng){
        res.json({message:"No query parameters provided"});
    }
    let Data;
    let resp_d = [];
    await axios.get('https://apitest2.smartsevak.com/places').then((response) => {
        Data = response.data.data;
    });
    Data.forEach((elem,i) => {
        let dist = distance(lat,elem.lat,lng,elem.lng);
        resp_d[i] = {name:elem.name,distance:dist};
    });
    resp_d.sort((a,b) => {
        if(a.distance < b.distance){
            return -1;
        }
        if(a.distance > b.distance){
            return 1;
        }
        return 0;
    })
    res.json({data:resp_d});

});

app.listen(process.env.PORT || 3000,() => {
    console.log("App listening on 3000");
});


function distance(lat1,lat2, lon1, lon2){


    lon1 =  lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin(dlon / 2),2);

    let c = 2 * Math.asin(Math.sqrt(a));

    let r = 6371;

    return(c * r);
}