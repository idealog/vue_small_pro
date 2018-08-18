<template>
	<div>
		 <div class="wrapper">
	        <div class="container">
	            <div class="base_lists">
	                <ul v-infinite-scroll="getList" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
						<li class="item"  v-for ="item in list">
							<div class="date">
								<span>{{getTime(item.updatetime)}}</span>
							</div>
							<div class="question">
								<div style="float:left">
									<img style="height:2rem" :src="pic_url"></div>
								<div class="left-angle"></div>
								<div class="context">
									<span class="content">{{item.action_info.human || "....."}}</span>
								</div>
								<div class="clearfix"></div>
							</div>
							<div class="answer">
								<div class="context"><span class="content">{{item.action_info.machine || item.action_info.title || "....."}}</span></div>
								<div class="right-angle"></div>
								<div style="float:right">
									<img style="height:2.3rem" :src="robot_pic_url">
								</div>
								<div class="clearfix"></div>
							</div>
						</li>
	                </ul>
	                <Loading :show="loading"></Loading>
	            </div>
	        </div>
            <div v-if = "no_data" v-cloak style="margin-bottom:2rem">
                <h4 style="text-align:center;margin-top:2rem">没有数据了</h4>
           </div>
	    </div>
	</div>
</template>
<script type="text/javascript">
	import Loading from '@/components/loading/Loading'
	export default{
		name:'FootPrint',
		components:{
			Loading
		},
		data(){
			return {
				list:[],
				page:1,
				loading:false,
				haveMore:true,
                pic_url:'',
                robot_pic_url:'',
                device_id:'',
                no_data:''
			}
		},
        created(){
            const openid = this.$route.query.openid
            this.getMember(openid)
            this.getRobotPic(openid)
        },
		methods:{
            getRobotPic:function(openid){
                const This = this
                this.getBasicInfo(openid).then(res => {
                    if(res){
                        This.robot_pic_url = res.pic_url
                        This.device_id = res.device_id
                    }
                })
            },
            getMember:function(openid){
                const This = this
                this.axios.get(`${this.HOST}/api/v1/relation/getMemberList?openid=${openid}`)
                .then(res => {
                      if(res.data && res.data.data){
                         const arr = res.data.data
                         arr.map(item => {
                            if(item.openid === openid){
                                This.pic_url = item.headimgurl
                            }
                         })
                      } 
                });
            },
			getList:function(){
				const device_id = JSON.parse(sessionStorage.getItem("device_info")).data.device_id
                console.log(device_id)
				let host = this.PUBLIC_HOST;
        		let This = this;
        		let param = {
        			kq_id:this.KQ_ID,
        			device_id:device_id,
        			page:this.page++
        		};
        		if(!this.haveMore){
        			return
        		}
                this.loading = true
        		this.axios({
                  method:'get',
                  url:host + 'api/device/behavior/dialog/list',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                	if(response.data.data.length === 0){
                		This.haveMore = false
                	}
                	This.list = [...This.list,...response.data.data]
                    if(This.list.length === 0){
                        This.no_data = true
                    }
                	This.loading = false
        		});
			},
			getTime:function(time){
				const date = new Date(time)
				const year = date.getYear() + 1900
				const month = date.getMonth() + 1
                const day = date.getDate()
                let hours = date.getHours()
                hours = hours > 10 ? hours : '0' + hours
                let minutes = date.getMinutes()
                minutes = minutes > 10 ? minutes : '0' + minutes
                let seconds = date.getSeconds()
                seconds = seconds > 10 ? seconds : '0' + seconds
                return year + '年' + month + '月' + day + '日' + hours + ":" + minutes + ":" + seconds
			}
		}
	}
</script>
   <style type="text/css" scoped>
    body {
            background: rgb(245, 245, 245);
        }

        .container {
            padding-left: 1rem;
            padding-right: 1rem;
        }

        .date {
            text-align: center;
            padding: .5rem;
            font-size: 1.4rem;
        }

        .date span {
            color:white;
            font-size: 1rem;
            padding:.2rem;
            background: darkgray;
        }

        .answer {
            padding: .8rem;
        }

        .question {
            padding: .8rem;
        }

        .wrapper {
            overflow: hidden;
        }

        .content {
            text-align: right;
            font-size: 1.4rem;
            line-height: 2rem;
        }

        .clearfix {
            clear: both;
        }

        .question .context {
            margin-left: 2.8rem;
            width: 55%;
            border: 1px solid #eee;
            padding-left: 6px;
            border-radius: 3px;
            background: white;
            padding-top: .5rem;
            padding-bottom: .5rem;
        }

        .answer .context {
            width: 60%;
            float: left;
            margin-left: 30%;
            border: 1px solid rgb(158, 234, 106);
            border-radius: 3px;
            background: rgb(158, 234, 106);
            padding-left: 5px;
            padding-top: .5rem;
            padding-bottom: .5rem;
        }

        @media screen and (min-width: 375px) and (max-width: 400px) {
            .answer .context {
                width: 60%;
                float: left;
                margin-left: 30%;
                border: 1px solid rgb(158, 234, 106);
                border-radius: 3px;
                background: rgb(158, 234, 106);
                padding-left: 5px;
                padding-top: .5rem;
                padding-bottom: .5rem;
            }
        }

        @media screen and (min-width: 400px) {
            .answer .context {
                width: 60%;
                float: left;
                margin-left: 30%;
                border: 1px solid rgb(158, 234, 106);
                border-radius: 3px;
                background: rgb(158, 234, 106);
                padding-left: 5px;
                padding-top: .5rem;
                padding-bottom: .5rem;
            }
        }

        @media screen and (width: 768px) {
            .answer .context {
                width: 60%;
                float: left;
                margin-left: 34.5%;
                border: 1px solid rgb(158, 234, 106);
                border-radius: 3px;
                background: rgb(158, 234, 106);
                padding-left: 5px;
                padding-top: .5rem;
                padding-bottom: .5rem;
            }
        }

        @media screen and (width: 1024px) {
            .answer .context {
                width: 60%;
                float: left;
                margin-left: 36%;
                border: 1px solid rgb(158, 234, 106);
                border-radius: 3px;
                background: rgb(158, 234, 106);
                padding-left: 5px;
                padding-top: .5rem;
                padding-bottom: .5rem;
            }
        }

        .left-angle {
            position: absolute;
            border: 1px solid #eee;
            width: 5px;
            height: 5px;
            display: inline-block;
            margin-top: 8px;
            margin-left: 5px;
            transform: rotate(45deg);
            border-right: none;
            border-top: none;
            background: white;
        }

        .right-angle {
            position: absolute;
            border: 1px solid rgb(158, 234, 106);
            width: 5px;
            height: 5px;
            display: inline-block;
            margin-top: 8px;
            margin-left: -3px;
            transform: rotate(45deg);
            border-left: none;
            border-bottom: none;
            background: rgb(158, 234, 106);
        }
        .rl_more {
            height: 7rem;
            text-align: center;
            line-height: 7rem;
            font-size: 1.6rem;
        }
    </style>