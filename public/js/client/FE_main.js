const { createApp, onMounted, reactive, ref, computed } = Vue
const clientInfo = reactive({
    name: '',
    phone: '',
    userId: '',
    isLine: false,
})
// liff
liff.init({
    liffId: "1657825142-4mglkJPR",

}).then(() => {
    if (liff.isInClient()) {
        clientInfo.isLine = true
    } else {
        clientInfo.isLine = false
    }
    if (liff.isLoggedIn()) {
        liff.getProfile()
            .then((profile) => {
                clientInfo.name = profile.displayName
                clientInfo.userId = profile.userId
            })
            .catch((err) => {
                console.log("error", err);
            });
    }
})
    .catch((err) => {
        console.log(err.code, err.message);
    });
//
const waitapi = document.getElementById('waitapi')
function apistart() {
    waitapi.style.display = 'block'
}
function apiend() {
    waitapi.style.display = 'none'
}
const isshowapp = ref(true)
const isshowcart = ref(false)
const isshoworder = ref(false)
const isshowresult = ref(false)
const note = ref('')
const store = reactive({
    name: '奧野豆花',
    address: '桃園市中壢區成章二街506號'
})
const takeNumber = ref(0)
const cart = reactive([])
const counttotal = computed(() => {
    let total = 0;
    cart.forEach((item) => {
        total += item.price
    })
    return total;
})
const totalnumber = computed(() => {
    let totalnumber = 0
    cart.forEach((item) => {
        totalnumber += item.number
    })
    return totalnumber
})
const mtls = reactive({ testmtls: [] })
const bonusmtls = reactive({ bonustestmtls: [] })
const menu = reactive([
    {
        series: '夏天系列',
        menucontent: []
    },
    {
        series: '冬天系列',
        menucontent: []
    },
])
const getmenu = function () {

    return new Promise((resolve, reject) => {
        axios.get('/admin/api.getmtl')
            .then((res) => {
                if (moment(taketime.date).date() == moment().tz('Asia/Taipei').date()) {
                    menu[0].menucontent = res.data.summer.filter((value) => {
                        return value.status[0]
                    })
                    menu[1].menucontent = res.data.winter.filter((value) => {
                        return value.status[0]
                    })
                    const ormtls = res.data.mtl.filter((value) => {
                        return value.onsupply
                    })
                    mtls.testmtls = JSON.parse(JSON.stringify(ormtls))
                    bonusmtls.bonustestmtls = JSON.parse(JSON.stringify(ormtls))
                } else {
                    menu[0].menucontent = res.data.summer.filter((value) => {
                        return value.status[0] || value.status[1]
                    })
                    menu[1].menucontent = res.data.winter.filter((value) => {
                        return value.status[0] || value.status[1]
                    })
                    const ormtls = res.data.mtl.filter((value) => {
                        return value.onsupply || value.soldout
                    })
                    mtls.testmtls = JSON.parse(JSON.stringify(ormtls))
                    bonusmtls.bonustestmtls = JSON.parse(JSON.stringify(ormtls))
                }
                resolve()
            })
            .catch((err) => {
                console.log(err);
                reject(err)
            })

    })
}
//datepicker
const dateconfig = reactive({
    date: []
})
const maxoption = reactive([
    {
        optionname: '當日',
        val: 1
    },
    {
        optionname: '7日',
        val: 7
    },
    {
        optionname: '30日',
        val: 30
    },
])
async function getdatefromapi() {
    apistart()
    await axios.get('/admin/api.getdate')
        .then((res) => {
            const date = res.data.date
            for (i = 0; i < maxoption[res.data.maxdayindex].val; i++) {
                dateconfig.date.push(date[i])
            }
            for (i = 0; i < dateconfig.date.length; i++) {
                if (dateconfig.date[i].enable) {
                    taketime.date = dateconfig.date[i].date
                    break
                }
            }

            gettimefromapi()
        })
        .catch((err) => {
            console.log(err);
        })
    await getmenu()
    apiend()
}
const delayMinutes = 10
function beforenow(time) {
    let now = moment().tz('Asia/Taipei');
    now.add(delayMinutes, 'm')
    let nowtotal = now.hour() * 60 + now.minute()
    let option = moment(time).tz('Asia/Taipei');
    let optiontotal = option.hour() * 60 + option.minute()
    return nowtotal < optiontotal ? false : true
}
function getinfo() {
    axios.get('/admin/api.getinfo')
        .then((res) => {
            store.name = res.data.name
            store.address = res.data.address
        })
        .catch((err) => {
            console.log(err);
        })
}
getinfo()
async function gettimefromapi() {
    apistart()
    await axios.get('/admin/api.gettime')
        .then((res) => {

            timeconfig.time = []
            let availabletime = res.data.availabletime
            if (moment(taketime.date).tz('Asia/Taipei').date() == moment().tz('Asia/Taipei').date()) {
                for (i = 0; i < availabletime.length; i++) {
                    if (beforenow(availabletime[i])) {
                        continue;
                    } else {
                        timeconfig.time.push(availabletime[i])
                    }
                }
            } else {
                timeconfig.time = availabletime
            }

            taketime.time = timeconfig.time[0]
        })
        .catch((err) => {
            console.log(err);
        })
    apiend()
}
getdatefromapi()
const week = ['日', '一', '二', '三', '四', '五', '六']
function yearformat(date) {
    const temp = moment(date).tz('Asia/Taipei')
    return `${temp.year()}`
}
function dateformat(date) {
    if (date == undefined) {
        return '已打烊'
    }
    const temp = moment(date).tz('Asia/Taipei')
    return `${temp.month() + 1}/${temp.date()}(${week[temp.day()]})`
}
function timeformat(time) {
    if (time == undefined) {
        return '已打烊'
    }
    const temp = moment(time).tz('Asia/Taipei')
    let min = temp.minute()
    if (min < 10) min = `0${min}`
    return `${temp.hour()}:${min}`
}
const taketime = reactive({
    date: '',
    time: ''
})
const formattaketime = computed(() => {
    if(taketime.time==='' || taketime.date === ''){
        return
    }
    let year = moment(taketime.date).tz('Asia/Taipei').year()
    let month = moment(taketime.date).tz('Asia/Taipei').month() + 1
    if (month < 10) month = `0${month}`
    let date = moment(taketime.date).tz('Asia/Taipei').date()
    if (date < 10) date = `0${date}`
    let hour = moment(taketime.time).tz('Asia/Taipei').hour()
    if (hour < 10) hour = `0${hour}`
    let min = moment(taketime.time).tz('Asia/Taipei').minute()
    if (min < 10) min = `0${min}`
    return moment(`${year}-${month}-${date} ${hour}:${min}`).tz('Asia/Taipei').format()
})
const isdateopen = ref(false)
const opendate = function () {
    isdateopen.value = !isdateopen.value
}
window.addEventListener('click', (e) => {
    if (e.target.id !== 'date' && e.target.id !== 'datepickerarea') {
        isdateopen.value = false
    }
    if (e.target.id !== 'time' && e.target.id !== 'timepickerarea') {
        istimeopen.value = false
    }
})
const selectdate = function (date, enable) {
    if (!enable) return
    if (date == taketime.date) return
    if (!cart.length) {
        taketime.date = date;
        isdateopen.value = false
        gettimefromapi()
        getmenu()
    } else {
        openemptycart()
        tempselectdate = date
    }
}
let tempselectdate;
const confirmselectdate = function () {
    taketime.date = tempselectdate;
    isdateopen.value = false
    isemptycart.value = false
    cart.length = 0
    gettimefromapi()
    getmenu()

}
const datepicker = {
    dateconfig: dateconfig,
    taketime: taketime,
    isdateopen: isdateopen,
    selectdate: selectdate,
    opendate: opendate,
    dateformat: dateformat
}
//timepicker
const timeconfig = reactive({
    time: []
})
const istimeopen = ref(false)
const opentime = function () {
    istimeopen.value = !istimeopen.value
}
const selecttime = function (time) {
    taketime.time = time;
    istimeopen.value = false
}
const timepicker = {
    timeconfig: timeconfig,
    taketime: taketime,
    istimeopen: istimeopen,
    selecttime: selecttime,
    opentime: opentime,
    timeformat: timeformat
}
const isemptycart = ref(false)
const openemptycart = function () {
    isemptycart.value = !isemptycart.value
}


