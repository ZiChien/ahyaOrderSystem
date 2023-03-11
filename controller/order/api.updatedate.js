const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://chian:Et0w9VJUcToaesTh@ahya.hvgsfbn.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

const DATE_ID = '202210301724'
const TIME_ID = '20221104'
exports.updatedate = (req, res)=>{
    async function datetomongo(){
        try{
            const orderDB = client.db('orderDB')
            const availabledate = orderDB.collection('availabledate')
            const options = { upsert: true };
            const filter = {"id":DATE_ID}
            const updateDoc = {
                $set: {
                  date: req.body.result,
                  maxdayindex:req.body.maxdayindex
                },
            };
            const result = await availabledate.updateOne(filter,updateDoc,options)
            return res.send(result)
        }
        catch(err){
            console.log(err);
            return res.status(400).send(err)
        }
    }
    datetomongo()
}
exports.getdate = (req, res)=>{
    async function getdate(){
        try{
            const orderDB = client.db('orderDB')
            const availabledate = orderDB.collection('availabledate')
            const filter = {"id":DATE_ID}
            const result = await availabledate.findOne(filter)
            return res.send(result)
        }
        catch(err){
            return res.send(res.send(err))
            console.log(err);
        }
    }
    getdate()
}

exports.updatetime = (req, res)=>{
    const moment = require('moment')
    const starttime = moment(`2022-11-04 ${req.body.starttime[0]}:${req.body.starttime[1]}`)
    const endtime = moment(`2022-11-04 ${req.body.endtime[0]}:${req.body.endtime[1]}`)
    if(!moment(starttime).isBefore(endtime)){
        return res.status(400).send({
            err:"The starttime is not before the endtime"
        })
    }
    const availabletime = []
    const counttime = moment(starttime)

    while(moment(counttime).add(10,'m').isBefore(endtime)){
        counttime.add(10,'m')
        availabletime.push(moment(counttime).format())
    }

    updatetimetomongo()
    async function updatetimetomongo(){
        try{
            const orderDB = client.db("orderDB")
            const availabledate = orderDB.collection("availabledate")
            const options = { upsert: true };
            const filter = {"id":TIME_ID}
            const updateDoc = {
                $set: {
                    starttime:starttime,
                    endtime:endtime,
                    availabletime:availabletime
                },
            };
            const result = await availabledate.updateOne(filter,updateDoc,options)
        }
        catch(err){
            console.log(err);
        }
    }
}
exports.gettime = (req, res)=>{
    async function gettime(){
        try{
            const orderDB = client.db('orderDB')
            const availabledate = orderDB.collection('availabledate')
            const filter = {"id":TIME_ID}
            const result = await availabledate.findOne(filter)
            return res.send(result)
        }
        catch(err){
            return res.send(res.send(err))
            console.log(err);
        }
    }
    gettime()
}

exports.updateinfo = (req, res)=>{
    async function infotomongo(){
        try{
            const systemAdmin = client.db('systemAdmin')
            const shopinfo = systemAdmin.collection('shopinfo')
            const options = { upsert: true };
            const filter = {"id":'shopinformation'}
            const updateDoc = {
                $set: {
                  info:{
                    name:req.body.data.name,
                    address:req.body.data.address,
                  }
                },
            };
            const result = await shopinfo.updateOne(filter,updateDoc,options)
            return res.send(result)
        }
        catch(err){
            console.log(err);
            return res.status(400).send(err)
        }
    }
    infotomongo()
}
exports.getinfo = (req, res)=>{
    async function getshopinfo(){
        try{
            const systemAdmin = client.db('systemAdmin')
            const shopinfo = systemAdmin.collection('shopinfo')
            const filter = {"id":'shopinformation'}
            const result = await shopinfo.findOne(filter)
            return res.send(result.info)
        }
        catch(err){
            return res.send(res.send(err))
            console.log(err);
        }
    }
    getshopinfo()
}