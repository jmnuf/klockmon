import type { PropsWithChildren } from "react";


const H1: React.FC<PropsWithChildren&{className?: string}> = ({ children, className }) => {
	return (
		<h1 className={`text-3xl font-bold pb-2${className? ` ${className}` : ""}`}>{ children }</h1>
	)
}

export default H1;
