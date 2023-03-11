const bcrypt = require('bcrypt')
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://chian:Et0w9VJUcToaesTh@ahya.hvgsfbn.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

function adduser() {
    const account = 'admin01';
    const password = 'admin01';
    let hashpassword = '';
    bcrypt.hash(password, 10).then((hash) => {
        hashpassword = hash
        add()
    })
    async function add() {
        try {
            if (hashpassword == '') return false
            const systemAdmin = client.db('systemAdmin');
            const adminUsers = systemAdmin.collection('adminUsers');

            const user = {
                account: account,
                password: hashpassword
            }
            const result = await adminUsers.insertOne(user);
        }
        catch (err) {
            console.log(err);
        }
        // finally {
        //     await client.close()
        // }
    }
}
// adduser()
async function authuser(account, password,req, res) {
    try {
        const systemAdmin = client.db('systemAdmin');
        const adminUsers = systemAdmin.collection('adminUsers');
        const query = { account: account }
        const user = await adminUsers.findOne(query)
        if(user==null)
            return res.status(200).send({auth:false})
        const match =  await bcrypt.compare(password,user.password)
        if(match){
            req.session.user = account
            return res.status(200).send({auth:true})
        }
        else{
            return res.status(400).send({auth:false})
        }
    }
    catch(err){
        console.log(err);
    }
    // finally{
    //     await client.close()
    // }
}
exports.authLogin = (req, res, next)=>{
    if(req.session.user){
        next()
    }else{
        return res.redirect('/admin/login')
    }
}
exports.logout = (req, res)=>{
    req.session.destroy(()=>{
        return res.send()
    })
}
exports.auth = (req, res) => {
    return authuser(req.body.account,req.body.password,req,res)
}