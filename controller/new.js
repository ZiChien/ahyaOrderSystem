let newOrder = {
    hasNew:false,
    newID:''
}
function gotNeworder(req, res){
    newOrder.hasNew = false
    newOrder.newID = ''
    return res.send("got");
}
module.exports = {newOrder,gotNeworder}