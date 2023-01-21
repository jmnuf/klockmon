import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const timersRouter = createTRPCRouter({
	getById: publicProcedure
		.input(
			z.object({
				id: z.string().min(1),
			})
		)
		.query(async ({ input, ctx }) => {
			const id = input.id;
			const db = ctx.prisma.timers;
			const timer = await db.findUnique({
				where: { id },
			});
			if (!timer) {
				return {
					found: false,
					data: null,
				};
			}

			const data = {
				id,
				title: timer.title,
				createdAt: timer.createdAt,
				duration: timer.duration,
				startedAt: timer.startTime,
			};

			return {
				found: true,
				data,
			};
		}),
});

