<!-- 首页 -->
<template>
  <!-- 侧边栏模块 -->
  <nav v-el:menu class="Smenu">
    <div class="sidebar-box">
      <div class="Stop">
        <div style="padding-top:4.1667rem;">
          <div class="Stop_pic" @click='isLogin'>
            <!-- 侧边栏头像 -->
            <img :style="classObj" :src="downImg.url"></img>
          </div>
        </div>
        <!-- 用户简要信息 -->
        <div style="margin-top:.8333rem;">
          <span style="color:#fff;width:8rem;height:1.2rem;" contenteditable="true" @blur="isChange" @focus='oldVal'>{{userInfo.nickname}}
            <span v-if="!userInfo.nickname">littleBee</span>
          </span>
          <!-- 登录且有积分才展示 -->
          <p v-if='token&&userInfo.integral'>积分：{{userInfo.integral}}分</p>
          <!-- 未登录用户提示信息 -->
          <p v-else>
            <span>登录可享受积分壕礼</span>
            <br/>
            <!-- 路由跳转到登录页面 -->
            <a v-link="{path:'/register/login'}">点我登录</a>
          </p>
        </div>
      </div>
      <!-- 侧边栏签到 -->
      <div class="Scenter" v-show='token'>
        <div class="right" @click="setSign">
          <div class="b1"></div>
          <a style="margin-top:.2rem;color:#fff;">点我签到</a>
        </div>
        <div class="left" v-if="sign[0]">
          <span>已签到{{ sign[0].count}}次</span>
          <span>连续签到{{ sign[0].signcount }}次</span>
        </div>
        <div class="left" v-else>
          <span>首次签到</span>
        </div>
      </div>
      <!-- 侧边栏功能项 -->
      <ul class="centerNext" v-show='token'>
        <li @click="token?show1=true:showLogin=true">
          <div class="Ss">
            <div class="centerNext_a">
            </div>
            <span>推荐朋友</span>
          </div>
        </li>
        <li @click="token?show4=true:showLogin=true">
          <div class="Ss">
            <div class="centerNext_c">
            </div>
            <span>意见反馈</span>
          </div>
        </li>
        <li style="margin-top:5rem;" v-link="{path:'/sIndex/userSetting'}">
          <div class="Ss">
            <div class="centerNext_d">
            </div>
            <span>设置</span>
          </div>
        </li>
      </ul>
    </div>
  </nav>
  <!-- 首页模块 -->
  <div class="Spage" v-el:panel @click='closeSlide'>
    <!-- 头部 -->
    <div class="home-top">
      <x-header :left-options="{showBack: false}" style="background:#f95377;" v-if="showHeader">
        <!-- 头部标题 -->
        <p class="stitle">{{title}}</p>
        <!-- 开关按钮 -->
        <div class="header-left" @click="toggle">
          <!-- 头像 -->
          <img :style="classObj1" :src="downImg.url"></img>
        </div>
        <!-- 消息推送信封按钮 -->
        <div class="header-right" @click='isRead'>
          <img src="../assets/home_mes@1x_0.png" style="width:3rem;height:3rem;">
          <!-- 仅当用户登录且消息阅读类型为0且个人设置里推送开关为打开时显示 -->
          <div v-if='token&&userInfo.readtype==0&&userInfo.marknews==0' style="width:6px;height:6px;background:red;position:absolute;top:10px;right:5px;border-radius:50%;"></div>
        </div>
      </x-header>
      <search v-if="showSearch"></search>
    </div>
    <!--  子路由部分 -->
    <div class="rout">
      <router-view></router-view>
    </div>
    <!-- 底部导航 -->
    <div class="footer" v-if="footerType">
      <tabbar style="background:#f95377;">
        <tabbar-item v-link="'/home'">
          <img slot="icon" src="../assets/home_homeicon@1x_0.png">
          <span slot="label">主页</span>
        </tabbar-item>
        <tabbar-item v-link="'/action'">
          <img slot="icon" src="../assets/home_activity@1x_0.png">
          <span slot="label">活动</span>
        </tabbar-item>
        <tabbar-item v-if="userInfo.type=='3'||userInfo.type == '4'" @click='enter'>
          <img slot="icon" src="../assets/home_teacher@1x_0.png">
          <span slot="label">园区</span>
        </tabbar-item>
        <tabbar-item v-link="'/around'">
          <img slot="icon" src="../assets/home_around@1x_0.png">
          <span slot="label">周边</span>
        </tabbar-item>
        <tabbar-item v-link="'/mybb'">
          <img slot="icon" src="../assets/home_mdb@1x_0.png">
          <span slot="label">我的宝贝</span>
        </tabbar-item>
      </tabbar>
    </div>
  </div>
  <!-- 签到提示 -->
  <toast :show.sync="show" width="50%" type="text">
    <p style="color:#fff;">{{signMess}}</p>
    <p style="color:#fff;">{{signAlertTitle}}</p>
    <p style="color:#fff;">{{signAlertContent}}</p>
  </toast>
  <!-- 推荐朋友页 -->
  <popup :show.sync="show1" height="100%">
    <x-header :left-options="{showBack: false}" style="background:#f95377">
      <p class="stitle">推荐朋友</p>
      <div class="pLeft" @click="back"></div>
      <div class="pRight" @click="sendNumber">发送</div>
    </x-header>
    <div class="popup1">
      <x-input title='手机号' placeholder="请输入朋友手机号" :max="11" :min="11" keyboard="number" name="mobile" :value.sync='user.phone' is-type="china-mobile"></x-input>
    </div>
  </popup>
  <!-- 信息反馈 -->
  <popup :show.sync="show4" height="100%">
    <x-header :left-options="{showBack: false}" style="background:#f95377">
      <p class="stitle">意见反馈</p>
      <div class="pLeft" @click="back"></div>
      <div class="pRight" @click="sendIdea">发送</div>
    </x-header>
    <div class="popup3">
      <x-textarea placeholder="请输入意见" :value.sync='user.msg'></x-textarea>
    </div>
  </popup>
  <!-- 推荐朋友提示信息 -->
  <toast :show.sync="show2" width="50%" type="text">
    <p style="color:#fff;">{{sendmsg}}</p>
  </toast>
  <!-- 意见反馈提示信息 -->
  <toast :show.sync="show5" width="50%" type="text">
    <p style="color:#fff;">{{sendidea}}</p>
  </toast>
  <!-- 首页信息箱 -->
  <popup :show.sync="showMsgg" height="100%">
    <x-header :left-options="{showBack: false}" style="background:#f95377">
      <p class="stitle">消息</p>
      <div class="pLeft" @click="back"></div>
      <div></div>
    </x-header>
    <div class="popup4">
      <group>
        <group title="官方消息：">
          <div v-for="new in news">
            <cell>{{ news }}</cell>
          </div>
        </group>
        <group title="学校消息：" v-if="noSnews">
          <cell class="pNews">{{ sNews}}</cell>
        </group>
        <group title="班级消息：" v-if="noCnews">
          <cell class="pNews">{{ cNews }}</cell>
        </group>
      </group>
    </div>
  </popup>
  <!-- 退出提示 -->
  <confirm :show.sync="showOut" confirm-text="确定" cancel-text="取消" title="操作提示" @on-confirm="onAction('确认')" @on-cancel="onAction('取消')">
    <p style="text-align:center;">要退出当前账号吗？</p>
  </confirm>
  <!-- 未登录警示 -->
  <toast :show.sync="showLogin" type="warn" width="9.6rem" :time='1500'>您还没登陆，请登陆</toast>
