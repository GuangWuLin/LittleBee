// const api = 'http://localhost/apisflora/index.php/Home/';
// const api = 'http://192.168.2.112/apisflora/index.php/Home/';
const api = 'http://1.apisflora.applinzi.com/ApisFlora/index.php/Home/';
const api1 = 'http://1.apisflora.applinzi.com/ApisFlora/index.php/';
// const api = 'http://192.168.11.19/apisflora/index.php/Home/';
// const api = 'http://dongdonggo.top/apisflorea/index.php/Home/';
// const getTeacherClass = '';//
// const api1 = 'http://192.168.2.112/apisflora/index.php/';
// const api1 = 'http://192.168.11.19/apisflora/index.php/';
// const api1 = 'http://localhost/apisflora/index.php/';
const  changenick = 'Lguser/ChangeUserInfo'; // 修改昵称
const shortMsg = 'user/VerificationCode';// 短信验证接口
const changecode = 'Lguser/ChangCode'; // 修改 密码（短信）
const passwordRecovery = 'user/PasswordRecovery';//密码找回
const passwordBackSMS = 'user/PasswordBackSMS';//密码找回（短信）
const changePsw = 'Lguser/ChangePassword'; //修改 密码
const getActionTopic = 'User/GetActionTopic'; //获取活动主题帖
const addTopic = 'Lguser/addtopic'; //添加主题帖
const addActionTopic = 'Lguser/AddActionTopic'; //添加活动主题帖
const addReply = 'Lguser/AddReply'; //添加主题帖的回复
const addRemark = 'Lguser/AddRemark'; //添加三级回复（备注）
const addEstimate = 'Lguser/AddEstimate'; //置顶
const getTopic = 'User/GetGardenTopic'; //获取主题帖
const selectGarden = 'User/SelectGardens';//查询学校  前端使用
const getAction = 'User/getAction'; //获取活动
const getReplyAndRemark = 'User/GetGardenReply';//获取主题帖回复
const AddActionPeople = 'Lguser/AddActionPeople'; //活动报名
const getUserInfo = 'user/getUserInfo'; //获取用户信息
const SetSignin = 'Lguser/SetSignin' //发送签到
const GetSignin = 'Lguser/GetSignin' //获取签到
const GetLoadUrl = 'user/GetLoadUrl';//图片下载请求地址
const GetImageLimat = 'user/GetImageLimat';//图片列表
const GetUpLoadToken = 'user/GetUpLoadToken';//七牛上传token
const Deleteimage = 'user/Deleteimage';//七牛删除图片
const getUserChild = 'Lguser/GetUserChild';//查询用户关联子女
const setUserChild = 'Lguser/SetUserChild';//设置关联子女
const GetGardenClass = 'Lguser/GetGardenClassRoom';//获取学校班级列表
const GetTops = 'user/getTops'; //获取置顶
const Login = 'user/login'; //登录
const Register = 'user/Register'; //注册
const markNews = 'Lguser/MarkNews'; //关闭&打开消息推送
const newsPush = 'Lguser/NewsPush';//消息推送
const verifyparent = 'staff/VerifyParents';//验证用户子女关联 班主任权限
const pushparent = 'staff/PushParents';//关联推送
const getOnlyGarden = 'Lguser/GetMyOnlyGarden';//获取用户或老师绑定的学校
const GardenInfo = 'Lguser/GetMyGardenInfo';//获取用户或老师绑定的学校
const deleteChild = 'Lguser/DeleteUserChild'; //审核失败后调用
const AddClassRoomAssess = 'Lguser/AddClassRoomAssess';// 班级活动评分
const GetMyClassRoomAction = 'Lguser/GetMyClassRoomAction';// 获取班级活动
const GetTeacherClass = 'Admin/GardenAdmin/GetTeacherClassroom';//获取班级列表
const AddClassAction = 'Admin/GardenAdmin/AddClassRoomAction';//添加班级活动
const PushMessages = 'Admin/GardenAdmin/PushMessage';// 老师推送消息
const editClassRoomAction = 'Admin/GardenAdmin/EditClassRoomAction';//编辑删除活动
	
	export let PasswordRecovery = api + passwordRecovery
	// 密码找回
	export let PasswordBackSMS = api + passwordBackSMS
	//密码找回（短信）
	export let EditClassRoomAction = api1 + editClassRoomAction;
	// 编辑删除活动
 	export let PushMessage = api1 + PushMessages;
 	// 老师推送消息
	export let AddClassRoomAction = api1 + AddClassAction;
	//添加班级活动
	export let GetTeacherClassroom = api1 + GetTeacherClass;
	// 获取班级列表
	export let ChangeNick = api + changenick;
	// 修改昵称
	export let addClassRoomAssess = api + AddClassRoomAssess;
	// 班级活动评分
	export let getMyClassRoomAction = api + GetMyClassRoomAction;
	// 获取班级活动
	export let shorMsgCode = api + shortMsg;
	// 短信验证码
	export let changepsw = api + changePsw;
	//修改密码
	export let ChangCode = api + changecode;
	// 修改密码（验证码）
	export let DeletChild = api + deleteChild;
	//删除绑定的信息
	export let PushParent = api + pushparent;
	// 验证推送来的子女关联信息
	export let GetGardenInfo = api + GardenInfo;
	//获取用户或老师绑定的学校
	export let GetOnlyGarden = api + getOnlyGarden;
	//获取用户或老师绑定的学校
	export let VerifyParent = api + verifyparent;
	//验证关联c
	export let URL_GET_MarkNess = api + markNews;
	//关闭&打开消息推送
	export let URL_GET_NewsPush = api + newsPush;
	//消息推送
    export let login = api + Login;
	//登录
	export let register = api + Register;
	//注册
	//export let URL_GET_Admin_List = api_ + gardenList;
	export let URL_GET_GardenLIST = api + selectGarden;
	//获取学校列表
	//URL_GET_ACTION = 'http://192.168.2.112/ApisFlora/index.php/home//Lguser/addtopic';
	export let URL_USER_AddComment = api + addTopic;
	//添加学校主体贴
	export let URL_USER_GetGardenTopic = api + getTopic;
	//获取学校主题帖
	export let URL_USER_AddReply = api + addReply;
	//添加回复
	export let URL_USER_AddRemark = api + addRemark;
	//添加回复的回复
	export let URL_USER_GetGardenReply = api + getReplyAndRemark;
	//获取帖子回复和备注
	export let URL_USER_AddEstimate = api + addEstimate;
	//置顶;
	export let URL_Add_actionTopic = api + addActionTopic;
	//添加活动主题帖
	export let URL_GET_ActionTopic = api + getActionTopic;
	//获取活动主题帖
	export let URL_GET_ACTION = api + getAction;
	//获取活动列表
	export let URL_Add_actionPeople = api + AddActionPeople;
	//活动报名
	export let URL_GET_UserInfo = api + getUserInfo;
	//获取用户信息
	export let downLoadUrl = api + GetLoadUrl; 
	//图片下载请求地址
	export let getImageListUrl = api + GetImageLimat;
	//图片列表
	export let getUpLoadTokenUrl = api + GetUpLoadToken;
	//七牛上传token
	export let deleteImgUrl = api + Deleteimage;
	//七牛删除图片
	export let bucket='7xij93.com1.z0.glb.clouddn.com';
	//七牛空间域名bucket
	export let GetUserChild = api + getUserChild;
	//获取关联子女
	export let SetUserChild = api + setUserChild ;
	//设置关联子女
	export let GetGardenClassList = api + GetGardenClass;
	//获取学校班级列表
	export let getTop = api + GetTops;
	//获取置顶
	export let SetSignins = api +SetSignin
	//设置签到
	export let GetSignins = api +GetSignin
	// 获取签到
