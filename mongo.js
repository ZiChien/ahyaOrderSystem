const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://chian:Et0w9VJUcToaesTh@ahya.hvgsfbn.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

try {
    const orderDB = client.db('orderDB')
    const orderlist_finish = orderDB.collection('orderlist_finish')
    function delete_finish() {
        orderlist_finish.deleteMany()
    }
    function createdTtl(){
        orderlist_finish.createIndex({creatAt:1},{expireAfterSeconds:60})
    }
    async function setTtl(second){
        await orderlist_finish.dropIndex({creatAt:1},function(err,result){
            if(err){
                console.log(err);
            }
        })        
        orderlist_finish.createIndex({creatAt:1},{expireAfterSeconds:second})
    }

    const run = ()=>{
        setTtl(60*60*24*2)
    }




    ////////////////////
    run()
    ////////////////////
}
catch (err) {
    console.log(err);
}
