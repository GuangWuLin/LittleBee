<!-- 我的宝贝 -->
<template>
    <div class="mybb-top">
        <x-header :left-options="{showBack: false}" style="background:#f95377">
            <p class="gmybb">我的宝贝</p>
            <div class="mybb_left" @click="back"></div>
            <div></div>
        </x-header>
    </div>
    <group class="bbmsg" v-show='token'>
        <!-- 已有绑定的子女信息 其中状态为 0 或 1 -->
        <div v-if="!!token && !isAgain">
            <cell title="学校:" :value="childList.gardenname"></cell>
            <cell title="班级:" :value="childList.crname"></cell>
            <cell title="昵称:" :value="childList.nickname"></cell>
            <cell title="生日:" :value="childList.birthday"></cell>
            <cell title="家长电话:" :value="childList.parentphone"></cell>
            <group title="审核情况:" >
                <!-- staus == 0 -->
                <cell title="状态:" value="正在等待班主任审核..." v-if="zero"></cell>
                <!-- staus == 1 -->
                <cell title="状态:" value="已通过班主任的审核~！" v-else></cell>
            </group>
        </div>
        <!-- 用户未登录状态或者 初次进入绑定页面及需要重新绑定子女信息 -->
        <div v-if="!token || (isAgain&&!gitUP)" @click="noToken"> 
            <search v-show='iscall' @result-click="resultClick" @on-change="getResult" :results="results" :value.sync="value" top="46px" :placeholder="myplaceholdere" :cancel-text="myCancelText" @on-cancel='cancel'></search>
            <cell v-show='!iscall' title="学校:" :value.sync="values" :id='id' placeholder="请选择学校" @click='call'></cell>
            <selector title="班级:" @on-change="onChange" :options="classList" placeholder='请选择班级'></selector required >
            <x-input title="昵称:" :value.sync="childList.nickname" required placeholder="请输入昵称"></x-input>
            <datetime title="生日:" placeholder="请选择生日" @on-change="birth" required style="font-size:17px;" ></datetime>
            <x-input title="家长:" :value.sync="childList.parentname" required placeholder="请输入家长姓名"></x-input>
            <x-input title="家长电话:" :value.sync="childList.parentphone" required is-type="china-mobile" :max="11" :min="11" keyboard="number" name="mobile" placeholder="请输入电话"></x-input>
            <x-button type="warn" @click='push' :mini="true" style="margin-left: calc(50% - 2rem);margin-bottom:.5rem;">提交</x-button>
        </div>
        <!-- 子女信息与预留的信息不符合被班主任驳回 -->
        <div v-if="!!token && isAgain && gitUP">
            <p style="width:75%;margin:1.2rem auto;font-size: 1.5rem;color: #333;">对不起，因为您填写的信息与预留的信息不匹配，审核不成功！请点击'重新提交'填写正确的信息！
                <icon type="warn"></icon>
            </p>
            <x-button text='重新提交' type="warn" @click='sub'></x-button>
        </div>
        <!-- {{ userInfo|json }} -->
    </group>
    <!-- 未登录状态提示 -->
    <div v-if='!token'>
        <p style="font-size:1.5rem;color:#f95377;text-align:center;margin-top:5rem;">登录后才可以绑定子女信息到园区！</p>
        <x-button v-link="{path:'/register/login'}" style="font-size:2rem;text-align:center;width:60%;" text="点我登录" type='warn'></x-button>
    </div>
    <!-- 绑定信息提交成功提示 -->
    <toast :show.sync="show">
        <p style="text-align:center;color:#fff;" width='50%' >提交成功</p>
    </toast>
    <!-- 信息不全或有误提示 -->
    <toast :show.sync='show1' type="warn" width='50%'>
        <p style="text-align:center;color:#fff;" v-if="!!token">您的信息填写不全或电话格式有误，请完善后再提交</p>
        <p style="text-align:center;color:#fff;" width='50%' v-else>请先登录再绑定子女</p>
    </toast>
