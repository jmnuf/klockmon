import type { PropsWithChildren } from "react";


const Body: React.FC<PropsWithChildren> = ({ children }) => {
	return <div className="bg-violet-400 flex flex-col justify-center text-center absolute left-0 top-0 right-0 bottom-0">
		{children}
	</div>
}

export default Body;
