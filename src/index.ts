import fastifyPlugin from "fastify-plugin";
import knex from "knex";

// TODO: work out typings 

const fastifyKnex = fastifyPlugin(
	(fastify, opts: knex.Knex.Config | string, done) => {
		try {
			const handler = knex(opts);

			fastify.decorate("knex", handler).addHook("onClose", (instance, done) => {
				// @ts-ignore
				if (instance.knex === handler) {
					// @ts-ignore
					instance.knex.destroy();
					// @ts-ignore
					instance.knex = undefined;
				}

				done();
			});

			done();
		} catch (error) {
			done(error);
		}
	},
);

export default fastifyKnex;
