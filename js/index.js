//封装ajax
function ajax(url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(JSON.parse(xhr.responseText))
            }
        }
    }
    xhr.open('GET', url)
    xhr.send()
}
ajax('https://edu.telking.com/api/?type=month', function (data) {
    generateLineChart(data.data)
})
//线性图
function generateLineChart(lineData) {
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
            data: lineData.xAxis,

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
                data: lineData.series,
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
}
ajax('https://edu.telking.com/api/?type=week', function (data) {
    generatePieChart(data.data)
    generateBarChart(data.data)
})
//饼状图
function generatePieChart(pieData) {
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
}

//柱状图
function generateBarChart(barData) {
    var barChart = echarts.init(document.getElementById('bar-echart'))
    var barOption = {
        xAxis: {
            type: 'category',
            data: barData.xAxis,
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
                data: barData.series,
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
let animation = headerRight[0].getElementsByClassName('animation')[0]
for (let i = 0; i < as.length; i++) {
    as[i].addEventListener('mouseenter', function () {
        animation.className = 'animation start-' + this.innerHTML
    })
}

//轮播图
let banner = document.getElementsByClassName('banner')[0]
let bannerImg = document.getElementsByClassName('banner-img')[0]
let imgWidth = bannerImg.offsetWidth
let liUl = bannerImg.children

let jumpBtn = document.getElementsByClassName('jump-btn')[0].children[0]
for (let i = 0; i < liUl.length; i++) {
    let li = document.createElement('li')
    jumpBtn.appendChild(li)
}
bannerImg.appendChild(liUl[0].cloneNode(true))
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
        var leader = tag.offsetLeft
        var step = (target - leader) / 10
        step = step > 0 ? Math.ceil(step) : Math.floor(step)
        leader = leader + step
        tag.style.left = leader + 'px'
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
