let rawJSON
let keys
async function jsonGrab(){
    const result = await fetch("js/ytrandom.json")
    rawJSON = await result.json()
    return rawJSON
}

async function refreshKeys(){
    await jsonGrab()
    keys = Object.keys(rawJSON)
}

async function grabRandom(){
    if (!keys || keys.length <= 0){ // I know this technically misses a video, but I'm fine with that.
        await refreshKeys()
    }
    let randNum = Math.floor(Math.random()*keys.length)
    let randomItem = keys[randNum]
    keys.splice(randNum, 1)
    // console.log(`Keys Length: ${keys.length} \nRandom Number: ${randNum}`)
    document.getElementById('startbtn').href = randomItem
}
document.getElementById('startbtn').addEventListener("click", grabRandom)
grabRandom()
