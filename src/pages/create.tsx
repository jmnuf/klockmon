import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ChangeEventHandler, HTMLInputTypeAttribute, MutableRefObject } from "react";
import { useState } from "react";
import { useEffect, useRef } from "react";
import Body from "../components/body";
import H1 from "../components/h1";
import { api } from "../utils/api";
import { daysToMillis, hoursToMillis, minutesToMillis, secondsToMillis } from "../utils/ms-to-time";

const NewPage: NextPage = () => {
	const session = useSession();
	const router = useRouter();
	const createMutation = api.timers.create.useMutation();

	const defaultDateRef = useRef(new Date(Date.now() + daysToMillis(1.15)));
	const localDateInputRef = useRef() as unknown as MutableRefObject<HTMLInputElement>;
	const [usingDateAsGoal, setUsingDateAsGoal] = useState(false);
	const [isRedirecting, setIsRedirecting] = useState(false);
	const timerDataRef = useRef({
		title: "My Timer",
		goalDate: defaultDateRef.current,
		days: 0, hours: 0, minutes: 30, seconds: 0,
		getMillis(useDate: boolean = usingDateAsGoal) {
			if (useDate) {
				return this.goalDate.valueOf();
			}
			const { hours, minutes, seconds } = this;
			const millis = hoursToMillis(hours) + minutesToMillis(minutes) + secondsToMillis(seconds);
			return millis;
		}
	});

	useEffect(() => {
		const dateInput = document.querySelector("#tdateend");
		if (dateInput instanceof HTMLInputElement) {
			localDateInputRef.current = dateInput;
		}
	});

	useEffect(() => {
		void (async () => {
			if (isRedirecting) {
				return;
			}
			if (createMutation.data && createMutation.data.created) {
				const id = createMutation.data.id;
				setIsRedirecting(true);
				await router.push(`timer/${id}`);
			}
		})();
	}, [createMutation.data, router, isRedirecting]);

	if (session.status == "loading" || isRedirecting) {
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
							"You can't create a timer without being logged, please log in to create a timer"
						}
					</p>
				</Body>
			</>
		);
	}
	
	return (
		<>
			<Head>
				<title>Create New Timer</title>
				<meta name="description" content="Create new shared timer" />
			</Head>
			<Body>
				<H1>Create Your Custom Shared Timer</H1>
				<div className="container mx-auto flex flex-col justify-center text-center align-middle">
					<form
						className="mx-auto px-4 flex flex-col gap-4 rounded-lg bg-slate-700 py-3 text-zinc-300"
						onSubmit={(ev) => {
							ev.preventDefault();
							const startAt = usingDateAsGoal ? new Date() : undefined;
							const timerData = timerDataRef.current;
							const title = timerData.title;

							const duration = startAt != null ? timerData.getMillis(true) - startAt.valueOf() : timerDataRef.current.getMillis();

							if (duration <= 0 || duration <= Date.now()) {
								alert("Invalid duration, it happens too soon!");
								return;
							}

							const mutation = {
								title,
								startAt,
								duration,
							};
							createMutation.mutate(mutation);
						}}
					>
						<label htmlFor="tname" className="select-none">
							{"Timer Name: "}
							<input
								type="text"
								name="timername"
								defaultValue={timerDataRef.current.title}
								id="tname"
								min={1}
								className="rounded-md px-2 py-1 text-stone-800"
								onChange={(ev) => {
									const input = ev.target;
									timerDataRef.current.title = input.value;
									input.checkValidity();
								}}
							/>
						</label>
						<label
							htmlFor="useSpecificDateToggle"
							className="cursor-pointer select-none"
						>
							<input
								type="checkbox"
								name="useSpecificDate"
								id="useSpecificDateToggle"
								onChange={(ev) => {
									const input = ev.target;
									setUsingDateAsGoal(input.checked);
								}}
							/>
							{" Use specific date as timer end"}
						</label>
						<DateLimited
							hidden={!usingDateAsGoal}
							defaultDate={defaultDateRef.current}
							onChange={(value) => {
								timerDataRef.current.goalDate = value;
								// console.log(value.toISOString());
							}}
						/>
						<div className={usingDateAsGoal ? "hidden" : ""}>
							{"Timer Duration"}
							<br />
							<section className="container mx-auto flex flex-col justify-evenly lg:flex-row gap-2">
								<LabeledInput
									id="durDays"
									name="durationDays"
									type={"number"}
									defaultValue={0}
									min={0}
									step={1}
									prependText="Days: "
									onChange={(ev) => {
										const input = ev.target;
										const value = input.valueAsNumber;
										timerDataRef.current.days = Math.max(value, 0);
									}}
								/>
								<LabeledInput
									id="durHours"
									name="durationHours"
									type={"number"}
									defaultValue={0}
									min={0}
									step={1}
									prependText=" Hours: "
									onChange={(ev) => {
										const input = ev.target;
										const value = input.valueAsNumber;
										timerDataRef.current.hours = Math.max(value, 0);
									}}
								/>
								<LabeledInput
									id="durMinutes"
									name="durationMinutes"
									type={"number"}
									defaultValue={30}
									min={0}
									step={1}
									prependText=" Minutes: "
									onChange={(ev) => {
										const input = ev.target;
										const value = input.valueAsNumber;
										timerDataRef.current.minutes = Math.max(value, 0);
									}}
								/>
								<LabeledInput
									id="durSeconds"
									name="durationSeconds"
									type={"number"}
									defaultValue={0}
									min={0}
									step={1}
									prependText=" Seconds: "
									onChange={(ev) => {
										const input = ev.target;
										const value = input.valueAsNumber;
										timerDataRef.current.seconds = Math.max(value, 0);
									}}
								/>
							</section>
						</div>
						<button
							type="submit"
							className="mx-auto w-1/2 select-none rounded-md bg-slate-300 py-1 text-slate-900 transition-all hover:bg-slate-800 hover:text-slate-200"
						>
							Create
						</button>
					</form>
				</div>
			</Body>
		</>
	);
};

