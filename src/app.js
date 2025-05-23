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
function readFile(filepath){
    try {
        const fullPath = path.join(__dirname, 'backend_assets/web', filepath);

        if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        console.error(`[inlineFile] "${fullPath}" is not a valid file.`);
        return '';
        }

        return fs.readFileSync(fullPath, 'utf8').replaceAll('\n','')
    } catch (err) {
        console.error(`Failed to load from ${filepath}:`, err);
        return '';
    }
}

// webserver functions
app.locals.inlineFile = function(filepath) {
    var file = readFile(filepath)
    return file
};
app.locals.inlineCSS = function(filepath) {
    var mainCSS = readFile('css/main.css')
    var fileCSS = readFile(`css/${filepath}`)

    var css = `${mainCSS}${fileCSS}`
    return css
};
app.locals.fillcontent = function(list){
    var content = '';
    list.forEach(item=>{
        if (item=='header'){
            content+=`<div id="header">this is a header</div>`
        }
    })
    return content
}
app.use((req,res,next)=>{
    logger.add(`${req.ip} accessed ${req.url}.`)
    next()
})
app.get('/',(req,res,next)=>{
    res.redirect('/home')
})
app.get('/home',(req,res,next)=>{
    res.render('pages/index.ejs')
})
app.listen(port,err=>{
    console.log('http://localhost:'+port)
})