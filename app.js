const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({ extended:true }));
app.use(cors())

app.get('/', (req, res)=>{
    res.send("Server is Listening");
})

app.post('/submit',  (req, res)=>{
    console.log(reqs.body);
    const req = JSON.parse(reqs.body);
    console.log(req);

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const add = req.body.address;
    const cty = req.body.city;
    const st = req.body.state;
    const phoneNo = parseInt(req.phone); 


    var data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                    ADDRESS: {
                        addr1: add,
                        city: cty,
                        state: st,
                    },
                    NUMBER: phoneNo
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url =  process.env.MAILCHIMP_URL ;

    const options = {
        method: "POST",
        auth: AUTH_KEY,
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