</template>
<script>
import {
    Group,
    Cell,
    XInput,
    XButton,
    Datetime,
    Selector,
    Search,
    Toast,
    Icon,
    XHeader
} from "vux/src/components/";
import {
    SetAjax,
    uploader,
    getCookie
} from './setAjax.js';
import {
    SetUserChild,
    URL_GET_UserInfo,
    GetUserChild,
    GetGardenClassList,
    downLoadUrl,
    getUpLoadTokenUrl,
    getImageListUrl,
    bucket,
    DeletChild,
    URL_GET_GardenLIST
} from "./api.js"
var obj = {};
export default {
    components: {
        Group,
        Cell,
        XInput,
        XButton,
        Selector,
        Datetime,
        Search,
        Toast,
        Icon,
        XHeader
    },
    vuex: {
        getters: {
            // 从仓库获取用户信息
            userInfo: state => state.userInfo 
        }
    },
    data() {
        return {
            childList: {
                "nickname": "",
                "birthday": "",
                "crname": "",
                "gardenname": "",
                "parentphone": "",
                'crid': ''
            },
            key: '',
            imgList: {},
            downImg: {},
            classList: [],
            value1: '',
            iscall: false,
            results: [],
            value: '',
            values: '',
            myplaceholdere: '搜索学校',
            show: false,
            show1: false,
            myCancelText: '取消',
            isAgain: false,
            gitUP:false,
            zero:false,
            token:''
        }
    },
    route:{
        data(t){
            // 从cookie里面获取token
            this.token = getCookie('token');
            this.getUserChild();//获取用户子女信息
            t.next();
        }
    },
    methods: {
        // 重新提交绑定的子女信息 并删除被 驳回的绑定信息
        sub() {
            this.$http.post(DeletChild,{'flor_token':this.token}).then((response) => {
                // console.log(response);
            }, (response) => {
                // console.log(response);
            });
            this.childList = {
                "nickname": "",
                "birthday": "",
                "crname": "",
                "gardenname": "",
                "parentphone": "",
                'crid': ''
            };
            this.isAgain = true;
            this.gitUP = false;
        },
        // 回退一步
        back() {
            window.history.back(-1);
        },
        // 搜索框 取消
        cancel() {
            this.iscall = false;
        },
        // 点击之后弹出搜索框并聚焦
        call() {
            if (!!this.token) {
                this.iscall = true;
                this.$broadcast('auto');
            }
        },
        // 未登录用户在 绑定子女页面点击时触发提示
        noToken(){
            if (!this.token) {
                this.show1 = true;
            }
        },
        // 搜索框下拉框显示的信息 
        resultClick(item) {
            obj = {};
            this.iscall = false;
            this.values = item.title;
            obj.cid = item.id;
            SetAjax('post', GetGardenClassList, {
                    gid: item.id,
                    'flor_token':this.token
                },
                (response) => {
                    var a = response.data;
                    // console.log(a);
                    if (a) {
                        var tmp = {};
                        tmp.key = a[0].id;
                        tmp.value = a[0].crname;
                        // console.log(tmp);
                        this.classList.push(tmp);
                    } else {
                        this.classList = [];
                    }
                }, (response) => {

                });
            // console.log(item);
        },
        getResult(val) {
            this.results = val ? getResult(this.value) : [];
            // console.log(this.results);
        },
        // 存储子女生日
        birth(val) {
            this.childList.birthday = val;
        },
        // 
        onChange(val) {
            this.childList.crid = val;
        },
        // 获取子女信息
        getUserChild: function() {
            if (!!this.token) {
                this.$http.post(GetUserChild,{'flor_token':this.token}).then(
                    (r) => {
                        // console.log(r.body);
                        // 子女信息不为 空
                        if (r.body != null && r.body.length!=0) {
                            this.childList = r.body[0];
                            // 子女审核状态为 2 时 显示重新提交的页面信息
                            if (this.childList.staus=='2') {
                                this.gitUP =true;
                                this.isAgain = true;
                            // 子女审核状态为 0 时 显示等待审核的页面信息

                            }else if (this.childList.staus =='0') {
                                this.isAgain = false;
                                this.zero = true;
                            // 子女审核状态为 1 时 显示通过审核提交的页面信息

                            }else if (this.childList.staus =='1') {
                                this.isAgain = false;
                                this.zero = false;
                            }
                            // 当初次进入时显示
                        } else{
                            this.isAgain = true;
                            this.gitUP = false;
                        }
                        // console.log(this.childList); //staus  0未审核 1审核通过 2驳回
                    });
            }
        },
        // 提交绑定子女信息
        push() {
            
            obj.crid = this.childList.crid;
            obj.nickname = this.childList.nickname;
            obj.parentname = this.childList.parentname;
            obj.parentphone = this.childList.parentphone;
            obj.birthday = this.childList.birthday;
            // console.log(obj);
            // 判断子女信息是否为空 不能提交空信息
            for (var o in obj) {
                if (obj[o] == undefined) {
                    this.show1 = true;
                    return;
                }
            }
            // 验证电话号码
            if (!(/^1[34578]\d{9}$/.test(obj.parentphone))) {
                this.show1 = true;
                return;
            }
            SetAjax('post', SetUserChild, {
                data: obj,
                'flor_token':this.token
            }, (response) => {
                // 提交成功 返回 success
                if (response.data) {
                    this.show = true;
                    this.isAgain = false;
                    this.gitUP = true;
                    this.zero = true;
                    // console.log(this.childList);
                }
            }, (response) => {
                console.log('error')
            });
              // setTimeout(function(){
              //    this.getUserChild();
              // },720000)
        }
    }
}
// 搜索下拉框 使用方法
function getResult(val) {
    let rs = []
    SetAjax('post', URL_GET_GardenLIST, {
        select: {
            name: val
        }
    }, (response) => {
        console.log(response);
        if (response.data) {
            response.data.forEach(function(c) {
                // console.log(c);
                rs.push({
                    title: `${c.gardenname}`,
                    id: c.id
                })
            });
        }
        // rs.push(response.data);
    }, (response) => {});
    return rs
}
</script>
<style scoped>
.gmybb{
    font-size: 2rem;
    font-weight: bold;
}
.mybb_left {
    position: absolute;
    top: 1rem;
    left: 1.4rem;
    width: 1rem;
    height: 2rem;
    background: url('../assets/back@1x_0.png') no-repeat;
}
</style>
