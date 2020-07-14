const fs = require("fs")
const os = require("os")
const crypto = require("crypto")
const { URL, parse } = require("url")
const clover = require("@terminalfreaks/clover")
const Loggaby = require("loggaby")

const options = clover(process.argv.slice(2).join(" "))
const logger = new Loggaby()

const { sitelist } = require("./sitelist.json") // Slightly more user friendly site listing.

// Puts the help option check first, prioritizing it above all else. 
if(options.help) return console.log(help())

// Direct downloading.
// Checks if the site options are provided, and aren't empty.
if(options.direct && options.direct !== true) {
	logger.debug("Handling direct URL")
	if(!validUrl(options.direct[0])) return logger.fatal("Direct URL provided is not valid. (Be sure to add http or https too.)")
	try {
		fs.mkdirSync(`${os.userInfo().homedir}/Documents/LeafDL/Direct`, {recursive: true})
		const name = `${new URL(options.direct[0]).hostname}_${crypto.randomBytes(24).toString("hex")}_${options.direct[0].split("/")[options.direct[0].split("/").length - 1]}`
		return require("./sites/_direct.js")(options.direct[0], `${os.userInfo().homedir}/Documents/LeafDL/Direct/${name}`, 1, 1)
	} catch(e) {
		logger.fatal(e.message)
		return logger.log("Report this at: https://github.com/Terminalfreaks/Leaf/issues")
	}
}

// Goes here if direct URL wasn't provided.
// Checks if the site options are provided, and aren't empty.
if(options.site && options.site !== true) {
	logger.debug("Handling site argument")
	// Pseudo command handler
	if(!sitelist.includes(options.site[0])) {
		logger.fatal("Site provided to download from is not supported.")
		return logger.log("You might want to check --list")
	} else {
		require(`./sites/${options.site[0].replace(".", "-")}`).run(options, logger) // Pass all options
	}
} else { // Prints error if expected site arguments weren't provided.
	logger.debug("Printing error.")
	logger.error("Missing options: either use options --site <sitename> or --direct <url>")
	return logger.log("You might want to check --help or --list")
}

// Checks if a string is a valid URL.
function validUrl(s) {
	try {
		new URL(s);
		const parsed = parse(s);
		return ["http", "https"]
			? parsed.protocol
				? ["http", "https"].map(x => `${x.toLowerCase()}:`).includes(parsed.protocol)
				: false
			: true;
	} catch (err) {
		return false;
	}
}

// Help message
function help() {
	return `lazy ass ill do this later`
}