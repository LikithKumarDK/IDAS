require('dotenv').config();
var express = require("express");
var ParseServer = require("parse-server").ParseServer;
var RedisCacheAdapter = require('parse-server').RedisCacheAdapter;
var S3Adapter = require('parse-server').S3Adapter;
var app = express();
var AnalyticsAdapter = require('./lib/analytics_adapter').AnalyticsAdapter;
var redisOptions = {url: 'redis://192.168.1.205:6379'}
var redisCache = new RedisCacheAdapter(redisOptions);

var api = new ParseServer({
  databaseURI: "mongodb://192.168.1.205:27017/idas", // Connection string for your MongoDB database
  cloud: "./cloud/main.js", // Absolute path to your Cloud Code
  appId: "idasApp",
  masterKey: "oZW03OlqZC", // Keep this key secret!
  fileKey: "oZW03OlqZC",
  serverURL: "http://localhost:1337/api/v1", // Don't forget to change to https if needed
  analyticsAdapter: new AnalyticsAdapter('UA-143402340-1'),
  cacheAdapter: redisCache,
  filesAdapter: new S3Adapter(),
});

var ParseDashboard = require("parse-dashboard");

var dashboard = new ParseDashboard({
  trustProxy: 1,
  apps: [
    {
      serverURL: "http://localhost:1337/api/v1",
      appId: "idasApp",
      masterKey: "oZW03OlqZC",
      appName: "Idas"
    }
  ],
  users: [
    {
      "user":"admin",
      "pass":"pass"
    }
  ]
}, { allowInsecureHTTP: true });

// Serve the Parse API on the /api/v1 URL prefix
app.use("/api/v1", api);

// make the Parse Dashboard available at /dashboard
app.use("/dashboard", dashboard);

app.listen(1337, function() {
  console.log("parse-server-example running on port 1337.");
});
