import type {
	GetServerSideProps,
	InferGetServerSidePropsType,
	NextPage,
} from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Body from "../../components/body";
import H1 from "../../components/h1";
import { api } from "../../utils/api";
import { millisToReadableTime } from "../../utils/ms-to-time";

const TimerPage: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ timerId }) => {
	const [now, setNow] = useState(Date.now());
	useEffect(() => {
		setInterval(() => {
			setNow(Date.now());
		}, 500);
	}, []);

	if (!timerId) {
		return (
			<>
				<Head>
					<title>Invalid Check Timer</title>
					<meta
						name="description"
						content="Have a custom timer countdown alongside others"
					/>
					<meta
						name="keywords"
						content="timer,countdown clock,countdown,shared timer"
					/>
				</Head>
				<Body>
					<H1>Invalid Timer Request</H1>
					<p>There is no known timer here...</p>
				</Body>
			</>
		);
	}
	const q = api.timers.getById.useQuery({ id: timerId });
	if (!q.data) {
		return (
			<>
				<Head>
					<title>Check Timer</title>
					<meta name="description" content="Countdown alongside others" />
				</Head>
				<Body>
					<H1>Opening timer...</H1>
				</Body>
			</>
		);
	}

	const result = q.data;
	if (!result || !result.found || !result.data) {
		return (
			<>
				<Head>
					<title>Check Timer</title>
					<meta name="description" content="Countdown alongside others" />
				</Head>
				<Body>
					<H1>No Timer Found</H1>
					<p>{`The requested timer of id ${timerId} doesn't exist`}</p>
				</Body>
			</>
		);
	}
	const timer = result.data;
	const endTime = timer.startedAt.valueOf() + timer.duration;

	const diffMillis = (endTime - now);
	const diffDate = millisToReadableTime(diffMillis);

	if (diffDate.hours < 0) {
		diffDate.hours = 0;
	}
	if (diffDate.minutes < 0) {
		diffDate.minutes = 0;
	}
	if (diffDate.seconds < 0) {
		diffDate.seconds = 0;
	}

	return (
		<>
			<Head>
				<title>Check Timer | {timer.title}</title>
				<meta name="description" content="Countdown alongside others" />
			</Head>
			<Body>
				<H1 className="font-sans">{`"${timer.title}"`}</H1>
				<h2 className="text-2xl font-semibold pb-2 font-sans">Timer/Countdown</h2>
				<h3 className="text-xl font-semibold pb-2 font-mono">
					{diffDate.time}
				</h3>
			</Body>
		</>
	);
};

export default TimerPage;

export const getServerSideProps: GetServerSideProps<{
	timerId: string | null;
	// eslint-disable-next-line @typescript-eslint/require-await
}> = async ({ params }) => {
	let timerId: string | null = null;
	if (params) {
		if (typeof params.timer_id === "string") {
			timerId = params.timer_id.trim();
		} else if (
			typeof params.timer_id == "object" &&
			Array.isArray(params.timer_id)
		) {
			const item = params.timer_id[0];
			if (typeof item == "string") {
				timerId = item.trim();
			}
		}
	}
	return {
		props: {
			timerId,
		},
	};
};

