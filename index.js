const fs = require("fs")
const os = require("os")
const crypto = require("crypto")
const { URL, parse } = require("url")
const clover = require("@terminalfreaks/clover")
const Loggaby = require("loggaby")

const options = clover(process.argv.slice(2).join(" "))
const command = process.argv.slice(2).filter(c => !c.startsWith("-"))[0]
const logger = new Loggaby({
	debug: options.debug ? true : false
})

const { sitelist } = require("./sitelist.json") // Slightly more user friendly site listing.

// Puts the help option check first, prioritizing it above all else. 
if(options.help) return console.log(help())

// Direct downloading.
// Checks if the site options are provided, and aren't empty.
if(command === "direct") {
	logger.debug("Handling direct link.")
	if(clover.isEmpty(options.link)) return logger.fatal("Direct link was not provided. Be sure to add '--link <linkhere>'")
	if(!validUrl(options.link[0])) return logger.fatal("Direct link provided is not valid. (Be sure to add http or https too.)")
	try {
		fs.mkdirSync(`${os.userInfo().homedir}/Documents/LeafDL/Direct`, {recursive: true})
		const name = `${new URL(options.link[0]).hostname}_${crypto.randomBytes(24).toString("hex")}_${options.link[0].split("/")[options.link[0].split("/").length - 1]}`
		return require("./sites/_direct.js")(options.link[0], `${os.userInfo().homedir}/Documents/LeafDL/Direct/${name}`, 1, 1)
	} catch(e) {
		logger.fatal(e.message)
		return logger.log("Report this at: https://github.com/Terminalfreaks/LeafDL/issues")
	}
} 

// Goes here if direct URL wasn't provided.
if(command === "site") {
	logger.debug("Handling site command.")
	if(clover.isEmpty(options.name)) {
		logger.fatal("Missing the --name argument. Make sure it's provided and isn't empty.")
		return logger.log("You might want to check --list for a list of site names.")
	}
	// Pseudo command handler
	if(!Object.keys(sitelist).includes(options.name[0])) {
		logger.fatal("Site provided to download from is not supported.")
		return logger.log("You might want to check --list for a list of site names.")
	} else {
		logger.debug(`Handling site: ${options.name[0]}`)
		if(sitelist[options.name[0]].containsNsfw) logger.warn("Depending on the tag(s) provided, you may get NSFW content.")
		require(`./sites/${sitelist[options.name[0]].booru ? "booru" : sitelist[options.name[0]].commandFile}.js`).run(options, sitelist[options.name[0]], {logger, clover}) // Pass all options
	}
} else { // Prints error if expected site arguments weren't provided.
	logger.debug("Printing error.")
	logger.error("Unknown or no command used. Use the command 'site' or 'direct'")
	return logger.log("You might want to check --help")
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
// TODO: Fill in the help command.
function help() {
	return `lazy ass ill do this later`
}