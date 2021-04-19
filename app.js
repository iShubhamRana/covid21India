const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const https = require('https');
const axios = require('axios');
const { response } = require('express');
const app = express();
const Donor = require('./modals/donor.js')
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
require('dotenv').config();
app.set('view engine' , 'ejs');
let deaths , recovered , active , confirmed , date;


mongoose.connect('mongodb+srv://'+process.env.name+':' + process.env.password+'@cluster0.kzsaf.mongodb.net/donorDB', {useNewUrlParser:true , useUnifiedTopology:true});


const states = 
[
{
"key": "AN",
"name": "Andaman and Nicobar Islands"
},
{
"key": "AP",
"name": "Andhra Pradesh"
},
{
"key": "AR",
"name": "Arunachal Pradesh"
},
{
"key": "AS",
"name": "Assam"
},
{
"key": "BR",
"name": "Bihar"
},
{
"key": "CG",
"name": "Chandigarh"
},
{
"key": "CH",
"name": "Chhattisgarh"
},
{
"key": "DH",
"name": "Dadra and Nagar Haveli"
},
{
"key": "DD",
"name": "Daman and Diu"
},
{
"key": "DL",
"name": "Delhi"
},
{
"key": "GA",
"name": "Goa"
},
{
"key": "GJ",
"name": "Gujarat"
},
{
"key": "HR",
"name": "Haryana"
},
{
"key": "HP",
"name": "Himachal Pradesh"
},
{
"key": "JK",
"name": "Jammu and Kashmir"
},
{
"key": "JH",
"name": "Jharkhand"
},
{
"key": "KA",
"name": "Karnataka"
},
{
"key": "KL",
"name": "Kerala"
},
{
"key": "LD",
"name": "Lakshadweep"
},
{
"key": "MP",
"name": "Madhya Pradesh"
},
{
"key": "MH",
"name": "Maharashtra"
},
{
"key": "MN",
"name": "Manipur"
},
{
"key": "ML",
"name": "Meghalaya"
},
{
"key": "MZ",
"name": "Mizoram"
},
{
"key": "NL",
"name": "Nagaland"
},
{
"key": "OR",
"name": "Odisha"
},
{
"key": "PY",
"name": "Puducherry"
},
{
"key": "PB",
"name": "Punjab"
},
{
"key": "RJ",
"name": "Rajasthan"
},
{
"key": "SK",
"name": "Sikkim"
},
{
"key": "TN",
"name": "Tamil Nadu"
},
{
"key": "TS",
"name": "Telangana"
},
{
"key": "TR",
"name": "Tripura"
},
{
"key": "UK",
"name": "Uttar Pradesh"
},
{
"key": "UP",
"name": "Uttarakhand"
},
{
"key": "WB",
"name": "West Bengal"
}
];
const recoveryPeriod = [
    {
        key:'1',
        name: '1-week',
    },
    {
        key:'2',
        name: '2-weeks',
    },
    {
        key:'3',
        name: '3-weeks',
    },
    {
        key:'4',
        name: '1-month',
    },
    {
        key:'5',
        name: '2-months',
    },
    {
        key:'6',
        name: '3-months',
    },
    {
        key:'7',
        name: ' >3-months',
    },
]
const bloodGroups = [ 'A+','B+','AB+','O+','A-','B-','O-','AB-']
app.route('/')
.get( (req,res)=>{
    const f = async ()=>{
        const api1 = 'https://api.covid19api.com/dayone/country/india';
        axios.get(api1).then(response=>{
            
            const length = response.data.length;
            const array = response.data;
            const currentData = array[length-1];
            deaths = currentData.Deaths;
            confirmed = currentData.Confirmed;
            active = currentData.Active;
            recovered = currentData.Recovered;
            date = currentData.Date;

            
        })
    }
  
    f();
    res.render('main' , {Confirmed:confirmed , Recovered:recovered , Active:active, Deaths:deaths , Date: date });

})

//////////////////////////for formPage//////////////////////////////////////////////



app.route('/becomeDonor')
.get((req,res)=>{
    res.render('becomeDonor.ejs' , {states: states , recoveryPeriod: recoveryPeriod , bloodGroups: bloodGroups , success:0} );

})
.post((req,res)=>{
    
    const dummyDonor = new Donor(req.body);
    dummyDonor.save();
   res.render('becomeDonor.ejs' , {states: states , recoveryPeriod: recoveryPeriod , bloodGroups: bloodGroups , success:1} );
});

app.route('/searchDonors')
.get((req,res)=>{
    Donor.find({} , (err,result)=>{
      if(!err){
        res.render('searchDonors' , {donorList:result,states: states , recoveryPeriod: recoveryPeriod , bloodGroups: bloodGroups });
      }
      else{
      }
    })
})
.post((req,res)=>{
    Donor.find({} , (err,result)=>{
        if(!err){

            if(req.body.State != ''){
                result=result.filter((e)=>{
                    return (e.State === req.body.State)
                })
            }
            if(req.body.Period != ''){
                result=result.filter((e)=>{
                    return (e.Period === req.body.Period)
                })
            }
            if(req.body.Group != ''){
                result=result.filter((e)=>{
                    return (e.Group === req.body.Group)
                })
            }
            res.render('searchDonors' , {donorList:result,states: states , recoveryPeriod: recoveryPeriod , bloodGroups: bloodGroups });

        }
        else{
        }
      })
});




app.route('/aboutUs')
.get((req,res)=>{
    res.render('about');
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