</template>
<script type="text/javascript">
import Search from './search.vue';
import Slideout from 'slideout';
import {
  SetSignins,
  GetSignins,
  downLoadUrl,
  bucket,
  URL_GET_NewsPush,
  GetOnlyGarden,
  ChangeNick,
  GetGardenInfo,
  URL_GET_UserInfo,
} from './api.js'
import {
  TabbarItem,
  Tabbar,
  XHeader,
  Alert,
  XTextarea,
  Toast,
  Popup,
  XInput,
  Confirm,
  Group,
  Cell,
  XButton
} from 'vux/src/components'
import {
  uploader,
  downLoadImg,
  getCookie,
  getLocation
} from './setAjax.js'
let slideout;
export default {
  components: {
    Search,
    Slideout,
    TabbarItem,
    Tabbar,
    XHeader,
    Alert,
    Confirm,
    XTextarea,
    Toast,
    XInput,
    Popup,
    Group,
    Cell,
    XButton
  },
  data( ) {
    return {
      showLogin: false,
      title: '', //标题
      footerType: true, //底部导航
      showHeader: true, //头部导航
      showSearch: true, //搜索导航
      signMess: "", //签到
      // 侧边栏
      show: false, //签到提示
      show1: false, //推荐朋友
      show2: false, //发生电话号码提示
      /* show3:false,//浏览公告*/
      show4: false, //意见反馈
      show5: false, //意见发送提示
      // 首页
      showMsgg: false, //显示信息
      news: [ ],
      sNews: '',
      cNews: '',
      noSnews: true,
      noCnews: true,
      signAlertTitle: "", //签到次数
      signAlertContent: "", //连续签到次数
      sendmsg: "", //电话号码提示信息
      sendidea: "", //意见反馈提示信息
      // 头像
      downImg: {
        'url': ''
      },
      token: '',
      // 侧边栏头像边框
      classObj: {
        height: '7.083rem',
        width: '7.083rem',
        borderRadius: '50%'
      },
      // 主页头像边框
      classObj1: {
        height: '3.333rem',
        width: '3.333rem',
        borderRadius: '50%'
      },
      // 侧边栏输入的电话与意见反馈
      user: {
        phone: '',
        msg: ''
      },
      oldNick: '',
      newNick: '',
      showOut: false,
      _show: false
    }
  },
  // 仓库钩子
  vuex: {
    getters: { // vuex内置的 getter方法
      userInfo: state => state.userInfo, //用户信息
      sign: state => state.sign, //签到信息           
      teacher: state => state.teacherUser //用户身份
    }
  },
  // 路由钩子
  route: {
    data( t ) {
      getLocation( ); //登录获取手机坐标
      this.token = getCookie( 'token' ); //获取localstorage里面的 token 值
      // pramise方法
      this.isExists( ).then( values => {
          // values 是isExists 返回的一个数组
          // 第一个请求的返回值
          var response = values[ 0 ]
            // 第二个请求的返回值
          var response1 = values[ 1 ]
          this.$store.dispatch( 'TO_SIGN', response1.data );
          this.$store.dispatch( 'OPEN_LOADING', response.data[ 0 ] );
          this.imgurl( 'u/' + this.userInfo.id ); // 获取头像
        } )
        .catch( ( e ) => {
          this.downImg.url = 'http://2e.zol-img.com.cn/product/64_280x2000/410/ceneo4LyDg8c.jpg';
        } );
      // 侧边栏插件属性（需要npm一个slideout依赖）
      slideout = new Slideout( {
        'panel': this.$els.panel,
        'menu': this.$els.menu,
        'padding': 300
      } );
      // 当路由的路径为‘/’时 且 未登录时
      if ( this.$route.path == '/' && !this.token ) {
        this.$router.go( '/register/login' );
      } else if ( this.$route.path == '/' ) {
        this.$router.go( '/home' );
      }
      slideout.disableTouch( ); // sildeout禁止滑动事件（详细情况 自己看）
      slideout.on( 'open', ( ) => { // 侧边栏打开时
        this._show = true;
      } );
      slideout.on( 'close', ( ) => { //侧边栏 关闭时
        slideout.disableTouch( );
        this._show = false;
      } );
      // this.getSign(); // 获取签到积分 并存储到仓库
      this.isTeacher( ); // 获取用户权限信息 包括作为 user所在园区，作为teacher所在园区 的 gid
      switch ( this.$route.name ) {
        case 'home':
          this.$broadcast( 'parents', 'home' ); // 自定义广播事件（2.0已弃用）
          this.title = '小蜜蜂';
          this.footerType = true;
          this.showHeader = true;
          this.showSearch = true;
          break;
        case 'action':
          this.$broadcast( 'parents', 'action' );
          this.title = '活动';
          this.footerType = true;
          this.showHeader = true;
          this.showSearch = true;
          break;
        case 'garden':
          this.title = '园区';
          this.showHeader = true;
          this.footerType = true;
          this.showSearch = false;
          break;
        case 'around':
          this.$broadcast( 'parents', 'around' );
          this.title = '周边';
          this.footerType = true;
          this.showHeader = true;
          this.showSearch = true;
          break;
        case 'mybb':
          this.title = '我的宝贝';
          this.footerType = false;
          this.showHeader = false;
          this.showSearch = false;
          break;
        case 'actionDetail':
          this.footerType = false;
          this.showHeader = false;
          this.showSearch = false;
          break;
        case 'detail':
          this.footerType = false;
          this.showHeader = false;
          this.showSearch = false;
          break;
        case 'commentDetails':
          this.footerType = false;
          this.showHeader = false;
          this.showSearch = false;
          break;

      }
      t.next( );
    }
  },
  ready( ) {

  },
  methods: {
    isLogin( ) {
      this.token ? this.$router.go( '/sIndex/userSetting' ) : this.$router.go( '/register/login' );
    },
    // 侧边栏 开关
    toggle( ) {
      slideout.toggle( );
      slideout.enableTouch( );
    },
    // 关闭侧边栏
    closeSlide( ) {
      if ( this._show ) {
        slideout.close( );
        this._show = false;
      }
    },
    // 修改昵称
    isChange( e ) {
      this.newNick = e.target.innerText; // 把输入的内容作为新的 昵称 保存在newNick里面
      if ( !!this.token ) { // 登录用户
        if ( this.newNick !== this.oldNick ) { // 仅当新昵称与旧昵称不同时才发送修改昵称的请求
          this.$http.post( ChangeNick, {
            'nickname': this.newNick,
            'flor_token': this.token
          } ).then( ( response ) => {}, ( response ) => {} );
        }
      }
    },
    // 修改昵称前的名字
    oldVal( e ) {
      this.oldNick = e.target.innerText; // 将旧昵称保存在 oldNick 中
    },
    // 进入园区（教师入口）
    enter( ) {
      if ( this.$route.path == '/garden' ) {
        this.$broadcast( 'boom' ); // 用户园区进教师园区
      } else {
        this.$http.post( GetGardenInfo, { // 将 学校ID与token 发送给服务器
          'gid': this.teacher.teacher.gid,
          'flor_token': this.token
        } ).then( ( response ) => {
          if ( response.body ) { // 当返回值不为空时
            this.$store.dispatch( "GARDEN_INFO", response.body, 'asTeacher' );
            // 在 store.js 中存储用户身份信息（如：老师身份，用户身份）
          }
          if ( response.body.teacher ) {
            this.$router.go( '/garden' ); // 跳转路由到 园区页面
          } else {
            this.$router.go( '/detail/' + this.teacher.teacher.gid );
          }
        } );
      }
    },
    // 在登录状态下 获取 用户信息和 签到信息
    isExists( ) {
      if ( !!this.token ) { // 登录用户
        return Promise.all( [
          // pramise.all可以接收一个元素为 Promise 对象的数组作为参数,当这个数组里面所有的 Promise 对象都变为 resolve 时，该方法才会返回(ES6)
          this.$http.post( URL_GET_UserInfo, {
            'flor_token': this.token
          } ),
          this.$http.post( GetSignins, {
            'flor_token': this.token
          } )
        ] );
      }
      return Promise.reject( );
      // reject方法则是将Promise对象的状态改变为失败，同时将错误的信息传递到后续错误处理的操作
    },
    // 页眉 消息推送是否已阅读（点击事件）
    isRead( ) {
      // 如果token不存在 则提示需要登录
      if ( !this.token ) {
        this.showLogin = true;
      } else {
        // 点过之后 在客户端手动将 阅读改为 1 并打开展示板
        this.$broadcast( 'isShow', 'fromHome' );
        // 自定义广播事件（传向组件popup内部index.vue源码）
        this.userInfo.readtype = 1; // 将消息设置为已读
        this.showMsgg = true; // 打开消息推送的模板
        // 发送token 获取 推送的消息
        this.$http.post( URL_GET_NewsPush, {
          'flor_token': this.token
        } ).then( ( response ) => {
          // 返回 平台,园区,班级 推送的消息
          this.news = response.data.News;
          this.sNews = response.data.GardenNews;
          this.cNews = response.data.RoomNews;
          // 如果 班级，学校 没有推送消息的时候 其所在展示板模板不显示
          this.cNews || [ this.noCnews = false ];
          this.sNews || [ this.noSnews = false ];
        } );
      }
    },
    // 弹出页面关闭
    back( ) {
      this.show1 = false;
      this.show4 = false;
      this.showMsgg = false;
    },
    // 推荐朋友的电话号码
    sendNumber( ) {
      if ( ( /^1[34578]\d{9}$/.test( this.user.phone ) ) ) { // 验证电话号码的合法性
        this.show1 = false;
        this.show2 = true;
        this.sendmsg = '发送成功';
      } else if ( this.user.phone == '' ) { // 输入号码为空不允许发送
        this.show2 = true;
        this.sendmsg = '请输入11位国内电话号码';
      } else { // 输入的号码格式不正确
        this.show2 = true;
        this.sendmsg = '请输入11位国内电话号码';
        this.user.phone = '';
      }
    },
    // 意见反馈
    sendIdea( ) {
      if ( this.user.msg == '' ) {
        this.sendidea = '亲！不能发送空信息哟！';
        this.show5 = true;
      } else {
        this.sendidea = '发送成功';
        this.show5 = true;
        this.show4 = false;
      }
    },
    // 获取头像
    imgurl( key ) {
      // 头像渲染 出错的情况下使用
      var img = document.querySelectorAll( 'img' );
      [ ].forEach.call( img, function ( v ) {
        v.onerror = function ( ) {
          this.src = 'http://2e.zol-img.com.cn/product/64_280x2000/410/ceneo4LyDg8c.jpg';
        }
      } );
      // 登录用户获取头像
      if ( this.token ) {
        this.$http.post( downLoadUrl, {
          'data': {
            'url': 'http://' + bucket + '/' + key + '?imageView2/2/h/50'
          }
        } ).then(
          ( r ) => {
            this.downImg = r.body; // 将用户头像地址赋值给 downImg
          } )
      }
    },
    // 签到
    setSign( ) {

      this.$http.post( SetSignins, {
          'flor_token': this.token
        } ).then(
          ( r ) => {
            this.show = true;
            if ( !r.data ) {
              this.signMess = "你已签到！"
              this.signAlertTitle = "请不要重复签到！";
            } else {
              if ( this.sign.festival ) {
                this.signMess = '节日签到，积分+' + this.sign.festival;
              }
              if ( r.data.first ) {
                this.signAlertContent = "首次签到成功！";
                this.$store.dispatch( 'SET_INTEGRAL', r.data.first ); // 首签
                this.$store.dispatch( 'TO_SIGN', {
                  0: {
                    count: 1,
                    signcount: 0
                  }
                } )
              }
              if ( r.data.count ) {
                this.signMess = "签到成功！"
                this.$store.dispatch( 'TO_SIGN',{0:r.data}  )
              }
            }
          },
          ( r ) => {

          } )
    },
    // 获取用户权限信息 包括作为 user所在园区，作为teacher所在园区 的 gid
    isTeacher( ) {
      // 登录用户才有
      if ( !!this.token ) {
        this.$http.post( GetOnlyGarden, {
          'flor_token': this.token
        } ).then( ( response ) => {
          // 用户身份（teacher or user）
          this.$store.dispatch( 'TEACHER_USER', response.body );
          // 存储到 store 里
        } );
      }
    }
  },
  events: {
    'God': function ( msg ) {
      // alert(msg);
      msg == 'hide' ? this.footerType = false : this.footerType = true;
    }
  }
}

