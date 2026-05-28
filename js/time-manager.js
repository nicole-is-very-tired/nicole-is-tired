let htmlHours = document.getElementById("hour")
let htmlMinutes = document.getElementById("minutes")
let htmlAMPM = document.getElementById("ampm")

function changeTime(){
    // var today = new Date("December 25, 1995 10:09:30");
    var today = new Date();
    if(htmlHours.innerText != today.getHours()){
        
        if(today.getHours() > 11){
            htmlAMPM.innerText = "PM"
        }else{
            htmlAMPM.innerText = "AM"
        }

        if(today.getHours() > 12){
            htmlHours.innerText = (parseInt(today.getHours()) - 12)
        }else{
            if(today.getHours() == 0){
                if(htmlHours.innerText == 12){return}
                htmlHours.innerText = "12"
            }else{
                htmlHours.innerText = today.getHours()
            }
        }
    }
    
    if(htmlMinutes.innerText != today.getMinutes()){
        if(today.getMinutes() < 10 && htmlMinutes != ("0" + today.getMinutes())){
            htmlMinutes.innerText = "0" + today.getMinutes()
        }else{
            htmlMinutes.innerText = today.getMinutes()
        }
    }

    setTimeout(() => {
        changeTime()
    }, 1000);
}
changeTime()