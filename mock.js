import Json from './Json' //测试用数据

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

const json = type => {
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

/**
 * 百度经纬度装高德
 * @param {Number} bd_lat - 经度  
 * @param {Number} bd_lng - 纬度  
 */
const bdToGaoDe=(bd_lat,bd_lng)=>{
	var X_PI = Math.PI * 3000.0 / 180.0;
	var x = bd_lng - 0.0065;
	var y = bd_lat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
	var gg_lng = z * Math.cos(theta);
	var gg_lat = z * Math.sin(theta);
	return {lng: gg_lng, lat: gg_lat}
}

export {
	msg,
	json,
	prePage,
	bdToGaoDe
}