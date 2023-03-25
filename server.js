import path from 'node:path';

import express from 'express';

import _config from './_config.cjs';
// const express = require('express');
// const path = require('node:path');
// const _config = require('./_config.cjs');

const HOST = _config.server.port;
const PORT = _config.server.port;

const app = express();

app.use(express.static('dist'));

app.get('/*', (request, response) => {
  response.sendFile(path.resolve(__dirname, './dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at: http://${HOST}:${PORT}`);
});
