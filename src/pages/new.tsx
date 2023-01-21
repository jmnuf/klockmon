import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Body from "../components/body";
import H1 from "../components/h1";
import { api } from "../utils/api";

const NewPage: NextPage = () => {
	const session = useSession();
	const router = useRouter();
	const createMutation = api.timers.create.useMutation();

	useEffect(() => {
		void (async () => {
			if (createMutation.data && createMutation.data.created) {
				const id = createMutation.data.id;
				await router.push(`timer/${id}`);
			}
		})();
	}, [createMutation.data, router]);

	if (session.status == "loading") {
		return (
			<>
				<Head>
					<title>Create New Timer</title>
					<meta name="description" content="Create new shared timer" />
				</Head>
				<Body>
					<H1>Loading...</H1>
				</Body>
			</>
		);
	} else if (session.status == "unauthenticated") {
		return (
			<>
				<Head>
					<title>Create New Timer</title>
					<meta name="description" content="Create new shared timer" />
				</Head>
				<Body>
					<H1>{"Unauthorized"}</H1>
					<p>
						{
							"You can't creat a timer without being logged, please log in to create a timer"
						}
					</p>
				</Body>
			</>
		);
	}

	const minimumDuration = 60;
	return (
		<>
			<Head>
				<title>Create New Timer</title>
				<meta name="description" content="Create new shared timer" />
			</Head>
			<Body>
				<H1>Create Your Custom Shared Timer</H1>
				<div className="container mx-auto flex flex-col justify-center text-center align-middle">
					<section className="container mx-auto flex flex-col gap-4 rounded-lg bg-slate-700 py-3 text-zinc-300">
						<label htmlFor="tname" className="select-none">
							{"Timer Name: "}
							<input
								type="text"
								name="timername"
								id="tname"
								min={1}
								className="rounded-md px-2 py-1 text-stone-800"
							/>
						</label>
						<label htmlFor="tduration" className="select-none">
							{"Duration in seconds: "}
							<input
								type="number"
								name="timerduration"
								min={1}
								defaultValue={minimumDuration}
								id="tduration"
								className="rounded-md px-2 py-1 text-stone-800"
								onChange={(event) => {
									if (event.target.valueAsNumber < minimumDuration) {
										event.target.value = `${minimumDuration}`;
									}
								}}
							/>
						</label>
						<button
							type="submit"
							className="mx-auto w-1/2 select-none rounded-md bg-slate-300 py-1 text-slate-900 transition-all hover:bg-slate-800 hover:text-slate-200"
							onSubmit={(ev) => {
								ev.preventDefault();
								const titleInput = document.querySelector(
									"#tname"
								) as HTMLInputElement;
								const durationInput = document.querySelector(
									"#tduration"
								) as HTMLInputElement;
								createMutation.mutate({
									title: titleInput.value,
									duration: durationInput.valueAsNumber,
								});
							}}
						>
							Create
						</button>
					</section>
				</div>
			</Body>
		</>
	);
};

export default NewPage;

