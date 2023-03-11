const express = require('express')
const router = express.Router()

const line = require('@line/bot-sdk');
const linebot = require('../linebot')
router.post('/', line.middleware(linebot.lineConfig),linebot.repeat)

module.exports = router;