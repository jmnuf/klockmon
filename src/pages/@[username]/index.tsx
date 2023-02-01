import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import Body from "../../components/body";
import H1 from "../../components/h1";


export const getServerSideProps: GetServerSideProps<{
	username: string | null;
	// eslint-disable-next-line @typescript-eslint/require-await
}> = async ({ params }) => {
	let username: string | null = null;
	if (params) {
		if (typeof params.username === "string") {
			username = params.username.trim();
		} else if (
			typeof params.username == "object" &&
			Array.isArray(params.username)
		) {
			const item = params.username[0];
			if (typeof item == "string") {
				username = item.trim();
			}
		}
	}
	return {
		props: {
			username,
		},
	};
};

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

type PageProps = ServerSideProps

const UserPage: NextPage<PageProps> = ({ username }) => {
	if (!username) {
		return (
			<>
				<Head>
					<title>Unknown User</title>
				</Head>
				<Body>
					<H1>Error: No user requested</H1>
				</Body>
			</>
		)
	}
	return (
		<>
			<Head>
				<title>User | { username }</title>
			</Head>
			<Body></Body>
		</>
	)
};

export default UserPage;
