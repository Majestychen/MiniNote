//  pages/note/index.js
/*
 当前用户所有数据缓存,异步:all_note_data_001
 * */
var app = getApp()
var that;
var Bmob = require('../../utils/bmob.js');
var Diary = Bmob.Object.extend("user_note");
var user_openid = '';
var all_data;
var over = {
	doubleA4: false,
};

function longClickMenu(e) {
	var objectId = 0;
	var guagua_ni_hao_ya_xixi = '';
	if(e.target.id) {
		objectId = e.target.id;
	} else {
		objectId = e.currentTarget.id;
	}
	wx.showActionSheet({
		itemList: ['查看', '删除'],
		success: function(res) {
			if(res.tapIndex == 0) {
				wx.navigateTo({
					url: '../edit/index?id=' + objectId
				})
			}
			if(res.tapIndex == 1) {
				wx.getStorage({
					key: 'all_note_data_001',
					success: function(res) {
						var temp_consle = res.data;
						for(var i = 0; i < temp_consle.length; i++) {
							if(temp_consle[i].objectId == objectId) {
								guagua_ni_hao_ya_xixi = temp_consle[i].note_title;
								temp_consle.splice(i, 1);
								wx.setStorage({
									key: 'all_note_data_001',
									data: temp_consle,
									success: function(res) {

										that.onShow();
									},
									fail: function() {
										// fail
									},
									complete: function() {
										// complete
									}
								})
								wx.showModal({
									title: '确定删除?',
									content: '标题:' + guagua_ni_hao_ya_xixi,
									success: function(res) {
										if(res.confirm) {
											wx.getStorage({
												key: 'user_openid',
												success: function(res) {
													var Diary_note = Bmob.Object.extend("user_note");
													var query = new Bmob.Query(Diary_note);
													query.equalTo("objectId", objectId);
													//  数据库删除操作
													query.get(objectId, {
														success: function(object) {
															object.destroy({
																success: function(deleteObject) {
																	that.onShow();
																},
																error: function(object, error) {
																	that.onShow();
																}
															});
														},
														error: function(object, error) {}
													});
												}
											})

										}
									}
								});
							}
						}

					},
					fail: function(res) {
						// fail
					},
					complete: function(res) {
						// complete
					}
				})
			}
			over.doubleA4 = false;
		},
		fail: function(res) {}
	});

};
Page({
	data: {
		col: "col2",
		bottom: "bottom_hide",
		q_bottom_text: "q_bottom_text",
		q_diandian: "q_diandian",
		writeDiary: false,
		loading: false,
		windowHeight: 0,
		windowWidth: 0,
		limit: 10,
		diaryList: [],
		modifyDiarys: false,
		q_sousuo_neirong: "",
		bottom_bar2: 'http://mininote-1251903635.costj.myqcloud.com/tongbu.png',
		bottom_bar3: 'http://mininote-1251903635.costj.myqcloud.com/chuangjian.png',
	},

	onPullDownRefresh: function() {
		that.tongbu_auto();
		wx.stopPullDownRefresh();

	},

	onLoad: function(this_object) {
		app.getUserInfo(function(userInfo) {
			//更新数据
			wx.setStorage({
				key: "q_user_info",
				data: userInfo
			})
			wx.setStorage({
				key: "q_user_name",
				data: userInfo.nickName
			})
		})

		that = this;

		//调用微信登录接口  
		//  
		wx.login({
			success: function(res) {
				var temp_data_openid;
				if(res.code) {
					//发起网络请求
					wx.request({
						url: 'https://api.weixin.qq.com/sns/jscode2session',
						data: {
							appid: app.getAppId(),
							secret: app.getappSecret(),
							js_code: res.code,
							grant_type: 'authorization_code'
						},
						success: function(res) {
							temp_data_openid = res.data.openid;
							// 本地缓存写入
							wx.setStorage({
								key: "user_openid",
								data: res.data.openid
							});
						}
					})
				} else {}
			}
		});

		setTimeout(function() {
			that.onShow();
		}, 3000);
	},

	onShow: function() {
		wx.setNavigationBarTitle({
			title: '',
		})

		wx.getStorage({
			key: 'all_note_data_001',
			success: function(res) {
				that.setData({
					diaryList: res.data,
				});
			},
			fail: function(res) {
				// fail
			},
			complete: function(res) {
				// complete
			}
		})

		wx.getStorage({
			key: 'user_openid',
			success: function(res) {
				user_openid = res.data;
				var Diary_note = Bmob.Object.extend("user_note");
				var query = new Bmob.Query(Diary_note);
				// 查询当前用户数据
				if(res.data) {
					query.equalTo("user_openid_wechat", res.data);
					query.select("note_title");
					query.select("note_date");
					query.select("note_content");
					query.select("objectId");
					query.descending("updatedAt");
					query.limit(1000);
					query.find({
						success: function(results) {
							// 循环处理查询到的数据
							var temp = {};
							var tempData = [];
							var tempDataAll = [];
							var this_object_arr = [];
							that.setData({
								diaryList: results,
							});

							wx.setStorage({
								key: 'all_note_data_001',
								data: results,
								success: function(res) {
									// success
								},
								fail: function() {
									// fail
								},
								complete: function() {
									// complete
								}
							})
						},
						error: function(error) {

							wx.showModal({
								title: '服务器开小差了',
								content: '是否重试',
								confirmText: '重试',
								success: function(res) {
									if(res.confirm) {
										// 如果用户点击了确认按钮
										that.onShow();
									}
								}
							});
						}
					});
				}

			}
		})

		// onShow结束
	},
	// 排列方式
	q_pailie2: function() {
		that.setData({
			q_pailie: "q_pailie_btn1",
			q_pailie2: "q_pailie_btn2_hide",
			container: "container",
			col: "col",
			bottom: "bottom",
			q_bottom_text: "q_bottom_text_hide",
			q_diandian: "q_diandian_hide",
		});

	},

	// 排列方式2
	q_pailie: function() {
		that.setData({
			q_pailie: "q_pailie_btn1_hide",
			q_pailie2: "q_pailie_btn2",
			container: "container2",
			col: "col2",
			bottom: "bottom_hide",
			q_bottom_text: "q_bottom_text",
			q_diandian: "q_diandian",
		});

	},

	// 创建语音笔记事件
	q_yuyin: function() {
		wx.navigateTo({
			url: '../create_yuyin/index'
		})

	},

	// 创建笔记事件
	q_biji: function() {
		wx.navigateTo({
			url: '../create/index'
		})
	},

	btnHover2: function() {
		// 按钮点击效果
		that.setData({
			bottom_bar3: 'http://mininote-1251903635.costj.myqcloud.com/chuangjianhover.png',
		});
	},
	btnHoverend2: function() {
		that.setData({
			bottom_bar3: 'http://mininote-1251903635.costj.myqcloud.com/chuangjian.png',
		});
	},
	//
	col_long_temp: function() {
		wx.showActionSheet({
			itemList: ['编辑', '删除'],
			success: function(res) {
				if(res.tapIndex == 1) {
					wx.showToast({
						title: '该提示将在新建后自动删除',
						icon: 'success',
						duration: 4666
					})
				}
			},
			fail: function(res) {}
		})
	},

	// 单击笔记列表事件
	clickNotelist: function(e) {
		if(!over.doubleA4) {
			wx.navigateTo({
				url: '../edit/index?id=' + e.currentTarget.id
			})
		}
	},

	noteHoverStart: function(e) {
		over.doubleA4 = true;
		longClickMenu(e);
	},

	//  长按笔记列表/ 点击笔记右侧小按钮 事件
	col_long: function(e) {
		longClickMenu(e);
	},

	// 进入笔记列表的事件
	onEditItem: function(e) {
		var objectId = e.target.id;
		wx.setStorage({
			key: "q_0_note_content_id",
			data: objectId
		})
		wx.navigateTo({
			url: '../edit/index?id=' + objectId
		})
		//  进入笔记列表的事件结束End
	},

	// 搜索笔记功能
	q_sousuo_bindinput: function(zhengzaishurudeneirong) {
		wx.getStorage({
			key: 'user_openid',
			success: function(res) {
				all_data = res;
				var Diary_note = Bmob.Object.extend("user_note");
				var query = new Bmob.Query(Diary_note);
				// 查询所有数据
				query.equalTo("user_openid_wechat", res.data);
				query.select("note_title");
				query.select("note_date");
				query.limit(1000);
				query.find({
					success: function(results) {

						var temp = [];
						var temp2 = [];
						// 循环处理查询到的数据
						for(var i = 0; i < results.length; i++) {
							// 
							if((results[i].attributes.note_title).indexOf(zhengzaishurudeneirong.detail.value) >= 0) {
								temp.push(results[i]);
							}
							that.setData({
								diaryList: temp
							})
						}
					},

					error: function(error) {

						wx.showModal({
							title: '服务器开小差了',
							content: '是否重试',
							confirmText: '重试',
							success: function(res) {
								if(res.confirm) {
									// 如果用户点击了确认按钮
									that.onShow();
								}
							}
						});

					}
				});
			}
		})
	},
	//  笔记列表上方搜索功能结束

	// 手动同步
	tongbu_auto: function() {
		wx.showToast({
			title: '正在同步',
			icon: 'loading',
			duration: 9999
		});

		var Diary_note = Bmob.Object.extend("user_note");
		var query = new Bmob.Query(Diary_note);
		// 查询当前用户数据
		if(user_openid) {
			query.equalTo("user_openid_wechat", user_openid);
			query.select("note_title");
			query.select("note_date");
			query.descending("updatedAt");
			query.limit(1000);
			query.find({
				success: function(results) {
					// 循环处理查询到的数据
					var temp = [];
					var this_object_arr = [];
					for(var i = 0; i < results.length; i++) {
						temp.push(results[i]);
					}
					that.setData({
						diaryList: temp,
					});
					setTimeout(function() { wx.hideToast() }, 700)

				},
				error: function(error) {}
			});
		}

	},
	// 手动同步结束

	btnHover: function() {
		// 按钮点击效果
		that.setData({
			bottom_bar2: 'http://mininote-1251903635.costj.myqcloud.com/tongbuhover.png',
		});
	},
	btnHoverend: function() {
		that.setData({
			bottom_bar2: 'http://mininote-1251903635.costj.myqcloud.com/tongbu.png',
		});
	},
})