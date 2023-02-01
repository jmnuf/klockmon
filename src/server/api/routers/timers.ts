import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
			const data = await db.findUnique({
				select: {
					id: true,
					createdAt: true,
					title: true,
					duration: true,
					startTime: true,
				},
				where: { id },
			});
			if (!data) {
				return {
					found: false,
					data: null,
				} as const;
			}

			return {
				found: true,
				data,
			} as const;
		}),

	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1),
				duration: z.number().min(60),
				startAt: z.date().optional(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;
			const timer = await ctx.prisma.timers.create({
				data: {
					title: input.title,
					duration: input.duration,
					creatorId: userId,
					startTime: input.startAt,
				},
			});
			if (!timer) {
				return { created: false, id: null } as const;
			}
			return { created: true, id: timer.id } as const;
		}),
});
