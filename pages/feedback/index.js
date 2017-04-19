//pages/feedback/index.js
var Bmob = require('../../lib/bmob.js');
//  正文内容
var input_zhengzai = '';
//  标题内容
var input_title = '';
//  文章总数
var list_sum = 0;
//  呱呱~\(≧▽≦)/~啦啦啦
var that = {};
//  测试数据
var items = ['item1', 'item2', 'item3', 'item4']
//  用来查询数据的 
//  这里搞时间   
var now = new Date();
//  获取当前年     
var year = now.getFullYear();
//  获取当前月
var month = now.getMonth() + 1;
//  获取当前日    
var day = now.getDate();
// 搞一下全局方法
var app = getApp();
// 那个图片的数量和路径
var tempPaths = '';
var tempPathArr=[];
var tempFile_num = 0;

Page(
    {
        data: {
        
        },

        //这个应该是载入页面调用的 
        onLoad: function (options) {
            that = this;
   
        },
        
    // 选择图片事件
	chooseimg: function() {
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
			 		var Diary_q_1 = Bmob.Object.extend("user_feedback");
					var diary_q_1 = new Diary_q_1();
					var name = res.tempFilePaths+".jpg"; //上传的图片的别名
					var file = new Bmob.File(name, res.tempFilePaths);
                    wx.showToast({
                        title: '正在上传',
                        icon: 'loading',
                        duration: 28000
                    })
					// 最多上传6张图
					if (tempPathArr.length<7) {
					file.save().then(function(res) {
						 tempPathArr.push(res.url());				 		
							that.setData({
								src: tempPathArr,
							}); 
                            wx.hideToast();
					}, function(error) {
					});
					} else{
						wx.showToast({
						  title: '最多上传六张图片',
						  icon: 'loading',
						  duration: 2000
						})
					}


			}
		}) 
	},
 
        // onShow开始
        onShow: function () {
            wx.showNavigationBarLoading();
            setTimeout(function () { wx.hideNavigationBarLoading() }, Math.random() * 2022);
            this.setData({
                actionSheetHidden: !this.data.actionSheetHidden
            })
            //底部导航显示啥的
            that.setData({
                bottom_bar_class: "bottom_bar"
            });
        },
        // onShow结束


        onReady: function () {

        },

        // 反馈内容
        q_title_input: function (e) {
            input_title = e.detail.value;
        },

        // 联系方式
        zhengzai_input: function (e) {
            input_zhengzai = e.detail.value;
        },

        // 提交笔记事件
        submit: function (e) {
            var Diary_q_1 = Bmob.Object.extend("user_feedback");
            var diary_q_1 = new Diary_q_1();
            var q_temp_username = ''
            wx.getStorage({
                key: 'user_openid',
                success: function (res) {
                    diary_q_1.set("user_openid_wechat", res.data);
                    if (input_zhengzai) {
                    if (tempPaths.length > 0) {
                        var name = res.data + '/' + tempFile_num + ".jpg";//上传的图片的别名
                        var file = new Bmob.File(name, tempPaths );
                        file.save().then(function (res) {
                        }, function (error) {
                        });
                         // 状态
                        diary_q_1.set("status", '有图'+name);
                    }       

                        // 用户的联系方式
                        diary_q_1.set("contact", input_title);
             
                        diary_q_1.set("feedback", input_zhengzai);
                        //添加数据，第一个入口参数是null
                        diary_q_1.save(null, {
                            success: function (result) {
                                // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                                // console.log("日记创建成功, objectId:"+result.id);

                                wx.showToast({
                                    title: '感谢您的意见 ^_^',
                                    icon: 'success',
                                    duration: 1226
                                })
                                //  返回主界面
                                // 在C页面内 navigateBack，将返回A页面
                                setTimeout(function () {
                                    wx.navigateBack({
                                        url: '../mine/index'
                                    })
                                }, 1226);

                            },
                            error: function (result, error) {
                                wx.showToast({
                                    title: '网络故障 请重试',
                                    icon: 'loading',
                                    duration: 1226
                                })
                            }
                        });


                    }
                    else {
                        wx.showToast({
                            title: '空空的~',
                            icon: 'loading',
                            duration: 1222
                        })
                    }

                }
            })


            //  onsubmit结束
        },

        // 取消事件
        cancle: function () {
            wx.navigateBack({
                url: '../mine/index'
            })
        }
        // 取消事件结束
    });