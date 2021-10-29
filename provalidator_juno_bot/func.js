const fetch = require('sync-fetch')
require('dotenv').config()
const logger = require('./log4js').log4js//logger
const fs = require('fs')
const numeral = require('numeral')

function getMessage(coin){
	let msg = ``
	let price = ``
	let maxTokens = ``
	let stakedTokens = ``
	let totalTokens = ``
	let stakedPercent = ``
	let totalPercent = ``
	let teamTokens = ``
	let communityTokens = ``
	let communityPercent = ``
		
	try {
		//no file = create
		let file = `./json/${coin}.json`
		let rJson = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : ''
		var wdate = fs.existsSync(file) ? parseInt(rJson.wdate) + (60 * 1000) : 0
		var cdate = parseInt(new Date().getTime())
		
		if(coin == 'juno'){
			let junoInfo = getJunoInfo()
			msg = `🔆 <b>Junochain (JUNO)</b>\nㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n\n`
			if( wdate <  cdate) {
				maxTokens = (junoInfo.max_tokens/ 1000000).toFixed(0)
				stakedTokens = (junoInfo.bonded_tokens / 1000000 ).toFixed(0)
				stakedPercent = (stakedTokens / maxTokens * 100).toFixed(0)
				notStakedTokens = maxTokens - stakedTokens
				notStakedPercent = (notStakedTokens / maxTokens * 100).toFixed(0)
				prvDetail = getProvalidatorDetail()//get provalidator detail info
				prvRank = prvDetail.rank
				prvRate = (prvDetail.rate * 100)
				prvTokens = (prvDetail.tokens/ 1000000).toFixed(0)
				
				let wJson = {
					"maxTokens" : maxTokens,
					"stakedTokens" : stakedTokens,
					"stakedPercent" : stakedPercent,
					"notStakedTokens" : notStakedTokens,
					"notStakedPercent" : notStakedPercent,
					"prvRank" : prvRank,
					"prvTokens" : prvTokens,
					"prvRate" :  prvRate,
					"wdate" : new Date().getTime()
				}
				fs.writeFileSync(file, JSON.stringify(wJson))
			}else{
				maxTokens = rJson.maxTokens
				stakedTokens = rJson.stakedTokens
				stakedPercent = rJson.stakedPercent
				notStakedTokens = rJson.notStakedTokens
				notStakedPercent = rJson.notStakedPercent
				prvRank = rJson.prvRank
				prvRate = rJson.prvRate
				prvTokens = rJson.prvTokens
			}
			msg += `🥩<b>Staking</b>\n\n`
			msg += `💰Price : ${getPrice()}\n\n`
			msg += `🔐Staked : ${numberWithCommas(stakedTokens)} (${stakedPercent}%)\n\n`
			msg += `🔓Unstaked : ${numberWithCommas(notStakedTokens)} (${notStakedPercent}%)\n\n`
			msg += `⛓️Current Sply : ${numberWithCommas(maxTokens)} (100%)\n\n`
			msg += `⛓️Max Sply : ${numberWithCommas(185562268)}\n\n`
			msg += `<b>Stake JUNO with ❤️Provalidator</b>\n\n`
			msg += `<b>🔖Commission: 0%</b>\n\n`
			msg += `<b>🏆Validator Ranking: #${prvRank}</b>\n\n`
			msg += `<b>🤝Staked: ${numberWithCommas(prvTokens)}</b>\n\n`
			msg += `ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n`
			msg += `Supported by <a href='https://provalidator.com' target='_blank'>Provalidator</a>\n`
		}	

		return msg
	}catch(err){
		logger.error(`=======================func error=======================`)
		logger.error(err)
		return null
	}
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function getPrice(){
	let json = fetch('https://api.coingecko.com/api/v3/simple/price?ids=juno-network&vs_currencies=usd').json()
	json = JSON.stringify(json).replace("juno-network","juno")
	json = JSON.parse(json)
	return json.juno.usd
}
function getProvalidatorDetail(){
	let json = fetch(process.env.JUNO_API_URL+"/staking/validators").json()
	let obj = {};
	for(var i in json){
		if(process.env.PROVALIDATOR_OPERATER_ADDRESS === json[i].operator_address){			
			obj.rank = json[i].rank
			obj.rate = json[i].rate
			obj.tokens = json[i].tokens
		}
	}
	return obj	
}

function getJunoInfo(){
	let json = fetch(process.env.JUNO_API_URL+"/status").json()
	let returnArr = { 
		'bonded_tokens' : json.bonded_tokens,
		'not_bonded_tokens' : json.not_bonded_tokens,
		'max_tokens' :''
	}
	
	for(var j in json.total_supply_tokens.supply){
		if(json.total_supply_tokens.supply[j].denom == 'ujuno'){
			returnArr.max_tokens = json.total_circulating_tokens.supply[j].amount
			break
		}
	}
	return returnArr	
}

module.exports = {
	getMessage : getMessage,
	getProvalidatorDetail : getProvalidatorDetail,
	getPrice : getPrice
}