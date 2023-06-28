// const queue = require('../config/kue');

// const commentsMailer = require('../mailers/comments_mailer');

// // every worker has a process function
// //this method tells the worker whenever a new task is added to queue we need to run the code inside this queue
// // job = what task is need to be done (i.e comment's email)
// queue.process('emails' , function(job ,done){
//     // console.log('Email working in background');
//     commentsMailer.newComment(job.data);
//     done();
// })