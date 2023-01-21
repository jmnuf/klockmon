import type {
	GetServerSideProps,
	InferGetServerSidePropsType,
	NextPage,
} from "next";
import Head from "next/head";
import Body from "../../components/body";
import { api } from "../../utils/api";

const TimerPage: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ timerId }) => {
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
					<h1>Invalid Timer Request</h1>
					<p>There is no known timer here...</p>
				</Body>
			</>
		);
	}
	const q = api.timer.getById.useQuery({ id: timerId });
	if (!q.data) {
		return (
			<>
				<Head>
					<title>Check Timer</title>
				</Head>
				<Body>
					<h1>Opening timer...</h1>
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
				</Head>
				<Body>
					<h1>No Timer Found</h1>
					<p>{`The requested timer of id ${timerId} doesn't exist`}</p>
				</Body>
			</>
		);
	}
	const timer = result.data;
	const now = Date.now();

	const diffMillis = timer.startedAt.valueOf() + timer.duration - now;
	const diffDate = new Date(diffMillis);

	return (
		<>
			<Head>
				<title>Check Timer | { timer.title }</title>
			</Head>
			<Body>
				<h1>{timer.title} Timer</h1>
				<p>
					<strong>Hours:</strong> {diffDate.getHours()}<br />
					<strong>Minutes:</strong> {diffDate.getMinutes()}<br />
					<strong>Seconds:</strong> {diffDate.getSeconds()}
				</p>
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

