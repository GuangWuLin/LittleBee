<!-- 注册组件 -->
<template>
    <div>
        <group>
            <x-input title='账号:' placeholder="输入手机号" :max="11" :min="11" keyboard="number" name="mobile" :value.sync='user.phone' is-type="china-mobile"></x-input>
            <x-input title='密码:' :value.sync='user.password' :max="18" :min="6" type="password" placeholder="输入密码"></x-input>
            <x-input title='重复密码:' :equal-with='user.password' :show-clear="false" :max="18" :min="6" type="password" placeholder="再次输入密码"></x-input>
            <x-input title='手机验证码:' placeholder='输入验证码' :value.sync='mark' require keyboard="number">
                <x-button text='获取手机验证码' type='primary' mini @click='gain' style="margin:1rem auto;"></x-button>
            </x-input>
        </group>
    </div>
</template>
<script type="text/javascript">
import {
    SetAjax,
    setCookie
} from './setAjax.js';
import {
    login,
    register,
    URL_GET_UserInfo,
    GetSignins,
    shorMsgCode
} from './api.js'

import {
    Group,
    XInput,
    Cell,
    XButton
} from 'vux/src/components'
export default {
    components: {
        Group,
        XButton,
        XInput,
        Cell
    },
    events: {
        'reg': function() {
            // console.log(this.user);
            // console.log(this.user.password.length);
            // (?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}
            if ((/[^0-9a-zA-Z_]{6,18}/.test(this.user.password))) {
                //验证 密码长度 为 6~18位
                this.$dispatch('Exists', 'psw');
            } else {
                // console.log('psw');
                if (!(/^1[34578]\d{9}$/.test(this.user.phone))) {
                    //验证电话号码长度为 11位
                    this.$dispatch('Exists', 'num');
                } else {
                    if (this.Code == this.mark && this.mark!='') {
                        //验证手机短信验证码
                        console.log({
                            data: this.user
                        });
                        SetAjax('post', register, {
                            data: this.user
                        }, (response) => {
                            // console.log(response);
                            if (response.data == false) {
                                // 验证是否 注册失败
                                this.$dispatch('show1', 'false');
                            } else if (response.data == 'exists') {
                                //验证是否 已存在
                                this.$dispatch('show1', 'exists');
                            } else {
                                //注册成功
                                // console.log('恭喜你注册成功！！！！');
                                // console.log(response.data);
                                setCookie('token',response.data);
                                // 注册成功之后 获取用户信息和签到信息
                                this.$http.post(URL_GET_UserInfo,{'flor_token':response.data}).then((r)=>{
                                    // console.log(r);
                                    this.$store.dispatch('OPEN_LOADING',r.data[0]);
                                },(r)=>{
                                    // console.log(r);
                                });
                                this.$http.post(GetSignins,{'flor_token':response.data}).then((r)=>{
                                    // console.log(r)
                                    this.$store.dispatch('TO_SIGN',r.data[0]);
                                },(r)=>{
                                    // console.log(2);
                                });
                                this.$dispatch('show');
                            }
                        }, (response) => {

                        });
                    }else{
                        this.$dispatch('show4');
                    }
                }
            }
        }
    },
    methods: {
        gain(e) {
            for(o in this.user){
                this.user[o] || (()=>{
                    this.$dispatch('Exists','num');// 用户手机号或密码不得为空
                    return;
                })();
            }
            // console.log(typeof e.target.innerText)
            this.Code = Date.now().toString().slice(-4);

            // console.log(e.target.innerText);
            if(/^1[34578]\d{9}$/.test(this.user.phone)){
                this.$http.post(shorMsgCode,{'data': {'phone':this.user.phone,'code':this.Code}}).then((r)=>{});
                e.target.innerText = 60;
                e.target.disabled = true;
                e.target.style.background = 'grey';
                let tid = setInterval(()=>{
                    e.target.innerText -= 1;
                },1000);
                console.log(1)
                setTimeout(()=>{
                    clearInterval(tid);
                    e.target.innerText = '获取手机验证码';
                    e.target.disabled = false;
                    e.target.style.background = '#04BE02';
                },60000);
            }else{
                this.$dispatch('Exists', 'num');
            }

        },
    },
    data() {
        return {
            Code: '',
            mark: '',
            user: {
                phone: '',
                password: ''
            },
            count:0
        }
    }
}
</script>
