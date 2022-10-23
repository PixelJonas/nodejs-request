import request from "request";
import fetch from "node-fetch";
import axios from "axios";

const sampleURL = process.env.URL_TO_TEST || "https://httpbin.org/uuid";

const publicRoutes = async (fastify, opts, done) => {
	fastify.get("/request", (req, reply) => {
		console.log(`testing request lib with url ${sampleURL}`);
		testRequestLib().on("response", (response) => {
			console.log(`finished request lib with url ${sampleURL}`);
			reply.send(response);
		});
	});
	fastify.get("/node-fetch", (req, reply) => {
		console.log(`testing node-fetch with url ${sampleURL}`);
		testNodeFetchLib().then((response) => {
			reply.send(response);
		});
	});

	fastify.get("/axios", (req, reply) => {
		console.log(`testing axios with url ${sampleURL}`);
		testAxiosLib().then((response) => {
			reply.send(response);
		});
	});

	fastify.get("/", (req, reply) => {
		let response = {};
		testRequestLib().on("response", (request_res) => {
			response["request"] = request_res;
			testNodeFetchLib().then((fetch_res) => {
				response["node-fetch"] = fetch_res;
				reply.send(response);
			});
		});
	});

	fastify.get("/ping/", (req, reply) => reply.send({ message: "pong" }));

	done();
};

function testRequestLib() {
	return request({
		url: sampleURL,
		encoding: null,
	})
		.on("error", (err) => {
			console.log(`Error testing request lib` + (err ? ": " + err : ""));
		})
		.on("response", (response) => {
			if (response.statusCode !== 200) {
				console.log(`Error testing request lib (response ${response.statusCode} for url ${sampleURL})`);
			}
		})
		.on("complete", () => {
			console.log(`Finished Request Lib with url ${sampleURL}`);
		});
}

async function testNodeFetchLib() {
	const response = await fetch(sampleURL);
	const data = await response.text();
	console.log(`requested data via fetch-lib: ${data}`);
	return data;
}

async function testAxiosLib() {
	return await axios.get(sampleURL).then((res) => {
		return res.data;
	});
}

export default publicRoutes;
