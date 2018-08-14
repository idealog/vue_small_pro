import axios from 'axios'
import Path from './path'
//利用axios封装ajax 如果想要更加丰富的ajax 需要写出原生的ajax方法
const requestAjaxData = (url = '' , params = {}, method = 'get') => {
	switch(method){
		case 'get':
			return axios({url,params,method})
			break
		case 'post':
			const data = params
			return axios({url,data,method})
	}
}

export const getCategoryList = (page = 1, limit = 100) => {
	return requestAjaxData(Path.getCategoryList, {page,limit}, 'get')
}

