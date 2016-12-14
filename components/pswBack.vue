<template>
    <div>
        <group>
            <x-input title='手机号' placeholder="请输入手机号" :max="11" :min="11" keyboard="number" name="mobile" :value.sync='user.phone' is-type="china-mobile"></x-input>
            <x-input title='新密码' :value.sync='user.newpassword' :max="18" :min="6" type="password"></x-input>
            <x-input title='重复密码' :equal-with='user.newpassword' :max="18" :min="6" type="password"></x-input>
            <x-input title="手机验证码:" placeholder='请输入验证码' :value.sync="mark">
                <x-button mini type='primary' text='获取验证码' @click='gain'></x-button>
            </x-input>
        </group>
    </div>
    <toast :show.sync="show" width='50%' type="text">
        <p style="text-align:center;color:#fff;font-size:1.2rem;">{{msg}}</p>
    </toast>
</template>
<script>
import {
    Group,
    XInput,
    XButton,
    Toast
} from 'vux/src/components'
import {
    SetAjax,
    setCookie
} from './setAjax.js';
import {
    PasswordRecovery,
    URL_GET_UserInfo,
    GetSignins,
    PasswordBackSMS
} from './api.js'
export default {
    components: {
        Group,
        XInput,
        XButton,
        Toast
    },
    data() {
        return {
            user: {
                phone: '',
                newpassword: ''
            },
            Code: '',
            mark: '',
            msg: '',
            show: false
        }
    },
    events: {
        'psBack': function() {
            // console.log(this.user);
            // console.log(this.user.password.length);
            // (?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}
            if ((/[^0-9a-zA-Z_]{6,18}/.test(this.user.newpassword))) {
                //验证 密码长度 为 6~18位
                this.$dispatch('Exists', 'psw');
            } else {
                // console.log('psw');
                if (!(/^1[34578]\d{9}$/.test(this.user.phone))) {
                    //验证电话号码长度为 11位
                    this.$dispatch('Exists', 'num');
                } else {
                    if (this.Code == this.mark && this.mark != '') {
                        //验证手机短信验证码
                        SetAjax('post', PasswordRecovery, {
                            data: this.user
                        }, (r) => {
                            if (r.data == "newpassword is null") {
                                this.msg = '亲，密码不能为空！';
                                this.show = true;
                            } else {
                                this.msg = '快去用新密码登陆吧！'
                                this.show = true;
                                clearTimeout(goback);
                                var goback = setTimeout(() => {
                                    this.$router.go('/register/login');
                                }, 2000);
                            }

                        }, (r) => {

                        });
                    } else {
                        this.$dispatch('show4');
                    }
                }
            }
        }
    },
    methods: {
        gain(e) {
            this.Code = Date.now().toString().slice(-4);
            this.$http.post(PasswordBackSMS, {
                'data': {
                    'phone': this.user.phone,
                    'code': this.Code
                }
            }).then((response) => {
               // console.log(response);
                if (response.data == "Unregistered telephone number"){
                    this.show = true; 
                    this.msg = '亲，这个号码还没注册呢'
                }});
                e.target.innerText = 60;
                e.target.disabled = true;
                e.target.style.background = 'green';
                e.target.style.color = '#eee';
                let tid = setInterval(()=>{
                    e.target.innerText -= 1;
                },1000);
                console.log(1)
                setTimeout(()=>{
                    clearInterval(tid);
                    e.target.innerText = '获取手机验证码';
                    e.target.disabled = false;
                    e.target.style.color = 'black';
                    e.target.style.background = '#04BE02';
                },60000);
        },
    }

}
</script>
<style>
</style>