//*
const app = createApp({
    setup() {

        //menu

        const menuitems = [
            {
                itemname: '手工豆花',
                itemid: 0,
                iteminfo: '可任選三種料',
                itemprice: 50,
                itemimg: 'img/item1.jpeg',
            },
            {
                itemname: '手工冰沙豆花',
                itemid: 1,
                iteminfo: '可任選三種料',
                itemprice: 50,
                itemimg: 'img/item1.jpeg',

            },
            {
                itemname: '仙草凍',
                itemid: 2,
                iteminfo: '可任選三種料',
                itemprice: 50,
                itemimg: 'img/item1.jpeg',
            },
        ]
        // modal
        /**
        * modalshow is control whether to show modal
        * modalitem is curent modal's information
        * openmodal is click function which search by itemid to initial modalitem 
        * cancel is function to close modal and reset modalitem
        * clickclose is click function to close modal by click on outside modal
        */
        let modalitem = reactive({
            itemname: '',
            itemid: '',
            iteminfo: '',
            itemprice: '',
            itemimg: '',
        });
        const modalshow = ref(false)
        const openmodal = function (item) {

            modalitem.itemname = item.itemname
            modalitem.itemid = item.itemid
            modalitem.iteminfo = item.iteminfo
            modalitem.itemprice = item.itemprice
            modalitem.itemimg = item.itemimg
            modalshow.value = true
        }
        const cancel = function () {
            mtls.testmtls.forEach((mtl) => {
                mtl.selected = false;
            })
            bonusmtls.bonustestmtls.forEach((mtl) => {
                mtl.selected = false;
            })
            selected._value = ''
            bonusselected._value = ''
            number.value = 1
            bonusnumber.value = 0;

            modalshow.value = false
        }
        const clickclose = function () {
            window.addEventListener('click', (e) => {
                if (e.target.id == 'ya-modal') {
                    cancel();
                }
            })
        }
        //mtls select
        /**
         * mtls is basic materials based on testmtls 
         * bonusmtls is bonus materials based on bonustestmtls
         * selected is user choose materials which change when mtls[].selected change
         * mtlselect is click function to controls mtls[].selected
         */
        let testmtls =
            [
                {
                    name: '紅豆',
                    id: '001',
                    selected: false,
                },
                {
                    name: '綠豆',
                    id: '002',
                    selected: false,
                },
                {
                    name: '花生',
                    id: '003',
                    selected: false,
                },
                {
                    name: '小麥',
                    id: '004',
                    selected: false,
                },
                {
                    name: '粉圓',
                    id: '005',
                    selected: false,
                },
                {
                    name: '芋圓',
                    id: '006',
                    selected: false,
                },
                {
                    name: '粉粿',
                    id: '007',
                    selected: false,
                },
            ]
        let bonustestmtls =
            [
                {
                    name: '紅豆',
                    id: 'redbean',
                    selected: false,
                },
                {
                    name: '綠豆',
                    id: 'greenbean',
                    selected: false,
                },
                {
                    name: '花生',
                    id: 'pinuts',
                    selected: false,
                },
                {
                    name: '小麥',
                    id: 'barley',
                    selected: false,
                },
                {
                    name: '粉圓',
                    id: 'bubble',
                    selected: false,
                },
                {
                    name: '芋圓',
                    id: 'taroball',
                    selected: false,
                },
                {
                    name: '粉粿',
                    id: 'QQ',
                    selected: false,
                },
            ]
        const selected = computed(() => {
            if (!mtls.testmtls.length) {
                return
            }
            const newselected = mtls.testmtls.filter((element) => {
                return element.selected == true
            })
            return newselected
        })
        const mtlselect = function (index) {
            if (mtls.testmtls[index].selected == false && selected._value.length > 2) {
                return false
            };
            mtls.testmtls[index].selected = !mtls.testmtls[index].selected;
        }
        // bonus
        const isshowbonus = ref(false)
        const showbonus = function () {
            isshowbonus.value = !isshowbonus.value
        }
        const bonusnumber = ref(0);
        const bonusselected = computed(() => {
            if (!bonusmtls.bonustestmtls.length) {
                return
            }
            const newselected = bonusmtls.bonustestmtls.filter((element) => {
                return element.selected == true
            })
            bonusnumber.value = newselected.length;
            return newselected
        })
        const bonusmtlselect = function (index) {
            if (bonusmtls.bonustestmtls[index].selected == true) {
                bonusmtls.bonustestmtls[index].selected = false
                return
            }
            if (selected._value.length < 3) {
                alert('請先選擇三種料')
                return
            }
            if (bonusmtls.bonustestmtls[index].selected == false && bonusselected._value.length > 1) {
                return false
            };
            bonusmtls.bonustestmtls[index].selected = !bonusmtls.bonustestmtls[index].selected;
        }
        //number
        const number = ref(1)
        const addnumber = function () {
            number.value++;
        }
        const minusnumber = function () {
            if (number.value < 2) return false
            number.value--;
        }
        const price = computed(() => {
            return number.value * 50 + number.value * bonusnumber.value * 5
        })


        const addtocart = function () {
            if (selected._value.length < 1) {
                alert('請至少選擇一種料')
                return false
            } else if (selected._value.length < 3 && bonusselected._value.length > 0) {
                alert('請先選擇三種料後再進行加選')
                return false
            }
            cart.push({
                cartid: Date.now(),
                name: modalitem.itemname,
                number: number.value,
                mtls: selected._value,
                bonusmtls: bonusselected._value,
                price: price.value,
            })
            cancel();
        }
        const alertmsg = ref('')
        const alert = function (msg) {
            alertmsg.value = msg
            $('#modal-alert')
                .animate({
                    "top": "0px"
                }, {
                    queue: false,
                    duration: 300,
                    complete: function () {
                        $(this).delay(3000).animate({ top: '-34px' })
                    }
                })
        }
        const showcart = function () {
            isshowapp.value = false
            isshowcart.value = true
        }
        onMounted(() => {
            clickclose()
        })
        return {
            store,
            datepicker, timepicker,
            menuitems, menu,
            modalshow, openmodal, modalitem,
            mtls, mtlselect, selected,
            showbonus, isshowbonus, bonusmtls, bonusselected, bonusmtlselect,
            number, addnumber, minusnumber, price,
            cancel, addtocart, cart,
            alert, alertmsg,
            showcart, isshowapp,
            formattaketime,
            isemptycart, openemptycart, confirmselectdate
        }
    }
}).mount('#app')

