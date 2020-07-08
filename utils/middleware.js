const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:  ', req.path)
    logger.info('Body:  ', req.body)
    logger.info('---')
    next()
}

const responseLogger = (req, res, next) => {
    logger.info('Status:', res.statusCode)
    logger.info('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (e, req, res, next) => {
    if (e.name === 'ValidationError') {
		return res.status(400).json({ error: e.message })
	} else if (e.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'invalid token' })
    }
    logger.error(e.message)
    next(e)
}

module.exports = {
    requestLogger,
    responseLogger,
    unknownEndpoint,
    errorHandler
}