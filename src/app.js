// app.js

// configs for future
const path = require('path')
const fs = require('fs')

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
    return readFile(filepath)

};
app.locals.inlineCSS = function(filepath) {
    const mainCSS = readFile('css/main.css')
    const fileCSS = readFile(`css/${filepath}`)

    return `${mainCSS}${fileCSS}`
};
app.locals.fillcontent = function(list){
    let content = '';
    list.forEach(item=>{
        if (item==='header'){
            content+=`<div id="header"><a href="/home">Eles</a></div>`
        }
    })
    return content
}
app.use((req,res,next)=>{
    console.log(req.url + ' was accessed')
    next()
})
app.get('/',(req,res)=>{
    res.redirect('/home')
})
app.get('/home',(req,res)=>{
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

app.get('/api/:api',(req,res)=>{ //IDK why the hell * wild card would not work.
    let json = {"data":{
        "error":"no such page found"
    }}
    res.status(404).json(json)
})

app.get('/img/priv/:img', (req, res) => {
    const imgPath = path.join(__dirname, 'user_assets','PRIVATE',req.params.img);
    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    }
})
app.get('/img/:img', (req, res) => {
    const imgPath = path.join(__dirname, 'user_assets','PUBLIC',req.params.img);
    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    }
})

app.use((req, res) => {
    res.status(404).render('pages/404.ejs')
})

app.listen(port,err=>{
    console.log(err)
    console.log('http://localhost:'+port)
})