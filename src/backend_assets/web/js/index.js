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

        clone.addEventListener('click', (e) => {
            //create a new tab with the image url
            var img = clone = clone.querySelector('img').src
            var win = window.open(img, '_blank');
        })
    })
})