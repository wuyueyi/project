//封装ajax
function ajax(url) {
    var xhr = new XMLHttpRequest()
    return new Promise(function (resolve, reject) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText)
                } else {
                    reject(xhr.status)
                }
            }
        }
        xhr.open('get', url)
        xhr.send()
    })
}
//加载数据
window.onload = async function () {
    let data = await ajax('https://edu.telking.com/api/?type=month')
    let { data: monthData } = JSON.parse(data)
    //线性图
    var lineChart = echarts.init(document.getElementById('line-echart'))
    var option = {
        title: {
            show: true,
            text: '曲线图数据展示',
            left: 'center',
            padding: 10,
        },
        xAxis: {
            type: 'category',
            data: monthData.xAxis,

            axisLine: {
                show: false,
            },
            axisTick: {
                //y轴刻度线
                show: false,
            },
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                },
            },
        },
        series: [
            {
                data: monthData.series,
                type: 'line',
                color: '#4486ef',
                smooth: true,
                areaStyle: {
                    color: '#f3f7fe',
                },
                label: {
                    show: true,
                    color: '#4587f0',
                },
            },
        ],
    }
    lineChart.setOption(option)
    //饼状图
    let weekData = await ajax('https://edu.telking.com/api/?type=week')
    let { data: pieData } = JSON.parse(weekData)
    let pieList = []
    for (let i = 0; i < pieData.series.length; i++) {
        let value = pieData.series[i]
        let name = pieData.xAxis[i]
        pieList.push({ value, name })
    }
    var pieChart = echarts.init(document.getElementById('pie-echart'))
    var pieOption = {
        title: {
            text: '饼状图数据展示',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
        },
        series: [
            {
                type: 'pie',
                radius: '50%',
                data: pieList,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    }
    pieChart.setOption(pieOption)
    //柱状图
    var barChart = echarts.init(document.getElementById('bar-echart'))
    var barOption = {
        xAxis: {
            type: 'category',
            data: JSON.parse(weekData).data.xAxis,
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
        },
        yAxis: {
            type: 'value',
            name: '商品数',
        },
        series: [
            {
                data: JSON.parse(weekData).data.series,
                type: 'bar',
                barWidth: 20,
            },
        ],
    }
    barChart.setOption(barOption)
}

//滑块功能
let headerRight = document.getElementsByClassName('header-right')
let as = headerRight[0].getElementsByTagName('a')
let animation = headerRight[0].getElementsByClassName('animation')
for (let i = 0; i < as.length; i++) {
    as[i].addEventListener('mouseenter', function () {
        animation[0].className = 'animation start-' + this.innerHTML
    })
}

//轮播图
let banner = document.getElementsByClassName('banner')[0]
let bannerImg = document.getElementsByClassName('banner-img')[0]
let imgWidth = bannerImg.offsetWidth
//轮播图片
let liUl = bannerImg.children

//生成小方块
let jumpBtn = document.getElementsByClassName('jump-btn')[0].children[0]
for (let i = 0; i < liUl.length; i++) {
    let li = document.createElement('li')
    jumpBtn.appendChild(li)
}
//克隆第一张图片
bannerImg.appendChild(liUl[0].cloneNode(true))
//动态生成轮播长度
bannerImg.style.width = liUl.length * imgWidth + 'px'
let pic = 0
let liOl = jumpBtn.children
liOl[0].className = 'current'
for (let i = 0; i < liOl.length; i++) {
    liOl[i].index = i
    liOl[i].onclick = function () {
        if (pic == liUl.length - 1) {
            bannerImg.style.left = 0 + 'px'
        }
        for (let j = 0; j < liOl.length; j++) {
            liOl[j].className = ''
        }
        this.className = 'current'
        let target = -this.index * imgWidth
        animate(bannerImg, target)
        pic = this.index
    }
}
let arrLeft = document.getElementById('left')
arrLeft.onclick = function () {
    if (pic == 0) {
        //让图片变成假图
        bannerImg.style.left = -imgWidth * (liUl.length - 1) + 'px'
        pic = liOl.length
    }
    pic--
    animate(bannerImg, -pic * imgWidth)
    for (let i = 0; i < liOl.length; i++) {
        liOl[i].className = ''
    }
    liOl[pic].className = 'current'
}
let arrRight = document.getElementById('right')
arrRight.onclick = function () {
    if (pic == liOl.length) {
        bannerImg.style.left = 0 + 'px'
        pic = 0
    }
    pic++
    animate(bannerImg, -pic * imgWidth)
    for (let i = 0; i < liOl.length; i++) {
        liOl[i].className = ''
    }
    if (pic == liOl.length) {
        liOl[0].className = 'current'
    } else {
        liOl[pic].className = 'current'
    }
}
function animate(tag, target) {
    clearInterval(tag.timer)
    tag.timer = setInterval(function () {
        // 取值时，会进行四舍五入
        var leader = tag.offsetLeft
        // var step = 10;//步长是固定值，导致运动是匀速效果
        // 缓动公式： （目标位置 - 当前位置）/10
        var step = (target - leader) / 10
        // 对step进行取整操作
        step = step > 0 ? Math.ceil(step) : Math.floor(step)
        leader = leader + step
        tag.style.left = leader + 'px'
        // 尽管盒子会在到达位置时停住但是我们还要清除定时器
        if (leader == target) {
            clearInterval(tag.timer)
        }
    }, 20)
}
let timer = null
timer = setInterval(function () {
    arrRight.click()
}, 2000)
//鼠标经过停止
banner.onmouseover = function () {
    clearInterval(timer)
}
banner.onmouseout = function () {
    timer = setInterval(function () {
        arrRight.click()
    }, 2000)
}