const cartapp = createApp({
    setup() {
        const backtorder = function () {
            isshowapp.value = true;
            isshowcart.value = false;
            isshoworder.value = false;
        }
        const showapporder = function () {
            isshowcart.value = false
            isshoworder.value = true
        }
        const isshowcartcontent = ref(true)
        const showcartcontent = function () {
            isshowcartcontent.value = !isshowcartcontent.value
        }
        const addnumber = function (index) {
            cart[index].price += cart[index].price / cart[index].number
            cart[index].number++;

        }
        const minusnumber = function (index) {
            if (cart[index].number < 2) {
                cart.splice(index, 1)
                return
            }
            cart[index].price -= cart[index].price / cart[index].number
            cart[index].number--;
        }
        return {
            isshowcart, backtorder, showapporder,
            cart, counttotal, totalnumber,
            isshowcartcontent, showcartcontent,
            addnumber, minusnumber
        }
    }

}).mount('#appcart')

const orderapp = createApp({
    setup() {
        const backtorder = cartapp.backtorder
        const alertMsg = ref('')
        const alert = function (msg) {
            alertMsg.value = msg
            $('#modal-alert-order')
                .animate({
                    "top": "0px"
                }, {
                    queue: false,
                    duration: 300,
                    complete: function () {
                        $(this).delay(3000).animate({ top: '-34px' })
                    }
                })
        }
        const checksubmit = function () {
            if (cart.length < 1) {
                alert("還沒有商品加入購物車喔")
                return "cart_empty"
            }
            if (clientInfo.name == '') {
                alert("請填寫訂購人姓名")
                return "name_empty"
            }
            if (clientInfo.phone == '') {
                alert("請填寫訂購人電話")
                return "phone_empty"
            }
            if (taketime.date == undefined || taketime.time == undefined) {
                alert("請選擇取餐日期與時間")
                return "dateandtime_empty"
            }
            isShowConfirmModal.value = true
        }
        const isShowConfirmModal = ref(false)
        const ShowConfirmModal = function () {
            isShowConfirmModal.value = true;
        }
        const closemodal = function () {
            isShowConfirmModal.value = false;
        }
        window.addEventListener('click', (e) => {
            if (e.target.id == 'ya-modal-confirm') {
                isShowConfirmModal.value = false;
            }
        })
        const confirmbtn = function () {
            const orderuniID = Date.now()
            const order = {
                isLine: clientInfo.isLine,
                orderID: orderuniID,
                name: clientInfo.name,
                phone: clientInfo.phone,
                userId: clientInfo.userId,
                taketime: formattaketime._value,
                content: cart,
                number: totalnumber._value,
                note: note.value,
                total: counttotal._value,
            }
            apistart()
            axios.post('/admin/api.orderconfirm', {
                order: order
            }).then((res) => {
                takeNumber.value = res.data.takeNumber
                apiend()
                isShowConfirmModal.value = false
                isshoworder.value = false
                isshowresult.value = true
            }).catch((err) => {
                console.log(err);
            })
        }

        onMounted(() => {

        })
        return {
            store, counttotal, totalnumber,
            isshoworder, backtorder, isshowresult,
            datepicker, timepicker,
            clientInfo, note,
            alert, alertMsg, checksubmit,
            isShowConfirmModal, closemodal,
            confirmbtn,
            formattaketime,
            isemptycart, openemptycart, confirmselectdate
        }
    }
}).mount('#apporder')

const resultapp = createApp({
    setup() {
        const resulttaketime = ref('')

        return {
            isshowresult,
            yearformat, dateformat, timeformat, formattaketime,
            takeNumber
        }
    }
}).mount('#appresult')


