#!/usr/bin/env node
'use strict';
var pkg     = require('../package.json'),
    version = pkg.version,
    program = require('commander'),
    fs      = require('fs'),
    S3rver  = require('../lib');

program.version(version, '--version');
program.option('-h, --hostname [value]', 'Set the host name or ip for the server', 'localhost')
  .option('-p, --port <n>', 'Set the port of the http server', 4568)
  .option('-s, --silent', 'Suppress log messages', false)
  .option('-i, --indexDocumement', 'Index Document for Static Web Hosting', '')
  .option('-e, --errorDocument', 'Custom Error Document for Static Web Hosting', '')
  .option('-d, --directory [path]', 'Data directory')
  .option('-u, --useSignedUrl [value]', 'UseSignedUrl', false)
  .option('-a, --accessKey [value]', 'AccessKey')
  .option('-k, --secretAccessKey [value]', 'SecretAccessKey')
  .parse(process.argv);

if (program.directory === undefined) {
  console.error('Data directory is required');
  return;
}

try {
  var stats = fs.lstatSync(program.directory);
  if (stats.isDirectory() === false) {
    throw Error();
  }
}
catch (e) {
  console.error('Directory does not exist. Please create it and then run the command again');
  return;
}

var s3rver = new S3rver();
s3rver.setHostname(program.hostname)
  .setPort(program.port)
  .setDirectory(program.directory)
  .setSilent(program.silent)
  .setIndexDocument(program.indexDocumement)
  .setErrorDocument(program.errorDocument)
  .setUseSignedUrl(program.useSignedUrl)
  .setAccessKey(program.accessKey)
  .setSecretAccessKey(program.secretAccessKey)
  .run(function (err, host, port) {
    console.log('now listening on host %s and port %d', host, port);
  });
