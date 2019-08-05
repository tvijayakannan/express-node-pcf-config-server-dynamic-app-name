const express = require("express");
const configClient = require("cloud-foundry-config-client");
require("custom-env").env(true);

getConfigProfilesName = function(configType, appName, environment) {
  const defaultConfig = configType; // appname will be added to this by cloud client
  const envConfig = appName + "-" + configType + "-" + environment;
  return defaultConfig + "," + envConfig;
};

getMessageProfilesName = function(configType, appName, clientName, lang) {
  const platformMessage = configType + "-platform-" + lang;
  const clientMessage = configType + "-" + clientName + "-" + lang;
  return platformMessage + "," + appName + "-" + clientMessage;
};

const app = express();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Server Started successfully "));

app.get("/branding/config/:appName/:environment", (req, res) => {
  const params = {
    appName: req.params.appName,
    configLocation: process.env.CONFIG_SERVER_LOCATION,
    profile: getConfigProfilesName(
      "config",
      req.params.appName,
      req.params.environment
    ),
    configServerName: process.env.CONFIG_SERVER_NAME,
    logProperties: process.env.CONFIG_SERVER_LOG_ENABLED,
    interval: process.env.CONFIG_SERVER_REFRESH_INTERVAL
  };

  config = configClient.getLoaderConfig(params);
  configClient
    .load(config, params)
    .then(appConfig => {
      res.send(JSON.stringify(appConfig));
    })
    .catch(err => {
      console.log(err.message);
    });
});

app.get("/branding/message/:appName/:client/:lang", (req, res) => {
  const params = {
    appName: req.params.appName,
    configLocation: process.env.CONFIG_SERVER_LOCATION,
    profile: getProfilesName(
      "message",
      req.params.appName,
      req.params.client,
      req.params.lang
    ),
    configServerName: process.env.CONFIG_SERVER_NAME,
    logProperties: process.env.CONFIG_SERVER_LOG_ENABLED,
    interval: process.env.CONFIG_SERVER_REFRESH_INTERVAL
  };

  config = configClient.getLoaderConfig(params);
  configClient
    .load(config, params)
    .then(appConfig => {
      res.send(JSON.stringify(appConfig));
    })
    .catch(err => {
      console.log(err.message); // never called
    });
});

app.listen(port);
