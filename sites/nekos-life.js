const fetch = require("node-fetch")
const clover = require("@terminalfreaks/clover")
const fs = require("fs")
const os = require("os")
const tags = ["femdom", "tickle", "classic", "ngif", "erofeet", "meow", "erok", "poke", "les", "v3", "hololewd", "nekoapi_v3.1", "lewdk", "keta", "feetg", "nsfw_neko_gif", "eroyuri", "kiss", "8ball", "kuni", "tits", "pussy_jpg", "cum_jpg", "pussy", "lewdkemo", "lizard", "slap", "lewd", "cum", "cuddle", "spank", "smallboobs", "goose", "Random_hentai_gif", "avatar", "fox_girl", "nsfw_avatar", "hug", "gecg", "boobs", "pat", "feet", "smug", "kemonomimi", "solog", "holo", "wallpaper", "bj", "woof", "yuri", "trap", "anal", "baka", "blowjob", "holoero", "feed", "neko", "gasm", "hentai", "futanari", "ero", "solo", "waifu", "pwankg", "eron", "erokemo"]

module.exports.run = (options, logger) => {
	if(options.alltags) return logger.log(`The available tags are: ${tags.join(", ")}`)
	if(clover.isEmpty(options.tag)) {
		logger.error("A tag is missing. You can add one with --tag <tag>")
		logger.log("For example: --tag wallpaper")
		return logger.log("You can see all tags with --alltags")
	}
	if(!tags.includes(options.tag[0])) {
		logger.error("That is not a valid tag.")
		return logger.log("Look at all available tags with --alltags")
	}
	
	fetch(`https://nekos.life/api/v2/img/${options.tag[0]}`)
	.then(res => res.json())
	.then(res => {
		fs.mkdirSync(`${os.userInfo().homedir}/Documents/LeafDL/nekos.life/${options.tag}`, {recursive: true})
		logger.debug(JSON.stringify(res))
		logger.log("Downloading...")
		require("./_direct.js")(res.url, `${os.userInfo().homedir}/Documents/LeafDL/nekos.life/${options.tag}/${res.url.split("/")[res.url.split("/").length - 1]}`, 1, 1)
	}).catch(e => logger.fatal(e.message))
}