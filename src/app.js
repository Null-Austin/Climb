// configs for future
const path = require('path')
const fs = require('fs')
const validator = require('validator');

// config express
const express = require('express')
const app = express();
const port = 3000;
app.set('views', path.join(__dirname, '../src/backend_assets/web'));
app.set('view engine', 'ejs');

// custom libs
const postManager = require('./custom-libs/postManager')
const posts = new postManager(path.join(__dirname,'database','posts','posts.db'))

const userManager = require('./custom-libs/userManager')
const users = new userManager(path.join(__dirname,'database','users','users.db'))

// custom functions
function isUrl(string) {
  return validator.isURL(string, { protocols: ['http','https'], require_protocol: true });
}

//ejs functions
function readFile(filepath){
    try {
        const fullPath = path.join(__dirname, 'backend_assets/web', filepath);

        if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        console.error(`[inlineFile] "${fullPath}" is not a valid file.`);
        return '';
        }

        return fs.readFileSync(fullPath, 'utf8')
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
            content+=`<div id="header"><a href="/home">Eles</a></div>`
        }
    })
    return content
}
app.use((req,res,next)=>{
    console.log(req.url + ' was accessed')
    next()
})
app.get('/',(req,res,next)=>{
    res.redirect('/home')
})
app.get('/home',(req,res,next)=>{
    res.render('pages/index.ejs')
})
// API stuff :/
app.get('/api/',(req,res)=>{ //get the hell out of here script kiddies
    res.redirect('/home')
})

app.get('/api/fyp-get', async (req, res) => {
    try {
        const postsData = await posts.getPosts();
        const usersMap = {};
        for (const post of postsData) {
            if (!usersMap[post.userid]) {
                const user = await users.getUserFromId(post.userid);
                usersMap[post.userid] = user ? user.username : null;
            }
        }
        const formattedPosts = postsData.map(post => ({
            userid: post.userid,
            content: post.content,
            image: post.image,
            username: usersMap[post.userid]
        }));
        res.json({ data: { posts: formattedPosts } });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/:api',(req,res)=>{ //idk why the hell * wild card would not work.
    var json = {"data":{
        "error":"no such page found"
    }}
    res.status(404).json(json)
})

app.listen(port,err=>{
    console.log('http://localhost:'+port)
})