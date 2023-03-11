const line = require('@line/bot-sdk');
const lineConfig = {
    channelSecret: 'f536a5da32145d21fd977a34ddec4c19',
    channelAccessToken: 'y/nBB3YAPmw9xFCndwkN2r8xfdFZ/8h9E+DgBv98wQVYYuibkPOe1A9o1mNA8JFtPrpRq47xm3K1LszfFYd9OZDnoWO1bsLrQ5gFFSyM4WEfvmFTISBwHQ5+DI8bH5+AsxsVO/BIC9XbPYJ/utQB/AdB04t89/1O/w1cDnyilFU='
}
const client = new line.Client(lineConfig);
const repeat = (req, res) => {
    // Promise
    //     .all(req.body.events.map(handleEvent))
    //     .then((result) => res.json(result))
    //     .catch((err) => {
    //         res.status(500).end();
    //     });
    res.status(200).end();
}
const handleEvent = (event) => {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    return client.replyMessage(event.replyToken, {
        type: 'text', text: event.message.text // 應聲蟲範例
    }).catch((err) => {
        if (err) {
            console.error(err);
        }
    });
};

module.exports = { lineConfig, repeat }