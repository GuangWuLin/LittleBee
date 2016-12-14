<!-- garden home -->
<template>
    <div class="bPic">
    </div>
    <tab :line-width=2 active-color='#fc378c' :index.sync="index" v-show="mark=='asTeacher'">
      <tab-item class="vux-center" :selected="demo2 === index" v-for="(index,item) in list2" @click="demo2 = item">{{index}}</tab-item>
    </tab>
    <swiper :index.sync="index" height="100px" :show-dots="false">
      <swiper-item v-for="(index,item) in list2">
        <div class="gCenter tab-swiper vux-center">
            <a href="javascript: ;" @click="goPhoto(item)">
                <div class="gB1"></div>
                <span v-show="mark=='asTeacher'">上传照片</span>
                <span v-show="mark=='asUser'">查看照片</span>
            </a>
            <a href="javascript: ;" @click="goAction(item)">
                <div class="gB2"></div>
                <span v-show="item[0]=='班主任'">编辑活动</span>
                <span v-else>查看活动</span>
            </a>
            <a href="javascript: ;" v-link="{path:'/gIndex/examine/'+item[1]}" v-if="item[0]=='班主任'">
                <div class="gB3"></div>
                <span>审核信息</span>
            </a>
        </div>
      </swiper-item>
    </swiper>
    <div class="gInfo">
        <div class="gTitle">园区简介</div>
        <!-- {{ garden | json }} -->
        <div class="gIntro" v-if="mark=='asTeacher'">{{garden.teacher[0].intro}}</div>
        <div class="gIntro" v-else>{{garden.user[0].intro}}</div>

    </div>
</template>
<script>
import { Tab,TabItem,Swiper,SwiperItem } from 'vux/src/components';
export default {
    components:{
        Tab,
        TabItem,
        Swiper,
        SwiperItem
    },
    vuex: {
        getters: {
            garden: state => state.gardenInfo,
            mark: state => state.mark
        }
    },
    data(){
        return{
            list2:{},
            index:0,
            demo2:'草草班2'
        }
    },
    events:{
      'boom':function(){
        // console.log('U mom boom');
        // console.log(this.garden);
        this.$store.dispatch('GARDEN_INFO',this.garden,'asTeacher');
        this.$set('list2',this.garden.teacher.role);
        this.$nextTick(()=>{
          // console.log(this.list2);
        });
        // console.log(this.mark);
      }
    },
   methods:{
        // 进入班级活动页面
        goAction(item){
            this.$store.dispatch('CLASS_ID',item);
            this.$router.go('/gIndex/gAction');
        },
        // 进入班级相册
        goPhoto(item){
            this.$store.dispatch('CLASS_ID',item);
            // 老师权限进入创建相册页面  普通用户权限进入相册页面
            this.mark =='asTeacher'?this.$router.go('/gIndex/photos'):this.$router.go('/gIndex/photo');
        }
    },
    route:{
        data(t){
            // console.info(this.garden);
            this.$set('list2',this.mark=='asTeacher'?(this.garden.teacher?this.garden.teacher.role:{}):{'a':'家长'});
            // console.warn(10086)
            t.next();
        }
    }
}
</script>

<style scoped>
.bPic {
    margin-top: 1rem;
    background: url('../assets/garden_gpic@1x_0.png') no-repeat;
    background-position-y: -1em;
    background-size: 100%;
    width: 100%;
    height: 20rem;
}

.gCenter {
    margin-top: 1rem;
    width: 100%;
    height: 5.5rem;
    display: flex;
    justify-content: space-around;
    background: #fff;
    padding-bottom: .5rem;
}

.gCenter a {
    width: 120px;
    text-align: center;
    padding-top: 2px;
    color: #333;
}

.gCenter span {
    font-size: .8333rem;
}

.gCenter div {
    width: 4rem;
    height: 4rem;
    margin: auto;
}

.gCenter .gB1 {
    background: url('../assets/garden_pic@1x_0.png') no-repeat;
    background-position: 4px;
}

.gCenter .gB2 {
    background: url('../assets/garden_action@1x_0.png') no-repeat;
    background-position: 4px;
}

.gCenter .gB3 {
    background: url('../assets/garden_look@1x_0.png') no-repeat;
    background-position: 4px;
}

.gInfo {
    display: flex;
    flex-direction: column;
    align-content:center;
    /*margin-top: 1rem;*/
    background: #fff;
    padding-bottom: .5rem;
    margin-bottom: 10rem;
}

.gTitle {
    padding-top: .5rem;
    text-align: center;
    font-size: 1.6rem;
}
.gIntro{
    width: 90%;
    margin: auto;
    text-indent: 2em;
    /*border: 1px solid #f95377;*/
    font-size: 1.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
