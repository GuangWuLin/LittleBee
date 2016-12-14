<!-- photo photos store usersetting index有修改 -->
<template>
    <div class="box-header" id="container" v-if="mark=='asTeacher'">
        <x-button id="pickfiles" text='添加图片' style="background-color: rgba(204,204,204,0.2);color:#999;" mini></x-button>
    </div>
    <div class="allPic">
        <flexbox :gutter="0" wrap="wrap">
            <flexbox-item v-for="(index,pic) in downImg | orderBy 'index' -1" style="margin:auto;text-align:center;padding-top:.5rem;" :span="1/2">
                <img :src="pic" style="display:block;width:150px;height:150px;margin:auto;" @click='openModel(index)'>
                <x-button text="查看" mini @click='openModel(index)'></x-button>
                <x-button text="删除" mini @click='closeModel(index)' type='warn' v-show="mark=='asTeacher'"></x-button>
            </flexbox-item>
        </flexbox>
    </div>
    <p v-if='downImg' style="font-size:2rem;color:gold;text-align:center;">暂时没有照片哟，等待老师上传吧！</p>
    <dialog :show.sync="showNoScroll" class="dialog-demo" :scroll="false" @click="showNoScroll=false,show=false">
        <div class="img-box"  @click.stop="show=true">
            <img :src="imgModal.url" style="max-width:100%" >
        </div>
        <!-- <span @click="showNoScroll=false">关闭</span> -->
    <popup :show.sync="show" height="10%">
      <div class="popup0" @click="download(imgModal.url) ">
        <p>保存照片</p>
      </div>
    </popup>
    </dialog>
   
</template>
<script type="text/javascript">
import {
    XButton,
    Dialog,
    Flexbox,
    FlexboxItem,
    Popup
} from 'vux/src/components';
import {
    getUpLoadTokenUrl,
    deleteImgUrl,
    bucket,
    getImageListUrl,
    downLoadUrl
} from './api.js';
import {
    uploader
} from './setAjax.js';
export default {
    components: {
        XButton,
        Dialog,
        Flexbox,
        FlexboxItem,
        Popup
    },
    route: {
        data(t) {
            // console.warn(this.mark)
             this.$set('key','c'+this.classID[1]+'/'+this.address+'/');
            this.$set('downImg',{});
            // console.error(this.key)
            this.$nextTick(function() {
                // console.log(this.key);
                uploader(getUpLoadTokenUrl, bucket, this.key, this.getImgList);
                // console.log(this.key);
                this.getImgList();
                t.next();
            });
        }
    },
    vuex:{
        getters:{
            mark:state=>state.mark,
            address:state=>state.address,
            classID:state=>state.class_id

        }
    },
    data() {
        return {
            key: 'c/', //key值设置为 c/address
            imgList: {},
            downImg: {},
            imgModal: {},
            showNoScroll: false,
            isDelete: false,
            show: false
        }
    },
    methods: {
        // 下载图片到本地
        download(src){
            var $a = $("<a></a>").attr("href", src).attr("download", "");
            $a[0].click();
            this.showNoScroll = false;
            this.show = false;
        },
        // 获取所有图片列表
        getImgList: function() {
            this.$http.post(getImageListUrl, {
                key: this.key
            }).then((response) => {
                // console.log(response.body);
                let _this = this;
                if (response.body.length > 0) {
                    response.body.forEach(function(c) {
                        _this.imgList[c] = 'http://' + bucket + '/' + c + '?imageView2/2/h/100/w/100';
                    });
                    this.downLoadImg();
                }
            });
        },
        // 获取图片
        downLoadImg: function() {
            this.$http.post(downLoadUrl, {
                'data': this.imgList
            }).then(
                (r) => {
                    // console.log(this.imgList)
                    this.downImg = r.body;
                    // console.log(this.downImg)
                })
        },
        // 打开模态框
        openModel(index) {
            // console.log(index);
            this.showNoScroll = true;
            this.$http.post(downLoadUrl, {
                'data': {
                    'url': 'http://' + bucket + '/' + index + '?'
                }
            }).then((response) => {
                // console.log(response.body);
                this.imgModal = response.body;
                // console.log(this.imgModal);
            });
        },
        // 关闭模态框
        closeModel(index) {
            // console.log(index);
            this.show=true;
            // this.deleteKey = index;
            this.$http.post(deleteImgUrl, {
                'key': index
            }).then((response) => {
                // console.log(response);
                this.$set('downImg', {});
                this.$set('imgList', {});
                this.getImgList();
            });
        }
    }
}
</script>
<style type="text/css" scoped>
.img-box {
    overflow: hidden;
}

.flex-demo {
    text-align: center;
    color: #fff;
    background-color: #20b907;
    margin-bottom: 8px;
    border-radius: 4px;
    -webkit-background-clip: padding-bottom;
}

.allPic {
    margin-top: 46px;
    background: #fff;
}

.box-header {
    width: 100%;
    z-index: 999;
    position: absolute;
    padding: .5rem;
    background: #fff;
}

</style>
