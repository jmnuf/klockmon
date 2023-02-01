export function millisToReadableTime(millis: number) {
	//Get hours from milliseconds
	const hours = millis / (1000 * 60 * 60);
	const absoluteHours = Math.floor(hours);

	//Get remainder from hours and convert to minutes
	const minutes = (hours - absoluteHours) * 60;
	const absoluteMinutes = Math.floor(minutes);

	//Get remainder from minutes and convert to seconds
	const seconds = (minutes - absoluteMinutes) * 60;
	const absoluteSeconds = Math.floor(seconds);

	return {
		hours: absoluteHours,
		minutes: absoluteMinutes,
		seconds: absoluteSeconds,
		get time() {
			const hours = this.hours < 0 ? 0 : this.hours;
			const h = hours > 9 ? `${hours}` : `0${hours}`;

			const minutes = this.minutes < 0 ? 0 : this.minutes;
			const m = minutes > 9 ? `${minutes}` : `0${minutes}`;

			const seconds = this.seconds < 0 ? 0 : this.seconds;
			const s = seconds > 9 ? `${seconds}` : `0${seconds}`;

			return `${h} : ${m} : ${s}`;
		},
		get readable() {
			let readable = "";
			if (this.hours > 0) {
				readable += `${this.hours} hours `;
			}
			if (this.minutes > 0) {
				readable += `${this.minutes} minutes `;
			}
			if (this.seconds > 0) {
				readable += `${this.seconds} seconds`;
			}
			return readable.trim();
		},
	};
}

export function millisToSecond(ms: number) {
	return ms / 1000;
}

export function secondsToMillis(second: number) {
	return second * 1000;
}

export function millisToMinutes(ms: number) {
	return ms / (millisToSecond(ms) * 60);
}

export function minutesToMillis(minutes: number) {
	return secondsToMillis(minutes * 60);
}

export function hoursToMillis(hours: number) {
	return minutesToMillis(hours * 60);
}

export function daysToMillis(days: number) {
	return hoursToMillis(days * 24);
}

