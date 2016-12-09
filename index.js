var express = require('express');
var session = require('session');
var bodyParser = require('body-parser');
var cors = require('cors');
var nodemailer = require('nodemailer');
var validator = require('email-validator');
var massive = require('massive');
var massiveServer = massive.connectSync({connectionString: "postgres://nhbpfkeb:8TnHx2rmCD6Lch118THSPwv3bACyOOWZ@elmer.db.elephantsql.com:5432/nhbpfkeb"})

var app = express();


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.set("db", massiveServer);
var db = app.get("db");
app.use(express.static('./public'));
app.post("/submitForm", function(req, res, next){
  console.log(req.body);
  db.patients.findOne({email: req.body.email}, function(err, user){
    if (!user) {
      db.patients.insert({firstname: req.body.firstName, lastname: req.body.lastName, email: req.body.email, phone: req.body.phone}, function(err, patient){
        console.log(err);
        console.log(patient);
        if (err) return res.status(500).json(err);
        db.messages.insert({message: req.body.message, patientid: patient.id}, function(err, message){
          return res.status(201).json(patient);
        })

      })
    }
    else {
      db.messages.insert({message: req.body.message, patientid: user.id}, function(err, message){
        return res.status(201).json(user);
      })
    }
  })
});
app.get("/getallpatients", function (req, res, next){
  db.get_patients([], function(err, patients){
    console.log(err);
    return res.status(200).json(patients);
  })
})
app.post('/contactus', function(req, res, next) {
  // if(!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.subject || !req.body.message) {
  //   return res.send('missing information');
  // }
  // var email_check = validator.validate(req.body.mail);
  // if(email_check == false) {
  //   return res.send('invalid email');
  // }
  var mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'emptystreetriot@gmail.com',
      pass: 'javascript2016!'
    }
  });
  mailOpts = {
    from: {
      name: req.body.firstname,
      address: req.body.email
    },
    to: 'emptystreetriot@gmail.com',
    subject: req.body.subject,
    text: req.body.message
  }
  smtpTrans.sendMail(mailOpts, function(err, info) {
    if(err) {
      console.log(err);
      return res.send('err');
    }
    else {
      sweetAlert('Congratulations!', 'Your message has been successfully sent', 'success');
    }
  });
})


app.listen(3000, function() {
  console.log('listening on port 80');
})
