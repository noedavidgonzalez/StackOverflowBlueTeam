const Question = require('../models/preguntas')
const express = require('express');
const Private  = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");
const Answer = require("../models/Answer");

Private.get('/questions', ensureLogin.ensureLoggedIn(),(req, res, next)=>{

  console.log('entreeeee')
 Question.find()
 .populate('username')
 .then(arrayOfQuestions => {
   console.log('valor' + arrayOfQuestions);
   res.render('/questions', {arrayOfQuestions});
 })
 .catch( err => {
   console.log(err);
 })
})


Private.post('/answers/add', ensureLogin.ensureLoggedIn(),(req, res, next) => {
  const { user, answer } = req.body;
  Question.update({ _id: req.query.question_id }, { $push: { reviews: { user, answer }}})
  .then(question => {
    res.redirect('/questions')
  })
  .catch((error) => {
    console.log(error)
  })
});

Private.get("/questions/add", ensureLogin.ensureLoggedIn(), (req, res)=>{
  console.log(req.user);
  res.render("private/addQuestions", { user: req.user })
  // res.send("hola")
})


Private.post("/questions/add", ensureLogin.ensureLoggedIn(), (req, res)=>{

 const pregunta = req.body.preguntita;
 const username = req.user._id;
 const respuestas = [];
 const prueba = new Question({username, pregunta: 'hardcodeada', respuestas})
 const newPregunta = new Question({username, pregunta, respuestas})
 newPregunta.save()
 .then((pregunta)=>{
   console.log("RESUL::::", pregunta)
   res.redirect(301, "/questions");
 })
 .catch(err=>console.log(err))
})

Private.get('/questions/:id', ensureLogin.ensureLoggedIn(),(req, res) => {
  let questionId = req.params.id
  Question.findOne({'_id': questionId})
  .then ((question) => {
    res.render('thread', {question})
  })
  .catch((err) => {
    console.log(err);
  })
})

module.exports = Private;