</script>
<style>
/*侧边栏*/

.sidebar-box {
  width: 100%;
  height: 100%;
  background: #303030;
  font-family: "冬青黑体简体中文 W3";
}

a {
  text-decoration: none;
  color: #fff;
  font-size: .8rem;
}

.Stop {
  height: 17.0833rem;
  color: #fff;
  text-align: center;
}


/*  圆*/

.Stop_pic {
  width: 7.083rem;
  height: 7.083rem;
  border-radius: 50%;
  margin: auto;
  margin-top: .4167rem;
}


/*中间三个图标*/

.Scenter {
  height: 5rem;
  padding-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background: #353535;
  margin-top: 1rem;
}

.Scenter .right {
  color: #fff;
  margin-right: 2rem;
}

.Scenter .left {
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: .5rem;
}

.Scenter .b1 {
  width: 2.3333rem;
  height: 2.6rem;
  margin: auto;
  background: url('../assets/sidebar_sign@1x_0.png') no-repeat;
}


/*中间列表*/

.centerNext li {
  margin-top: 1.8333rem;
  height: 3.9583rem;
  background: #353535;
  color: #fff;
  line-height: 3.95rem;
  overflow: hidden;
  list-style-type: none;
}

.centerNext .Ss {
  width: 100%;
}

.centerNext div {
  float: left;
  margin-top: .3rem;
}

