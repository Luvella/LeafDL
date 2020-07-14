const fetch = require("node-fetch")
const fs = require("fs")

module.exports = async (url, path, current, total) => {
	const res = await fetch(url)
	const fileStream = fs.createWriteStream(path)
	await new Promise((resolve, reject) => {
		let received = 0
		res.body.pipe(fileStream);
		res.body.on("error", (err) => {
			reject(err);
		})
		res.body.on("data", (chunk) => {
			received += chunk.length
			//drawBar(received, received, current, total)
		})
		fileStream.on("finish", function() {
			resolve();
		})
	})
}