<template>
	<div class="wrap">
		<h3 class="title">
			<span class="tag" @click.stop="hidePop($event)">{{cancel_txt}}</span>
			<span class='finish_tip' @click.stop="setBirth($event)">{{finish_tip}}</span>
		</h3>
		<!--选择属性-->
		<div class="flex_container">
			<div class="flex_item">
				<Picker :items="date_range.year_list" :initValue="initYear" :currentValue.sync="showYear">
				</Picker>
			</div>
			<div class="flex_item">
				<Picker :items="date_range.month_list" :initValue="initMonth" :currentValue.sync="showMonth">
				</Picker>
			</div>
			<div class="flex_item">
				<Picker :items="date_range.day_list" :initValue="initDay" :currentValue.sync="showDay">
				</Picker>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import Picker from '@/components/common/picker/Picker'
	export default{
		components:{
			Picker
		},
		data(){
			return {
				cancel_txt:'取消',
				finish_tip:'完成',
				date_range:{
					year_list:[],
					month_list:[],
					day_list:[]
				},
				initYear:null,  //初始值
				initMonth:null,
				initDay:null,
				showYear:'',
				showMonth:'',
				showDay:''
			}
		},
		watch:{
			showYear(val){
				const index = parseInt(val)
			},
			showMonth(val){
				const index = parseInt(val)
			},
			showDay(val){
				const index = parseInt(val)
				{
					switch(parseInt(this.showMonth) + 1){
						case 2:
							if(this.isLeapYear(parseInt(this.showYear))){
								this.valDays(29)
							}else{
								this.valDays(28)
							}
							break
						case 4:
						case 6:
						case 9:
						case 11:
							this.valDays(30)
							break

					}
				}
			}
		},
		mounted(){
			this.getInitVal()
		},
		methods:{
			//天数判断 是闰年还是平年
			isLeapYear(year){
				if(isNaN(year)){
					return year
				}
				return (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)
			},
			valDays(days){
				const day_list = []
				for(let i = 1; i <= days; i++){
					day_list.push(i)
				}
				this.$set(this.date_range,'day_list',day_list) //动态设置里面的天数
			},
			getInitVal(){
				const date = new Date()
				for(let i = 1900; i <= date.getYear() + 1900; i++){
					this.date_range.year_list.push(i)
				}
				for(let i = 1; i <= 12; i++){
					this.date_range.month_list.push(i)
				}
				for(let i = 1; i <= 31; i++){
					this.date_range.day_list.push(i)
				}
				this.initYear = date.getYear()
				this.initMonth = date.getMonth()
				const vm  = this
				//天数涉及 多次计算 放入异步队列里面进行处理
				setTimeout(function(){
					vm.initDay = date.getDate() - 1
				},300)
			},
			hidePop(e){
				this.$emit('setBabyBirthPanel',false)
			},
			setBirth(e){
				let [year,month,day] = [parseInt(this.showYear)+1900,parseInt(this.showMonth)+1, parseInt(this.showDay) + 1]
				month = month < 10 ? '0' + month : month
				day = day < 10 ? '0' + day :day
				this.$emit('setBirth',`${year}-${month}-${day}`)
				//this.hidePop(e)
			}
		}
	}
</script>
<style type="text/css" scoped>
	.title{
		padding: 1rem 2rem;
		line-height: 4rem;
		border-bottom:.1rem solid rgb(245,245,245);;
	}
	.finish_tip{
		float:right;
		color:red;
	}
	.flex_container{
		display: -webkit-flex;
		padding:0 4rem;
	}
	.flex_item{
		flex:1;
	}
</style>
