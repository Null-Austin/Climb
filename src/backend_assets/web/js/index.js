document.addEventListener('DOMContentLoaded',async (e)=>{
    var data = await fetch('/api/fyp-get')
    var json = await data.json()
    console.log(json)
})