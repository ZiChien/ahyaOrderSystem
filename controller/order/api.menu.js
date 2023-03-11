const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://chian:Et0w9VJUcToaesTh@ahya.hvgsfbn.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);
const mtlID = '3920963'

exports.resetmtl = (req, res) => {
    async function resetmtltomongo() {
        try {
            const orderDB = client.db('orderDB')
            const menu = orderDB.collection('menu')
            const options = { upsert: true };
            const filter = { "id": mtlID }
            const updateDoc = {
                $set: {
                    mtl: req.body.mtl
                },
            };
            const result = await menu.updateOne(filter, updateDoc, options)
            return res.send(result)
        }
        catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    }
    resetmtltomongo()
}

exports.updatemtlstatus = (req, res) => {
    async function Umtlstatustomongo() {
        try {
            const orderDB = client.db('orderDB')
            const menu = orderDB.collection('menu')
            const options = { upsert: true };
            const filter = { "id": mtlID }
            const mtlindex = req.body.index
            const newmtl = req.body.mtl
            const updateDoc = {
                $set: {
                    [`mtl.${mtlindex}`]: newmtl
                },
            };
            const result = await menu.updateOne(filter, updateDoc, options)
            return res.send(result)
        }
        catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    }
    Umtlstatustomongo()
}


exports.getmtl = (req, res) => {
    async function getmtlfrommongo() {
        try {
            const orderDB = client.db('orderDB')
            const menu = orderDB.collection('menu')
            const query = { "id": mtlID }
            const result = await menu.findOne(query)
            return res.send(result)
        }
        catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    }
    getmtlfrommongo()
}

exports.resetmenuSummer = (req, res) => {
    async function resetsummertomongo() {
        try {
            const orderDB = client.db('orderDB')
            const menu = orderDB.collection('menu')
            const options = { upsert: true };
            const filter = { "id": mtlID }
            const updateDoc = {
                $set: {
                    summer: req.body.summer
                },
            };
            const result = await menu.updateOne(filter, updateDoc, options)
            return res.send(result)
        }
        catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    }
    resetsummertomongo()
}


exports.updatesummermenu = (req, res) => {
    async function Unummermenustatustomongo() {
        try {
            const orderDB = client.db('orderDB')
            const menu = orderDB.collection('menu')
            const options = { upsert: true };
            const filter = { "id": mtlID }
            const index = req.body.index
            const newstatus = req.body.newstatus
            const updateDoc = {
                $set: {
                    [`summer.${index}.status`]:newstatus
                },
            };
            const result = await menu.updateOne(filter, updateDoc, options)
            return res.send(result)
        }
        catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    }
    Unummermenustatustomongo()
}

exports.resetwintermenu = (req, res)=>{
    async function resetwintertomongo() {
        try {
            const orderDB = client.db('orderDB')
            const menu = orderDB.collection('menu')
            const options = { upsert: true };
            const filter = { "id": mtlID }
            const updateDoc = {
                $set: {
                    winter: req.body.winter
                },
            };
            const result = await menu.updateOne(filter, updateDoc, options)
            return res.send(result)
        }
        catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    }
    resetwintertomongo()
}

exports.updatewintermenu = (req, res)=>{
    async function Uwintermenustatustomongo() {
        try {
            const orderDB = client.db('orderDB')
            const menu = orderDB.collection('menu')
            const options = { upsert: true };
            const filter = { "id": mtlID }
            const index = req.body.index
            const newstatus = req.body.newstatus
            const updateDoc = {
                $set: {
                    [`winter.${index}.status`]:newstatus
                },
            };
            const result = await menu.updateOne(filter, updateDoc, options)
            return res.send(result)
        }
        catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    }
    Uwintermenustatustomongo()
}