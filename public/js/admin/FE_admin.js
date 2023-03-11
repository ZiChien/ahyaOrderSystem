/////safari工具列
function safariHacks() {
    let windowsVH = window.innerHeight / 100;
    document.querySelector('.wrap').style.setProperty('--vh', windowsVH + 'px');
}
window.addEventListener('resize', () => {
    let windowsVH = window.innerHeight / 100;
    document.querySelector('.wrap').style.setProperty('--vh', windowsVH + 'px');
}, false);
safariHacks();
////////////////////
const { createApp, onMounted, reactive, ref, computed } = Vue
let orderlist = {
    data: []//所有未完成訂單原始資料
}
const orderdata = reactive({
    data: [],//v-for render data 當前要渲染的訂單list
});
const orderDetail = reactive({
    order: '',//focus order info
})
let historydata = {
    data: []//已完成訂單原始資料
}
const mtls = reactive({
    data: []//v-for render 配料
})
const summermenu = reactive({
    data: []//v-for render summer series
})
const wintermenu = reactive({
    data: []//v-for render winter series
})

const order = createApp({
    setup() {
        function logout(){
            axios.post('admin/api.logout') 
                .then(()=>{
                    location.replace('/admin/login')
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
        function updateorder() {
            axios.get('/admin/api.getorder')
                .then((res) => {
                    if (res.data.hasNew) {
                        orderlist.data = res.data.result
                        isshowConfirm.value = true
                        return
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        setInterval(() => {
            updateorder()
        }, 5000)
        function getorder() {//初始order原始資料
            axios.get('/admin/api.getorder')
                .then((res) => {
                    orderlist.data = res.data.result
                    changeorderdata(lastfilterpage + 1)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        function getmtl() {
            axios.get('/admin/api.getmtl')
                .then((res) => {
                    mtls.data = res.data.mtl
                    summermenu.data = res.data.summer
                    wintermenu.data = res.data.winter
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        getmtl()
        onMounted(() => {
            getorder()
            gethistoryorder()
        })

        const currentpage = ref('訂單')
        const isshow = reactive([
            {
                pagename: '訂單',
                isshow: true
            },
            {
                pagename: '菜單',
                isshow: false
            },
            {
                pagename: '店家資訊',
                isshow: false
            },
        ])
        const changepage = function (page) {
            isshow.forEach((value, index) => {
                if (index == page) {
                    isshow[index].isshow = true
                    currentpage.value = isshow[index].pagename

                } else {
                    isshow[index].isshow = false
                }
            });
        }

        //////////////////////////////////////////////////
        const isshowmaxmodal = ref(false)
        const showmaxmodal = function () {
            isshowmaxmodal.value = true
        }
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
        const currentmax = reactive({
            optionname: maxoption[0].optionname,
            val: maxoption[0].val,
            index: 0
        })

        window.addEventListener('click', (e) => {
            if (e.target.id !== 'slmaxday') {
                isshowmaxmodal.value = false
            }
        })

        let date30 = reactive({
            date: []
        });
        function getdatefromapi() {
            axios.get('/admin/api.getdate')
                .then((res) => {
                    date30.date = res.data.date
                    currentmax.val = maxoption[res.data.maxdayindex].val
                    currentmax.optionname = maxoption[res.data.maxdayindex].optionname
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        getdatefromapi()
        const filterdate = computed(() => {
            const temp = date30.date.filter((value, index) => {
                return index < currentmax.val
            })
            return temp
        })
        const Cselectmax = function (index) {
            currentmax.optionname = maxoption[index].optionname
            currentmax.val = maxoption[index].val
            currentmax.index = index
        }
        const week = ['天', '一', '二', '三', '四', '五', '六']
        function getMonthDate(momentdate) {
            const newmoment = moment(momentdate).tz('Asia/Taipei')
            let year = newmoment.year()
            let month = newmoment.month()
            let date = newmoment.date()
            let day = newmoment.day()
            return `${month + 1}/${date}(${week[day]})`
        }
        const Cenabledate = function (index) {
            date30.date[index].enable = !date30.date[index].enable
        }
        // function initdate30() {
        //     for (i = 0; i < 30; i++) {
        //         date30.date.push({
        //             date: moment().tz('Asia/Taipei').add(i, 'd'),
        //             enable: true,
        //         })
        //     }
        // }
        // initdate30()
        const isupdating = ref(false)
        const updatedate = function () {
            isupdating.value = true;
            axios.put('/admin/api.updatedate', {
                result: date30.date,
                maxdayindex: currentmax.index
            })
                .then((res) => {
                    isupdating.value = false
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        /////////////////////////////////////
        const timeconfig = reactive({
            hour: [],
            min: []
        })

        const starttime = reactive({
            starthour: '12',
            startmin: '00',
            isshowhourmodal: false,
            isshowminmodal: false,
        })
        const endtime = reactive({
            endhour: '12',
            endmin: '00',
            isshowhourmodal: false,
            isshowminmodal: false,
        })
        const gettimefromapi = function () {
            axios.get('/admin/api.gettime')
                .then((res) => {
                    starttime.starthour = moment(res.data.starttime._d).tz('Asia/Taipei').hour()
                    if (starttime.starthour < 10)
                        starttime.starthour = `0${starttime.starthour}`
                    starttime.startmin = moment(res.data.starttime._d).tz('Asia/Taipei').minute()
                    if (starttime.startmin < 10)
                        starttime.startmin = `0${starttime.startmin}`
                    endtime.endhour = moment(res.data.endtime._d).tz('Asia/Taipei').hour()
                    if (endtime.endhour < 10)
                        endtime.endhour = `0${endtime.endhour}`
                    endtime.endmin = moment(res.data.endtime._d).tz('Asia/Taipei').minute()
                    if (endtime.endmin < 10)
                        endtime.endmin = `0${endtime.endmin}`
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        gettimefromapi()
        const updatetimebtn = function () {
            axios.put('/admin/api.updatetime', {
                starttime: [starttime.starthour, starttime.startmin],
                endtime: [endtime.endhour, endtime.endmin]
            })
                .then((res) => {

                })
                .catch((err) => {
                    console.log(err);
                })
        }
        function inittimeoption() {
            for (i = 0; i < 24; i++) {
                if (i < 10) {
                    timeconfig.hour.push(`0${i}`)
                } else {
                    timeconfig.hour.push(i)
                }
            }
            for (i = 0; i < 60; i += 10) {
                if (i < 10) {
                    timeconfig.min.push(`0${i}`)
                } else {
                    timeconfig.min.push(i)
                }
            }
        }
        inittimeoption()
        const showtimemodal = function () {
            starttime.isshowhourmodal = true
        }
        const showstartminmodal = function () {
            starttime.isshowminmodal = true
        }
        window.addEventListener('click', (e) => {
            if (e.target.id != 'starthour') {
                starttime.isshowhourmodal = false
            }
            if (e.target.id != 'startmin') {
                starttime.isshowminmodal = false
            }
            if (e.target.id != 'endhour') {
                endtime.isshowhourmodal = false
            }
            if (e.target.id != 'endmin') {
                endtime.isshowminmodal = false
            }
        })
        const Cselecthour = function (index) {
            starttime.starthour = timeconfig.hour[index]
        }
        const Cselectmin = function (index) {
            starttime.startmin = timeconfig.min[index]
        }

        const showendhour = function () {
            endtime.isshowhourmodal = true
        }
        const showendmin = function () {
            endtime.isshowminmodal = true
        }
        const Cselectendhour = function (index) {
            endtime.endhour = timeconfig.hour[index]
        }
        const Cselectendmin = function (index) {
            endtime.endmin = timeconfig.min[index]
        }

        const shopinfo = reactive({
            name: '奧野豆花',
            address: '桃園市中壢區成章二街506號'
        })
        function getinfo() {
            axios.get('/admin/api.getinfo')
                .then((res) => {
                    shopinfo.name = res.data.name
                    shopinfo.address = res.data.address
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        getinfo()
        function updateinfo() {
            axios.put('/admin/api.updateinfo', {
                data: {
                    name: shopinfo.name,
                    address: shopinfo.address
                }
            })
                .then(() => {

                })
                .catch((err) => {
                    console.log(err);
                })
        }

        //////////////////////////////////////////////////
        let lastfilterpage = 1
        const orderlistpage = reactive([
            {
                status: '未完成',
                isfocus: false
            },
            {
                status: '今日',
                isfocus: false
            },
            {
                status: '已完成',
                isfocus: false
            }
        ])
        const changeorderdata = function (index) {//切換訂單篩選
            orderlistpage[lastfilterpage].isfocus = false
            orderlistpage[index - 1].isfocus = true
            lastfilterpage = index - 1

            if (index == 1) {
                focusindex = 0;
                orderdata.data = JSON.parse(JSON.stringify(orderlist.data))//複製一份原始order訂單資料
                orderDetail.order = ''
                if (!orderdata.data.length) {
                    return
                }
                Cfocusorder(0)
            } else if (index == 2) {
                focusindex = 0;
                orderDetail.order = ''

                filterorderlist()
                if (!orderdata.data.length) {
                    return
                }
                Cfocusorder(0)

            }
            else if (index == 3) {
                orderDetail.order = ''

                focusindex = 0;
                if (historydata.data == '') {
                    orderdata.data = []
                    return
                }

                orderdata.data = JSON.parse(JSON.stringify(historydata.data))
                Cfocusorder(0)
            }
        }
        const checkready = function (orderid) {
            axios.put('/admin/api.updatestatus', {
                orderID: orderid,
            })
                .then((res) => {
                    getorder()
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        const checktake = function (orderid) {
            axios.put('/admin/api.updatetake', {
                orderID: orderid,
            })
                .then((res) => {
                    getorder()
                    gethistoryorder()
                })
                .catch((err) => {
                    console.log(err);
                })
        }

        //////////////////////////////////////////////////////////////////////////////////
        const onsupplybtn = function (index) {
            if (mtls.data[index].onsupply) {
                return
            }
            mtls.data[index].onsupply = true
            mtls.data[index].soldout = false
            mtls.data[index].notsupply = false
            apistart()
            axios.put('/admin/api.updatemtlstatus', {
                index: index,
                mtl: mtls.data[index]
            })
                .then(() => {
                    apiend()
                })
        }
        const soldoutbtn = function (index) {
            if (mtls.data[index].soldout) {
                return
            }
            mtls.data[index].onsupply = false
            mtls.data[index].soldout = true
            mtls.data[index].notsupply = false
            apistart()
            axios.put('/admin/api.updatemtlstatus', {
                index: index,
                mtl: mtls.data[index]
            })
                .then(() => {
                    apiend()
                })
        }
        const notsupplybtn = function (index) {
            if (mtls.data[index].notsupply) {
                return
            }
            mtls.data[index].onsupply = false
            mtls.data[index].soldout = false
            mtls.data[index].notsupply = true
            apistart()
            axios.put('/admin/api.updatemtlstatus', {
                index: index,
                mtl: mtls.data[index]
            })
                .then(() => {
                    apiend()
                })
        }
        const menufilter = reactive(
            [true, false, false]
        )
        let lastmenufilter = 0
        const changemenufilter = function (index) {
            menufilter[lastmenufilter] = false
            menufilter[index] = true
            lastmenufilter = index
        }

        const summeronsupplybtn = function (index, statusindex) {
            if (summermenu.data[index].status[statusindex]) {
                return
            }
            summermenu.data[index].status.forEach((ele, i) => {
                if (statusindex == i) {
                    summermenu.data[index].status[i] = true
                } else {
                    summermenu.data[index].status[i] = false
                }
            })
            apistart()
            axios.put('/admin/api.updatesummermenu', {
                index: index,
                newstatus: summermenu.data[index].status
            })
                .then(() => {
                    apiend()
                })
        }
        const winteronsupplybtn = function (index, statusindex) {
            if (wintermenu.data[index].status[statusindex]) {
                return
            }
            wintermenu.data[index].status.forEach((ele, i) => {
                if (statusindex == i) {
                    wintermenu.data[index].status[i] = true
                } else {
                    wintermenu.data[index].status[i] = false
                }
            })
            apistart()
            axios.put('/admin/api.updatewintermenu', {
                index: index,
                newstatus: wintermenu.data[index].status
            })
                .then(() => {
                    apiend()
                })
        }
        const isshowConfirm = ref(false)
        const clickoffConfirm = function () {
            axios.put('admin/api.gotneworder')
            changeorderdata(1)
            isshowConfirm.value = false
        }
        return {
            logout,
            isshow, currentpage, changepage, orderdata, currentmax,
            orderDetail, Cfocusorder,
            isshowmaxmodal, showmaxmodal, maxoption, Cselectmax,
            date30, Cenabledate, filterdate, getMonthDate, updatedate, isupdating,
            starttime, showtimemodal, timeconfig, Cselecthour, showstartminmodal, Cselectmin,
            endtime, showendhour, showendmin, Cselectendhour, Cselectendmin,
            updatetimebtn, shopinfo, updateinfo,
            dateformat, timeformat, sortdate, orderlist, changeorderdata, orderlistpage,
            checkready, checktake,
            mtls, onsupplybtn, soldoutbtn, notsupplybtn,
            menufilter, changemenufilter, summermenu, summeronsupplybtn,
            wintermenu, winteronsupplybtn,
            isshowConfirm, clickoffConfirm
        }
    }
}).mount('#app')


let focusindex = 0;
function Cfocusorder(index) {
    orderdata.data[focusindex].isfocus = false;
    orderDetail.order = orderdata.data[index];
    orderdata.data[index].isfocus = true;
    focusindex = index;

}
function sortdate(date, index) {
    if (index == 0) {
        return true
    }
    let temp = dateformat(date)
    let now = dateformat(orderdata.data[index - 1].taketime)
    if (temp == now) {
        return false
    }
    else {
        return true
    }
}
function dateformat(date) {
    if (date == undefined) {
        return
    }
    let temp = moment(date).tz('Asia/Taipei')
    return `${temp.month() + 1}/${temp.date()}`
}
function timeformat(time) {
    if (time == undefined) {
        return
    }
    let temp = moment(time).tz('Asia/Taipei')
    let min = temp.minute()
    if (temp.minute() < 10) {
        min = `0${min}`
    }
    return `${temp.hour()}:${min}`
}
function filterorderlist() {
    orderdata.data = [];
    if (!orderlist.data.length) {
        return
    }
    const today = moment().tz('Asia/Taipei')
    let todaylist = orderlist.data.filter((value) => {
        let eledate = value.taketime
        return dateformat(today.format()) == dateformat(eledate)
    })
    orderdata.data = JSON.parse(JSON.stringify(todaylist))

}
function gethistoryorder() {
    axios.get('admin/api.getHistoryOrder')
        .then((res) => {
            historydata.data = res.data
        })
        .catch((err) => {
            console.log(err);
        })
}
const waitapi = document.getElementById('waitapi')
function apistart() {
    waitapi.style.display = 'block'
}
function apiend() {
    waitapi.style.display = 'none'
}
