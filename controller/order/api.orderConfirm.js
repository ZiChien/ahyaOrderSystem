const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://chian:Et0w9VJUcToaesTh@ahya.hvgsfbn.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);
const neworder = require('../new')
const resOrder = require('../line/resOrder')
exports.addorder = (req, res) => {

    async function Saveorder() {
        try {
            const orderDB = client.db('orderDB')
            const orderlist = orderDB.collection('orderlist')
            const order = req.body.order
            order.isready = false
            order.istake = false
            order.isfocus = false

            const query = {
                orderID: order.orderID
            }
            const alreadyHasOrder = await orderlist.findOne(query)
            if (alreadyHasOrder) {
                return res.send(false)
            }

            const mongo_date_id = "202210301724"
            const availabledate = orderDB.collection('availabledate')
            const datequery = { "id": mongo_date_id }
            const findResult = await availabledate.findOne(datequery)
            const date = findResult.date
            const dateindex = date.findIndex(element => {
                let orderdate = new Date(order.taketime)
                let eledate = new Date(element.date)
                return orderdate.getDate() === eledate.getDate()
            });
            const nowTakeNumer = date[dateindex].ordernumber+1
            order.takenumber = nowTakeNumer
            const result = await orderlist.insertOne(order)//save
            neworder.newOrder.hasNew = true
            neworder.newOrder.newID = order.orderID

            const updateDoc = {
                $set: {
                    [`date.${dateindex}.ordernumber`]:nowTakeNumer
                },
              };
            const r =  await availabledate.updateOne(datequery,updateDoc)
            //line res order
            if (order.isLine) {
                resOrder.send(order)
            }
            res.send({
                takeNumber: nowTakeNumer
            })
        }
        catch (err) {
            console.log(err);
        }
    }
    Saveorder()
}