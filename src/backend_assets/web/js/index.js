document.addEventListener('DOMContentLoaded',async (e)=>{
    var data = await fetch('/api/fyp-get')
    var json = await data.json()
    json = json['data']['posts']
    console.log(json)

    const template = document.getElementById('post-template')
    json.forEach(post=>{
        var clone = template.cloneNode(true)
        clone.id=''
        clone.querySelector('span.details').innerText = post['content']
        clone.querySelector('img').src = post['image']
        clone.querySelector('.user').innerText = post['username']
        document.querySelector('div#content').appendChild(clone)
    })
})