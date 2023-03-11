const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://chian:Et0w9VJUcToaesTh@ahya.hvgsfbn.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

exports.updatestatus = (req, res) => {
    async function updatetomongo() {
        try {
            const orderDB = client.db('orderDB')
            const orderlist = orderDB.collection('orderlist')
            const options = { upsert: true };
            const orderID = req.body.orderID;
            const filter = { "orderID": orderID }
            let updateDoc;
            updateDoc = {
                $set: {
                    "isready": true
                }
            };

            const result = await orderlist.updateOne(filter, updateDoc, options)
            return res.send(result)
        }
        catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    }
    updatetomongo()
}
exports.updatetake = (req, res)=>{
    async function updatetomongo() {
        try {
            const orderDB = client.db('orderDB')
            const orderlist = orderDB.collection('orderlist')
            const orderID = req.body.orderID;
            const query = { "orderID": orderID }
            const result = await orderlist.findOne(query)
            if(!result){
                return
            }
            result.istake = true
            
            const orderlist_finish = orderDB.collection('orderlist_finish')
            result.creatAt = new Date()
            const addresult = await orderlist_finish.insertOne(result)

            const deleteresult = await orderlist.deleteOne({orderID:result.orderID})
            return res.send(result)
        }
        catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    }
    updatetomongo()
}