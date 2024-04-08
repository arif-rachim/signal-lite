import {signal,effect} from '../lib/main';


const currentTime = signal(new Date());
const formattedCurrentTime = signal(() => {
    return formatDate(currentTime())
})

setInterval(() => {
    currentTime(new Date())
},1000)

function formatDate(date:Date) {

    return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',second:'2-digit' }).replace(/,/g, '')
}

effect(() => {
    document.getElementById('currentTime')!.innerHTML = formattedCurrentTime()
})