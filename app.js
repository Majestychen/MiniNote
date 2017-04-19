const Bmob = require('lib/bmob.js');
const appParam = require('utils/appParam.js');
const util = require('utils/util.js');
Bmob.initialize(appParam.bmob.id, appParam.bmob.key);
App({
	onLaunch: function() {
		wx.login({
			success: function(code) {
				wx.request({
					url: appParam.apiUrl.openId,
					data: {
						appid: appParam.wxApp.appKey,
						secret: appParam.wxApp.secret,
						js_code: code.code,
						grant_type: 'authorization_code'
					},
					success: function(res) {
						wx.setStorage({
							key: "user_openid",
							data: res.data.openid
						});
					}
				})
			}
		});
	},
	onHide: function() {
		wx.clearStorage();
	},
	getUserInfo: function(cb) {
		var that = this
		if(this.globalData.userInfo) {
			typeof cb == "function" && cb(this.globalData.userInfo)
		} else {
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
	getcode: function(cb) {
		var that = this;
		if(this.globalcode.code) {
			typeof cb == "function" && cb(this.globalcode.code)
		} else {
			wx.login({
				success: function() {
					wx.getUserInfo({
						success: function(code) {
							that.globalcode.code = code
							typeof cb == "function" && cb(that.globalcode.code)

						}
					})
				}
			})
		}
	},
	globalcode: {
		code: null
	},
	globalData: {
		userInfo: null,
	},
	//获取用户信息:需要权限
	getUserInfo: function(cb) {
		var that = this
		if(this.globalData.userInfo) {
			typeof cb == "function" && cb(this.globalData.userInfo)
		} else {
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
	util: util,
	appParam: appParam,
	Bmob: Bmob,
})