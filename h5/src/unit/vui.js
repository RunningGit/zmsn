'use strict';

const vui = {

  //处理设计稿尺寸及函数节流
  // @psdWidht    设计稿宽度,单位 px
  // @rate        节流频率, 单位 ms
  responsive: function (psdWidth, rate) {
    (function (d, c) {
      let t;
      let win = window;
      let psdW = psdWidth || 750;
      let rates = rate || 100;
      var e = d.documentElement,
        b = 'orientationchange' in window ? 'orientationchange' : 'resize';
      var a = function () {
        var winW = win.innerWidth;
        var maxW = psdW;
        e.style.fontSize = winW * 100 / maxW + 'px'
      };
      if (!d.addEventListener) {
        return
      }
      c.addEventListener(b, function () {
        clearTimeout(t)
        t = setTimeout(function () {
          a()
        }, rates)
      }, false);
      d.addEventListener('DOMContentLoaded', a, false);
      a()
    })(document, window);
  },
  /*
   *
   * @param    需要获取的参数值
   * @url      链接地址, 可以不传，默认从当前链接拿
   *
   * exp:
   *
   * vui.getUrlParamValue(“wap_id”)
   *
   * */
  getUrlParamValue: function (param, url) {
    var urls = url || window.location;
    var reg = new RegExp(param + "=([^&]*)");
    var r = urls.hash.substr(1).match(reg);
    if (r !== null) {
      return decodeURIComponent(r[1]);
    }
    return null;

  },
  getUrlQueryList: function () {
    var key, value, quertList = {};
    var str = window.location.href;
    var num = str.indexOf("?")
    str = str.substr(num + 1); //获取所有参数
    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
      num = arr[i].indexOf("=");
      if (num > 0) {
        key = arr[i].substring(0, num);
        value = arr[i].substr(num + 1);
        quertList[key] = value;
      }
    }
    return quertList;
  },
  getDUA: function () {
    let userAgent = navigator.userAgent
    let os = {}
    var detectUA = 'wap'
    os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false
    os.androidICS = os.android && userAgent.match(/(Android)\s4/) ? true : false
    os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false
    os.iphone = !os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false
    os.ios7 = (os.ipad || os.iphone)
    os.ios = os.ipad || os.iphone
    if (os.ios) {
      detectUA = 2
    }
    if (os.android || os.androidICS) {
      detectUA = 1
    }
    return detectUA
  },
  getUID: function () {
    var uid = vui.getUrlParamValue('userId')
    if (uid == null) {
      uid = window.sessionStorage.getItem('xtyy_uid')
      if (uid == null) {
        // uid = 2
      }
    } else {
      window.sessionStorage.setItem('xtyy_uid', uid)
    }
    return uid
  },
  getToken: function () {
    var token = vui.getUrlParamValue('token')
    if (token == null) {
      token = window.sessionStorage.getItem('token')
      if (token == null) {
        // uid = 2
      }
    } else {
      window.sessionStorage.setItem('token', token)
    }
    return token
  },
  jump: function (url) {
    var eleA = document.createElement('a')
    var event = document.createEvent('MouseEvents')
    document.body.appendChild(eleA)
    event.initEvent('click', true, true)
    eleA.href = url
    eleA.dispatchEvent(event)
    document.body.removeChild(eleA)
  },
  createSession: function (key, value) { //存蓄sessionStorage
    var sessionStorage = window.sessionStorage;
    if (sessionStorage) {
      sessionStorage[key] = JSON.stringify(value);
    }
  },
  getSession: function (key) { //获取sessionStorage
    var sessionStorage = window.sessionStorage;
    if (sessionStorage) {
      var value = sessionStorage.getItem(key);
      return JSON.parse(value);
    }
  },
  deleteSession: function (key) { //删除sessionStorage
    var sessionStorage = window.sessionStorage;
    if (sessionStorage) {
      sessionStorage.removeItem(key);
    }
  },
  createLocal: function (key, value) { //存蓄localStorage
    var localStorage = window.localStorage;
    if (localStorage) {
      localStorage[key] = value;
    }
  },
  getLocal: function (key) { //获取loaclStorage
    var localStorage = window.localStorage;
    if (localStorage) {
      var value = localStorage.getItem(key);
      return value;
    }
  },
  deleteLocal: function (key) { //删除localStorage
    var localStorage = window.localStorage;
    if (localStorage) {
      localStorage.removeItem(key);
    }
  },
  /**
   * @param {Object}
   * @return 返回拼接后的参数
   */
  objToUrl: function (obj = {}) {
    let arr = [];
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        arr.push(i + "=" + obj[i]);
      }
    }
    return arr.join("&");
  },
  objKeySort: function (obj) {//排序的函数
    let newkey = Object.keys(obj).sort();
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    let newObj = {};//创建一个新的对象，用于存放排好序的键值对
    for (let i = 0; i < newkey.length; i++) {//遍历newkey数组
      let value = obj[newkey[i]]
      if (value || value === 0) {
        newObj[newkey[i]] = value || value === 0 ? value : '';//向新创建的对象中按照排好的顺序依次增加键值对
      }

    }
    return newObj;//返回排好序的新对象
  }
}

export default vui;

