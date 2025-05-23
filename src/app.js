// configs for future
const path = require('path')

// config express
const express = require('express')
const app = express();
const port = 3000;
app.set('views', path.join(__dirname, '../src/backend_assets/web'));
app.set('view engine', 'ejs');

app.get('/',(req,res,next)=>{
    res.render('index.ejs')
})

app.listen(port,err=>{
    console.log('http://localhost:'+port)
})