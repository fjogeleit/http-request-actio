'use strict'

const core = require('@actions/core');
const axios = require('axios');
const https = require('https');
const { request, METHOD_POST } = require('./httpClient');
const { GithubActions } = require('./githubActions');
const { createPersistHandler } = require('./handler/persist');

let customHeaders = {}

if (!!core.getInput('customHeaders')) {
  try {
    customHeaders = JSON.parse(core.getInput('customHeaders'));
  } catch(error) {
    core.error('Could not parse customHeaders string value')
  }
}

const headers = { 'Content-Type': core.getInput('contentType') || 'application/json' }

if (!!core.getInput('bearerToken')) {
  headers['Authorization'] = `Bearer ${core.getInput('bearerToken')}`;
}

/** @type {axios.AxiosRequestConfig} */
const instanceConfig = {
  baseURL: core.getInput('url', { required: true }),
  timeout: parseInt(core.getInput('timeout') || 5000, 10),
  headers: { ...headers, ...customHeaders }
}

if (!!core.getInput('httpsCA')) {
  instanceConfig.httpsAgent = new https.Agent({ ca: core.getInput('httpsCA') })
}

if (!!core.getInput('username') || !!core.getInput('password')) {
  core.debug('Add BasicHTTP Auth config')

  instanceConfig.auth = {
    username: core.getInput('username'),
    password: core.getInput('password')
  }
}

let retry = 0
if (!!core.getInput('retry')) {
  retry = parseInt(core.getInput('retry'))
}

let retryWait = 3000
if (!!core.getInput('retryWait')) {
  retry = parseInt(core.getInput('retryWait'))
}

const data = core.getInput('data') || '{}';
const files = core.getInput('files') || '{}';
const file = core.getInput('file')
const responseFile = core.getInput('responseFile')
const method = core.getInput('method') || METHOD_POST;
const preventFailureOnNoResponse = core.getInput('preventFailureOnNoResponse') === 'true';
const escapeData = core.getInput('escapeData') === 'true';

const ignoreStatusCodes = core.getInput('ignoreStatusCodes');
let ignoredCodes = [];

if (typeof ignoreStatusCodes === 'string' && ignoreStatusCodes.length > 0) {
  ignoredCodes = ignoreStatusCodes.split(',').map(statusCode => parseInt(statusCode.trim()))
}

const handler = [];
const actions = new GithubActions();

if (!!responseFile) {
  handler.push(createPersistHandler(responseFile, actions))
}

const options = {
  ignoredCodes,
  preventFailureOnNoResponse,
  escapeData,
  retry,
  retryWait
}

request({ data, method, instanceConfig, files, file, actions, options }).then(response => {
  if (typeof response == 'object') {
    handler.forEach(h => h(response))
  }
})
