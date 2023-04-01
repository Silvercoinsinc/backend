const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const https = require('https');
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended:true }));
app.use(cors())

app.get('/', (req, res)=>{
    res.send("Server is Listening");
})

app.post('/submit',  (reqs, res)=>{
    const req = JSON.parse(Object.keys(reqs.body)[0]);
    console.log(req);

    const firstName = req.fName;
    const lastName = req.lName;
    const email = req.email;
    const add = req.address;
    const cty = req.city;
    const st = req.state;
    const phoneNo = parseInt(req.phone); 
    console.log(add);
    console.log(cty);
    console.log(st);
    console.log(phoneNo);


    var data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                    PHONE: phoneNo,
                    ADDRESS: {
                        addr1: add,
                        city: cty,
                        state: st,
                        zip: "12345"
                    },
                    
                },
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url =  process.env.MAILCHIMP_URL ;

    const options = {
        method: "POST",
        auth: process.env.AUTH_KEY,
    }

    const request = https.request(url, options, (response)=>{
        if(response.statusCode === 200) {
            res.send("Successfully subscribed!")
        }
        else{
            res.send("Something went wrong on server side")
        }
        response.on("data", (data)=>{
            console.log(JSON.parse(data))
        })
    } )

    request.write(jsonData);
    request.end();
    
})

app.listen( 4000, ()=>{
    console.log("Listening on port 4000");
})