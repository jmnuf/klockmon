import type {
	GetServerSideProps,
	InferGetServerSidePropsType,
	NextPage,
} from "next";
import Head from "next/head";
import type { PropsWithChildren} from "react";
import { useEffect, useState } from "react";
import { z } from "zod";
import Body from "../../components/body";
import H1 from "../../components/h1";
import { api } from "../../utils/api";
import { millisToReadableTime } from "../../utils/ms-to-time";

const TrueFalseyScheme = z
	.string()
	.optional()
	.transform((val) => {
		if (!val) {
			return false;
		}
		switch (val) {
			case "true":
				return true;
			default:
				return false;
		}
	});

const UrlQuerySchema = z.object({
	duration: TrueFalseyScheme,
	circle: TrueFalseyScheme,
});

type UrlQueryType = z.infer<typeof UrlQuerySchema>;

export const getServerSideProps: GetServerSideProps<{
	timerId: string | null;
	query: UrlQueryType;
	// eslint-disable-next-line @typescript-eslint/require-await
}> = async ({ params, query }) => {
	const urlQueryParse = UrlQuerySchema.safeParse(query);
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
	const parsedQuery = urlQueryParse.success
		? urlQueryParse.data
		: {
				duration: false,
				circle: false,
		  };
	return {
		props: {
			timerId,
			query: parsedQuery,
		},
	};
};

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const BaseHeader: React.FC<{ title: string, description:string }&PropsWithChildren> = ({ title, description, children }) => {
	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			{children}
		</Head>
	)
}

const TimerPage: NextPage<ServerSideProps> = ({ timerId, query }) => {
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
	const startTime = timer.startedAt.valueOf();
	const endTime = startTime + timer.duration;

	if (now >= endTime) {
		return (<>
			<BaseHeader title={`Check Timer | ${timer.title}`} description="Countdown alongside others" />
			<Body>
				<H1 className="font-sans">{`Klock-"${timer.title}"-mon`}</H1>
				<KlockmonSection title="Kountdown" subtitle="Completed">
					<p>Finished at {new Date(endTime).toLocaleString()}</p>
					<p>Currently {new Date(now).toLocaleString()}</p>
				</KlockmonSection>
			</Body>
		</>)
	}

	const diffMillis = endTime - now;
	const nowDate = new Date(now).toLocaleDateString();
	const diffTime = millisToReadableTime(diffMillis);
	const duration = millisToReadableTime(timer.duration);

	return (
		<>
			<Head>
				<title>Check Timer | {timer.title}</title>
				<meta name="description" content="Countdown alongside others" />
			</Head>
			<Body>
				<H1 className="font-sans">{`Klock-"${timer.title}"-mon`}</H1>
				<KlockmonSection title="Kountdown" subtitle={`${nowDate}, ${diffTime.time}`} />
				{query.duration && (
					<KlockmonSection title="Duration" subtitle={duration.time} />
				)}

			</Body>
		</>
	);
};

export default TimerPage;

const KlockmonSection: React.FC<
	{ title: string; subtitle?: string } & PropsWithChildren
> = ({ title, subtitle, children }) => {
	return (
		<div>
			<h2 className="pb-2 font-sans text-2xl font-semibold">{title}</h2>
			{subtitle && (
				<h3 className="pb-2 font-mono text-xl font-semibold">{subtitle}</h3>
			)}
			{children}
		</div>
	);
};

