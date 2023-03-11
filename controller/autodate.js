const moment = require('moment')
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://chian:Et0w9VJUcToaesTh@ahya.hvgsfbn.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

const mongo_date_id = "202210301724"
const ORDERNUMBER = 20
exports.start = () => {
    const Cron = require('croner')
    Cron(
        "@daily",
        {
            timezone:"Asia/Taipei"
        }, function () {
            dateupdate()
            console.log("date has been updated");
        })
    async function dateupdate() {
        try {
            const orderDB = client.db('orderDB')
            const availabledate = orderDB.collection('availabledate')
            const query = { "id": mongo_date_id }
            const result = await availabledate.findOne(query)
            const odate = result.date
            const newmoment = moment(odate[29].date).add(1, 'd')
            const newdate = {
                date: newmoment.format(),
                enable: true,
                ordernumber: ORDERNUMBER,
            }
            odate.push(newdate)
            const shift = odate.shift()

            const options = { upsert: true };
            const filter = { "id": mongo_date_id }
            const updateDoc = {
                $set: {
                    date: odate,
                },
            };
            const updateresult = await availabledate.updateOne(filter, updateDoc, options)
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.resetdate = () => {

    const date30 = []
    for (i = 0; i < 30; i++) {
        date30.push({
            date: moment().add(i, 'd').format(),
            enable: true,
            ordernumber: ORDERNUMBER,
        })
    }
    resetdate()
    async function resetdate() {
        try {
            const orderDB = client.db('orderDB')
            const availabledate = orderDB.collection('availabledate')
            const options = { upsert: true };
            const filter = { "id": mongo_date_id }
            const updateDoc = {
                $set: {
                    date: date30
                },
            };
            const result = await availabledate.updateOne(filter, updateDoc, options)
        }
        catch (err) {
            console.log(err);
        }
    }
}