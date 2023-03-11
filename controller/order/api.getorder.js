const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://chian:Et0w9VJUcToaesTh@ahya.hvgsfbn.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

const neworder = require('../new')

exports.getorder = (req, res)=>{
    async function getorderfromdb(){
        try{
            const orderDB = client.db('orderDB')
            const orderlist = orderDB.collection('orderlist')
            const result = await orderlist.find().sort({taketime:1}).toArray()
            
            res.send({
                result:result,
                hasNew:neworder.newOrder.hasNew,
                newID:neworder.newOrder.newID
            })
        }
        catch(err){
            console.log(err);
        }
    }
    getorderfromdb()
}
exports.get_history = (req, res)=>{
    async function getorderfromdb(){
        try{
            const orderDB = client.db('orderDB')
            const orderlist_finish = orderDB.collection('orderlist_finish')
            const result = await orderlist_finish.find().sort({taketime:1}).toArray()
            return res.send(result)
        }
        catch(err){
            console.log(err);
        }
    }
    getorderfromdb()
}