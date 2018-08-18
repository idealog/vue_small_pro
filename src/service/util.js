export const formateTime = (seconds) => {
	if(!isNaN(seconds)){
		return seconds;
	}
	if (seconds > -1) {
	    let hour = Math.floor(seconds / 3600);
	    let min = Math.floor(seconds / 60) % 60;
	    let sec = seconds % 60;
	    if (hour !== 0) {
	        time = hour + ":";
	    }
	    if (min < 10) {
	        time += "0";
	    }
	    time += min + ":";
	    if (sec < 10) {
	        time += "0";
	    }
	    time += sec;
	}
	return time;
}