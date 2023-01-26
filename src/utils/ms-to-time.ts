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
			const h = this.hours > 9 ? `${this.hours}` : `0${this.hours}`;
			const m = this.minutes > 9 ? `${this.minutes}` : `0${this.minutes}`;
			const s = this.seconds > 9 ? `${this.seconds}` : `0${this.seconds}`;

			return `${h} : ${m} : ${s}`;
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