.centerNext span {
  font-size: 1.1rem;
  margin-left: .8333rem;
  color: #fff;
}

.centerNext li:hover {
  background: #f95377;
}

.centerNext_a {
  width: 2.5rem;
  height: 2.5rem;
  background: url('../assets/sidebar_friends@1x_0.png') no-repeat 1rem .83rem;
}

.centerNext_b {
  width: 2.5rem;
  height: 2.5rem;
  background: url('../assets/sidebar_see@1x_0.png') no-repeat 0 -.1667rem;
}

.centerNext_c {
  width: 2.5rem;
  height: 2.5rem;
  background: url('../assets/sidebar_idea@1x_0.png') no-repeat .85rem .9rem;
}

.centerNext_d {
  width: 2.5rem;
  height: 2.5rem;
  background: url('../assets/sidebar_setting@1x_0.png') no-repeat 0 -.1rem;
}


/*侧边栏模块*/

.slideout-menu {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
  width: 25rem;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  display: none;
}

.slideout-panel {
  position: relative;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  will-change: transform;
  background-color: #eee;
}

.slideout-open,
.slideout-open body,
.slideout-open .slideout-panel {
  overflow: hidden;
}

.slideout-open .slideout-menu {
  display: block;
}


/*页面模板*/

.Spage {
  position: absolute;
  overflow: hidden;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}


