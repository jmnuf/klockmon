import type { PropsWithChildren } from "react";


const H1: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<h1 className="text-3xl font-semibold pb-2">{ children }</h1>
	)
}

export default H1;
