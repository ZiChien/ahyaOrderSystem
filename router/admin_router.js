const express = require('express')
const router = express.Router()
const auth = require('../controller/auth/api.auth.js')
const orderConfirm = require('../controller/order/api.orderConfirm.js')
const getorder = require('../controller/order/api.getorder')
const updatedate = require('../controller/order/api.updatedate')
const updatestatus = require('../controller/order/api.orderstatus')
const menu = require('../controller/order/api.menu')
const neworder = require('../controller/new')
router.get('/login',(req, res)=>{
    return res.render('./admin/login')
})
router.get('/logout',auth.logout)
router.post('/api.auth',auth.auth)

router.get('/',auth.authLogin,(req, res)=>{
    return res.render('./admin/admin')
})
router.post('/api.logout',auth.logout)
router.post('/api.orderconfirm',orderConfirm.addorder)
router.get('/api.getorder',getorder.getorder)
router.put('/api.updatedate',updatedate.updatedate)
router.get('/api.getdate',updatedate.getdate)

router.put('/api.updateinfo',updatedate.updateinfo)
router.get('/api.getinfo',updatedate.getinfo)
router.put('/api.updatetime',updatedate.updatetime)
router.get('/api.gettime',updatedate.gettime)

router.put('/api.updatestatus',updatestatus.updatestatus)
router.put('/api.updatetake',updatestatus.updatetake)
router.get('/api.getHistoryOrder',getorder.get_history)

router.get('/api.getmtl',menu.getmtl)
router.put('/api.resetmtl',menu.resetmtl)
router.put('/api.updatemtlstatus',menu.updatemtlstatus)

router.put('/api.resetmenuSummer',menu.resetmenuSummer)
router.put('/api.updatesummermenu',menu.updatesummermenu)

router.put('/api.resetwintermenu',menu.resetwintermenu)
router.put('/api.updatewintermenu',menu.updatewintermenu)

router.put('/api.gotneworder',neworder.gotNeworder)
module.exports = router;