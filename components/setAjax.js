import Vue from 'vue';
import App from '../App';
import { deleteImgUrl, downLoadUrl, bucket } from './api.js'
export const SetAjax = function(type, url, data, successCallback, errorCallback) {
    if (type != "post") {
        var cookie = 'sadfasdasdasdasdsad';
        if (!data) {
            data = { 'flor_token': cookie };
            // console.log('get请求中！');
        } else {
            // console.log('post请求中!');
            data.flor_token = cookie;
        }
        Vue.http[type](url, data)
            .then(successCallback, errorCallback);
        // console.log('Please wait a minute');
    } else {
        Vue.http[type](url, data)
            .then(successCallback, errorCallback);
        // console.log('Please wait a minute');
    }
};

// 七牛获取cookie
/*export let getCookie = function(str) {
        var arr, reg = new RegExp("(^| )" + str + "=([^;]*)(;|$)", "gi");
        if (arr = reg.exec(document.cookie))
            return arr[2];
        return null;
    }*/
    /*
    export let setCookie = function(){

    }
    export let deleteCookie = $(function(){
    })*/
    //七牛上传图片
export let uploader = function(url, bucket, key, callback) {
    var _key = key;
    var _callback = callback;
    //console.log(url);
    Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'pickfiles', //上传选择的点选按钮，**必需**
        uptoken_url: url, //Ajax请求upToken的Url，**强烈建议设置**（服务端提供,若未指定uptoken_url,则必须指定 uptoken
        unique_names: false, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
        save_key: false,
        domain: bucket, //bucket 域名，下载资源时用到，**必需**
        get_new_uptoken: true, //设置上传文件的时候是否每次都重新获取新的token
        container: 'container', //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '100mb', //最大文件体积限制
        //flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: false, //开启可拖曳上传
        drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                    // 文件添加进队列后,处理相关的事情
                });
            },
            'BeforeUpload': function(up, file) {
               if (/u/g.test(_key)) {
                        Vue.http.post(deleteImgUrl,{key:_key}).then(
                            (r) => {
                                // console.log(r);
                            },
                            (r) => {
                            }
                        );
                    }
                // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时,处理相关的事情
            },
            'FileUploaded': function(up, file, info) {
               if (/u/g.test(_key)) {
                        _callback(_key);
                    }else{
                        _callback();
                    }
            },
            'Error': function(up, err, errTip) {
                // console.log("上传失败");
                alert('连接服务器超时！');
                //上传出错时,处理相关的事情
            },
            'UploadComplete': function() {
                //队列文件处理完毕后,处理相关的事情
            },
            'Key': function(up, file) {
              if (/u/g.test(_key)) {
                        var key = _key;
                    }else{
                        var key = _key + (new Date()).getTime();
                    }
                    // console.log(key);
                    return key
            }
        }
    })
}

//获取图片(key)列表
export let getImgList = function(url, data, arr) { //data => {"key":this.key},arr => _this.imgList
    //console.log({"key":this.key});
    if (this.key != '') {
        this.$http.post(url, data).then(
            (r) => {
                let _this = this;
                r.json().forEach(function(c) {
                    arr[c] = 'http://' + bucket + '/' + c + '?imageView2/2/h/150';
                });
                this.downLoadImg();
            },
            (r) => {

            }
        )
    }
}
export let downLoadImg = function(url, data, obj) { //data => {'data':this.imgList},obj=>this.downImg
    this.$http.post(url, data).then(
        (r) => {
            // console.log(this.imgList)
            obj = r.json();
            // console.log(this.downImg)
        },
        (r) => {

        }
    )
}
export let setCookie = function(c_name,str){
    // var exdate = new Date();
    // exdate.setDate(exdate.getDate()+expiredays*1);
    // document.cookie=c_name+ "=" + str +
    // ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
    // // console.log(str);
    var ls = localStorage.getItem(c_name);
    if (ls != '') {
        localStorage.removeItem(c_name);
        localStorage.setItem(c_name,str);
    }else{
        localStorage.setItem(c_name,str);
    }
}

export let getCookie = function(c_name){
    return localStorage.getItem(c_name);
}
// export let getLocation = function(){
//     //定位数据获取成功响应
//     var onSuccess = function(position) {
//         // alert('纬度: '          + position.coords.latitude          + '\n' +
//         //       '经度: '         + position.coords.longitude         + '\n' +
//         //       '海拔: '          + position.coords.altitude          + '\n' +
//         //       '水平精度: '          + position.coords.accuracy          + '\n' +
//         //       '垂直精度: ' + position.coords.altitudeAccuracy  + '\n' +
//         //       '方向: '           + position.coords.heading           + '\n' +
//         //       '速度: '             + position.coords.speed             + '\n' +
//         //       '时间戳: '         + position.timestamp                + '\n');
//         // 'X':30.947973;
//         // 'Y':105.067655
//         App.store.dispatch('DISTANCE',{'X':position.coords.longitude,'Y':position.coords.latitude});
//     };
//     //定位数据获取失败响应
//     function onError(error) {
//       App.store.dispatch('DISTANCE',{});
//     }
//     //开始获取定位数据
// }
export let getLocation = function(data){
    var onSuccess = function(position) {
        // console.info('success')
        App.store.dispatch('DISTANCE',{'X':position.coords.longitude,'Y':position.coords.latitude});
    };
    //定位数据获取失败响应
    function onError(error) {
        // console.warn('fail')
      App.store.dispatch('DISTANCE',{});
    }
    //开始获取定位数据
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    // 监听位置
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError);
    data && navigator.geolocation.clearWatch(watchID);
}
//cordova 获取
