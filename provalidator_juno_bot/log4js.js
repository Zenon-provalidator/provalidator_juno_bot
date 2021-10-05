const log4js = require('log4js')

//logger
log4js.configure({
    appenders: { 
    	provalidator_juno_bot: { 
			type: 'dateFile', 
			filename: './provalidator_juno_bot.log',
		    compress: true
    	} 
    },
    categories: { 
    	default: { 
    		appenders: ['provalidator_juno_bot'], 
    		level: 'debug' 
    	} 
    }
})

const logger = log4js.getLogger('provalidator_juno_bot')

// console.log(logger)
module.exports = {
   log4js : logger
}