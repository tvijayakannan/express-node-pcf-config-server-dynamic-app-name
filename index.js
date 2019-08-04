const express = require("express");
const configClient = require("cloud-foundry-config-client");
require("custom-env").env(true);

const app = express();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Server Started successfully "));
console.log("vcap-service-vijay" + process.env.VCAP_SERVICES);
app.get("/branding/:appName/:environment", (req, res) => {
  const params = {
    appName: req.params.appName,
    configLocation: process.env.CONFIG_SERVER_LOCATION,
    profile: req.params.environment,
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
