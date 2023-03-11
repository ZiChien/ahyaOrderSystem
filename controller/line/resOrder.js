const line = require('@line/bot-sdk');
const lineConfig = {
    channelSecret: 'f536a5da32145d21fd977a34ddec4c19',
    channelAccessToken: 'y/nBB3YAPmw9xFCndwkN2r8xfdFZ/8h9E+DgBv98wQVYYuibkPOe1A9o1mNA8JFtPrpRq47xm3K1LszfFYd9OZDnoWO1bsLrQ5gFFSyM4WEfvmFTISBwHQ5+DI8bH5+AsxsVO/BIC9XbPYJ/utQB/AdB04t89/1O/w1cDnyilFU='
}
const client = new line.Client(lineConfig);

const send = (order) => {
    const moment = require('moment-timezone')
    const taketime = moment(order.taketime).tz('Asia/Taipei')
    let hour = taketime.hours()
    let min = taketime.minutes()
    if(hour<10){
        hour = `0${hour}`
    }
    if(min<10){
        min = `0${min}`
    }
    let text_time = `您的訂單已送出!\n請於${taketime.year()}/${taketime.month()+1}/${taketime.date()} ${hour}:${min} 至本店取餐，謝謝!\n`
    let text_takenumber = `🔸自取號碼:${order.takenumber}\n`
    let text_info = ` -${order.total}元\n -${order.name}\n -${order.phone}\n`
    let text_order = '' ;
    order.content.forEach(item => {
        let mtls = '';
        let bonusmtls = '';
        item.mtls.forEach(mtl =>{
            mtls+=`${mtl.name} `
        })
        if(item.bonusmtls.length){
            item.bonusmtls.forEach(mtl =>{
                bonusmtls+=`${mtl.name} `
            })
        }else{
            bonusmtls = '無'
        }
        let eachorder = `▪️${item.name} ${item.number==1 ? '' :'x'+item.number}\n  -${mtls}\n  -加選配料:${bonusmtls}\n  -${item.price}元\n`
        
        text_order+=eachorder+'\n'
    });

    //                            
    let msg =  `${text_time}\n${text_takenumber}\n[訂購資訊]\n\n${text_info}\n[訂購內容]\n\n${text_order}\n`
    //
    const message = {
        type: 'text',
        text: msg,
    };
    client.pushMessage(order.userId, message)
        .then(() => {
        })
        .catch((err) => {
            console.log("fail");
        });
}

module.exports = { send }