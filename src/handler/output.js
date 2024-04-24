'use strict'

const axios = require('axios');
const { GithubActions } = require('../githubActions');

/**
 * @param {GithubActions} actions
 * 
 * @returns {(response: axios.AxiosResponse) => void}
 */
const createOutputHandler  = (actions) => (response) => {
    actions.setOutput('response', JSON.stringify(response.data))
    actions.setOutput('headers', response.headers)
    actions.setOutput('status', response.status)
}

module.exports = { createOutputHandler }