export default NewPage;

const DateLimited: React.FC<{
	hidden?: boolean;
	defaultDate?: Date
	onChange?: (value: Date) => void;
}> = ({ hidden, onChange, defaultDate }) => {
	const defVal = defaultDate ? defaultDate.toISOString() : new Date(Date.now() + daysToMillis(1.15)).toISOString();
	const defValString = defVal.substring(0, defVal.lastIndexOf(":"));
	const minimumDate = new Date().toISOString();
	const minDateString = minimumDate.substring(0, minimumDate.lastIndexOf(":"));
	// console.log("Minimum date:", minDateString);
	useEffect(() => {
		onChange?.(new Date(defValString));
	}, []);
	return (
		<LabeledInput
			id="tdateend"
			type="datetime-local"
			name="tdateend"
			prependText="End Time: "
			defaultValue={defValString}
			min={minDateString}
			hidden={hidden}
			onChange={(ev) => {
				const date = new Date(ev.target.valueAsNumber);
				onChange?.(date);
			}}
		/>
	);
};

const LabeledInput: React.FC<{
	type: HTMLInputTypeAttribute;
	defaultValue?: string | number | readonly string[];
	min?: string | number;
	id: string;
	name: string;
	prependText: string;
	step?: number
	hidden?: boolean;
	onChange?: ChangeEventHandler<HTMLInputElement>
}> = ({ defaultValue, prependText, min, type, name, id, hidden, step, onChange }) => {
	return (
		<label htmlFor={id} className={"select-none" + (hidden ? " hidden" : "")}>
			{prependText}
			<input
				type={type}
				name={name}
				defaultValue={defaultValue}
				min={min}
				id={id}
				step={step}
				className="rounded-md px-2 py-1 text-stone-800"
				onChange={(ev) => {
					const input = ev.target;
					if (typeof min == "number") {
						if (isNaN(input.valueAsNumber) && type == "number") {
							input.value = String(min);
						}
						input.value = String(Math.max(input.valueAsNumber, min));
					}
					onChange?.(ev);
				}}
			/>
		</label>
	);
};