/*页面头部*/

.header-left {
  position: absolute;
  top: .2rem;
  left: 1.4rem;
  width: 3.3333rem;
  height: 3.3333rem;
  border-radius: 50%;
  /*background: url('../assets/home_head@1x_0.png') no-repeat;*/
}

.stitle {
  font-size: 2rem;
  font-weight: bold;
}

.header-right {
  position: absolute;
  top: .2rem;
  right: 1.4rem;
  width: 3.3333rem;
  height: 3.3333rem;
  /* background: url('../assets/home_mes@1x_0.png') no-repeat; */
}


/*页面路由部分*/

.rout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow: scroll;
  overflow-x: hidden;
}


/*页面尾部*/

.footer span {
  color: #fff;
  font-size: 1.3rem;
}


/* .footer .weui_tabbar {
    position: fixed;
} */

.pLeft {
  position: absolute;
  top: 1rem;
  left: 1.4rem;
  width: 1rem;
  height: 2rem;
  background: url('../assets/back@1x_0.png') no-repeat;
}

.pRight {
  position: absolute;
  top: .2rem;
  right: 2rem;
  width: 2rem;
  height: 2rem;
}

.popup1 {
  background: #fff;
  margin-top: 1rem;
}

.popup2 {
  text-align: center;
  margin-top: 1rem;
  font-size: 1.5rem;
}

.popup4 {
  width: 100%;
  height: 100%;
}

.pNews .weui_cell_ft {
  text-align: left;
}

</style>

