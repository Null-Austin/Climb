// configs for future
const path = require('path')
const fs = require('fs')

// config express
const express = require('express')
const app = express();
const port = 3000;
app.set('views', path.join(__dirname, '../src/backend_assets/web'));
app.set('view engine', 'ejs');

//ejs functions
app.locals.inlineFile = function(filepath) {
  try {
    const fullPath = path.join(__dirname, 'backend_assets/web', filepath);

    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      console.error(`[inlineFile] "${fullPath}" is not a valid file.`);
      return '';
    }

    return fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    console.error(`Failed to load from ${filepath}:`, err);
    return '';
  }
};

app.get('/',(req,res,next)=>{
    res.redirect('/home')
})

app.get('/home',(req,res,next)=>{
    res.render('pages/index.ejs')
})

app.listen(port,err=>{
    console.log('http://localhost:'+port)
})