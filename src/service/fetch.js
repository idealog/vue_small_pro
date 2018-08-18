
export{
	fetch:async(url='',data={},type="GET" ) => {
	let HOST
	if(process.env.NODE_ENV === 'development'){
		HOST = '/data_api' ;
	}else{
		HOST = '/angry_birds';
	};
	url = `${HOST}${url}`
	if(window.fetch){
		if(type === "GET"){
			let temp = []
			Object.keys(data).forEach(key => {
				temp.push(key + "=" + data[key])
			})
			url = url + "?" + temp.join('&')
		}
		let config = {
			credentials: 'include',
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: "cors",
			cache: "force-cache"
		}
		if (type == 'POST') {
			Object.defineProperty(config, 'body', {
				value: JSON.stringify(data)
			})
		}
		try {
			const response = await fetch(url, config);
			const responseJson = await JSON.parse(response);
			return responseJson
		} catch (error) {
			throw new Error(error)
		}
	}else{
		return new Promise((resolve, reject) => {
			let requestObj;
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				requestObj = new ActiveXObject;
			}

			let sendData = '';
			if (type == 'POST') {
				sendData = JSON.stringify(data);
			}
			requestObj.open(type, url, true);
			requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			requestObj.send(sendData);
			requestObj.onreadystatechange = () => {
				if (requestObj.readyState == 4) {
					if (requestObj.status == 200) {
						let obj = requestObj.response
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj)
					} else {
						reject(requestObj)
					}
				}
			}
		})
	}
}
} 
