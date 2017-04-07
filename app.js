// app.js
// 初始化Bmob
var Bmob = require('utils/bmob.js');
// 小程序 版本号定义
var version = '0.2.0';
// 自定义公共方法
var gong = {};

var key = require('utils/key.js');

// start
// 配置Bmob密钥
Bmob.initialize(key.getKey('bmob1'), key.getKey('bmob2'));
// 小程序 Id 密钥
var appId = key.getKey('appId');
var appSecret = key.getKey('appSecret');
// end

// 全局方法App
App({
	// 极简笔记版本号
	getversion: function() {
		return version;
	},
	onLaunch: function() {
		//调用API从本地缓存中获取数据
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)
	},
	getUserInfo: function(cb) {
		var that = this
		if(this.globalData.userInfo) {
			typeof cb == "function" && cb(this.globalData.userInfo)
		} else {
			//调用登录接口
			wx.login({
				success: function() {
					wx.getUserInfo({
						success: function(res) {
							that.globalData.userInfo = res.userInfo
							typeof cb == "function" && cb(that.globalData.userInfo)
						}
					})
				}
			})
		}
	},

	//在app.js中自定义全局方法  用来获取登录后返回的所有信息 
	// 全局方法开始
	getcode: function(cb) {
		var that = this;
		//如果登录过就直接获取  
		if(this.globalcode.code) {
			typeof cb == "function" && cb(this.globalcode.code)
		} else {
			//没登陆的话话  获取数据调用登录接口
			wx.login({
				//登陆成功
				success: function() {
					// 调微信获取用户信息方法
					wx.getUserInfo({
						// 成功获取用户所有信息
						success: function(code) {
							that.globalcode.code = code
							typeof cb == "function" && cb(that.globalcode.code)

						}
					})
				}
			})
		}
	},
	//全局方法结束 

	// 自定义全局变量,用来获取返回的code信息 开始
	globalcode: {
		code: null
	},
	// 自定义全局变量 结束

	// 全局方法
	globalData: {
		userInfo: null,
		// 添加wechatscrete
		// 获取用户信息
		getUserInfo: function(cb) {
			var that = this
			if(this.globalData.userInfo) {
				typeof cb == "function" && cb(this.globalData.userInfo)
			} else {
				//调用登录接口
				wx.login({
					success: function() {
						wx.getUserInfo({
							success: function(res) {
								that.globalData.userInfo = res.userInfo
								that.globalData.wechatscrete = res,
									// realwetsun  13953631665
									gong = res.userInfo;
								typeof cb == "function" && cb(that.globalData.userInfo)
							}
						})
					}
				})

			}
		},
	},
	// 测试数据
	nihao: gong,

	// 获取当前时间,并格式化
	getNowTimeformat: function() {
		var myDate2 = new Date();
		var now_call_hour = '';
		if(myDate2.getHours() >= 6 && myDate2.getHours() < 9) {
			now_call_hour = '早晨';
		} else if(myDate2.getHours() >= 9 && myDate2.getHours() < 11) {
			now_call_hour = '上午';
		} else if(myDate2.getHours() >= 11 && myDate2.getHours() < 13) {
			now_call_hour = '中午';
		} else if(myDate2.getHours() >= 13 && myDate2.getHours() < 18) {
			now_call_hour = '下午';
		} else if(myDate2.getHours() >= 18 && myDate2.getHours() < 21) {
			now_call_hour = '傍晚';
		} else if(myDate2.getHours() >= 21 && myDate2.getHours() < 23) {
			now_call_hour = '深夜';
		} else if(myDate2.getHours() >= 23 && myDate2.getHours() < 24) {
			now_call_hour = '深夜';
		} else if(myDate2.getHours() >= 0 && myDate2.getHours() < 3) {
			now_call_hour = '拂晓';
		} else if(myDate2.getHours() >= 3 && myDate2.getHours() < 6) {
			now_call_hour = '黎明';
		}
		var newtime3 = myDate2.getFullYear() + '年' + (1 + myDate2.getMonth()) + '月' + myDate2.getDate() + '日 ' + now_call_hour + '' + myDate2.getHours() + ':' + myDate2.getMinutes();
		return newtime3;
	},

	getAppId: function() {
		return appId;
	},
	getappSecret: function() {
		return appSecret;
	},
})