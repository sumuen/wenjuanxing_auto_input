// ==UserScript==
// @name         问卷星不再牛马地刷！！！
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  批量问卷星刷题，支持多种题型
// @author       yueji0j1anke
// @match        https://www.wjx.cn/*
// @icon         https://gitee.com/yuejinjianke/tuchuang/raw/master/image/image-20240212215352949.png
// @license      MIT
// @grant        none
// @homepageURL  https://github.com/jiankeguyue/wenjuanxing_nomorehouseandcow
// ==/UserScript==

(function () {
    'use strict';

    // --------------------------------初始化cookie-------------------------------------
    window.localStorage.clear()
    window.sessionStorage.clear()
    clearCookies()

    // 翻页并重定向逻辑
    const url = 'https://www.wjx.cn/vm/OAqGnVx.aspx'

    //转交到提交成功页面时跳回问卷页面
    if (window.location.href.indexOf('https://www.wjx.cn/wjx/join') !== -1) {
        setTimeout(() => {
            window.location.href = url
        }, 100)
    }

    window.scrollTo({
        top: document.body.scrollHeight, left: 0, behavior: 'smooth'
    })


    // --------------------------------网页逻辑-------------------------------------
    // 获取网页基本元素
    let questionList = document.getElementsByClassName('field ui-field-contain')
    let clickList = []
    for (let i = 0; i < questionList.length; i++) {
        clickList.push(questionList[i].children[1])
    }



    // --------------------------------回答逻辑-------------------------------------
    // 定义回答列表
    let answerList = [
        { id: 1, type: '单选', ratio: [30, 70] },
        { id: 2, type: '单选', ratio: [10, 70, 10, 10] },
        { id: 3, type: '单选', ratio: [100, 0] },
        { id: 4, type: '多选', ratio: [60, 30, 50, 10] },
        { id: 5, type: '单选', ratio: [20, 60, 20, 0] },
        { id: 6, type: '多选', ratio: [30, 40, 20, 70, 10] },
        { id: 7, type: '多选', ratio: [70, 50, 80, 40, 20] },
        { id: 8, type: '单选', ratio: [70, 20, 10, 0] },
        { id: 9, type: '单选', ratio: [60, 20, 10, 10] },
        { id: 10, type: '单选', ratio: [30, 70] },
        { id: 11, type: '多选', ratio: [70, 40, 70, 20, 60, 30] },
        { id: 12, type: '单选', ratio: [20, 20, 50, 5, 5] },
        { id: 13, type: '多选', ratio: [70, 10, 20, 10, 30] },
        { id: 14, type: '单选', ratio: [0, 66, 34] },
        { id: 15, type: '单选', ratio: [60, 20, 10, 10] },
    ]

    // 问卷答题逻辑
    for (let i = 0; i < clickList.length; i++) {
        setTimeout(function () {
            console.log('第' + (i + 1) + '题')
            let type = answerList[i].type
            switch (type) {
                case '单选': {
                    clickList[i].children[single(answerList[i].ratio)].click()
                    break
                }
                case '多选': {
                    let chosenIndexes = multi(answerList[i].ratio);
                    for (let j = 0; j < chosenIndexes.length; j++) {
                        clickList[i].children[chosenIndexes[j]].click();
                    }
                    break;
                }
                default: {
                    break
                }
            }
        }, i * 100); // 每个问题间隔0.1秒
    }


    // --------------------------------问题逻辑-------------------------------------

    // 单选题逻辑
    function single(ratio) {
        // 生成一个随机数
        console.log(ratio)
        let randomNum = getRandom()
        // 遍历概率分布数组，找到符合随机数的选项索引
        return isInRange(ratio, randomNum)
    }

    // 多选题逻辑
    function multi(ratio) {
        let chosenIndexes = [];
        for (let i = 0; i < ratio.length; i++) {
            // 按照概率决定是否选中这个选项
            if (Math.random() < ratio[i] / 100) {
                chosenIndexes.push(i);
            }
        }
        // 如果没有选项被选中，随机选择一个
        if (chosenIndexes.length === 0) {
            chosenIndexes.push(Math.floor(Math.random() * ratio.length));
        }
        return chosenIndexes;
    }

    // --------------------------------提交逻辑-------------------------------------
    // 提交并滑动验证
    setTimeout(() => {
        console.log('navigator:', window.navigator)
        document.getElementById('ctlNext').click()
        setTimeout(() => {
            document.getElementById('SM_BTN_1').click()
            setTimeout(() => {
                slidingSlider();
            }, 3000)
        }, 1000)
    }, clickList.length * 100 + 1000)

    function slidingSlider() {
        const slider = document.querySelector("#nc_1_n1z");
        const startX = slider.getBoundingClientRect().left + window.pageXOffset;
        const startY = slider.getBoundingClientRect().top + window.pageYOffset;
        const endX = startX + 270;
        const endY = startY;
        const options = { bubbles: true, cancelable: true };
        slider.dispatchEvent(new MouseEvent('mousedown', options));
        slider.dispatchEvent(new MouseEvent('mousemove', Object.assign(options, { clientX: startX, clientY: startY })));
        slider.dispatchEvent(new MouseEvent('mousemove', Object.assign(options, { clientX: endX, clientY: endY })));
        slider.dispatchEvent(new MouseEvent('mouseup', options));
        setTimeout(() => {
            // 出现哎呀出错啦，点击刷新再来一次错误 需要重新点击
            var nc_1_refresh1_reject = document.getElementById('nc_1_refresh1')
            if (nc_1_refresh1_reject !== 'undefined' || nc_1_refresh1_reject !== null) {
                nc_1_refresh1_reject.click()
                setTimeout(() => {
                    slidingSlider()
                }, 1000)
            }
        }, 1000)
    }



    // --------------------------------辅助函数-------------------------------------

    // 生成一个1-100之内的随机数
    function getRandom() {
        return Math.floor(Math.random() * 100) + 1
    }

    // 判断是否在概率区间内
    function isInRange(ratio, randomNum) {
        console.log("判断概率")
        console.log("ratio:", ratio)
        let sum = 0
        for (let i = 0; i < ratio.length; i++) {
            sum += ratio[i]
            if (randomNum < sum) {
                return i
            }
        }
    }

    // 把所有的cookie都变过期
    function clearCookies() {
        document.cookie.split(';').forEach(cookie => {
            const [name, ...parts] = cookie.split(/=(.*)/);
            const value = parts.join('=');
            const decodedName = decodeURIComponent(name.trim());
            const decodedValue = decodeURIComponent(value.trim());
            document.cookie = `${decodedName}=${decodedValue}; expires=Thu, 01 Jan 1949 00:00:00 UTC;`;
        });
    }


})();