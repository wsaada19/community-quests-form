/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "community-quests-form",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const api = await import("./infra/api");
    const frontend = await import("./infra/frontend");

    return {
      api: api.api.url,
      frontend: frontend.web.url,
    };
  },
});
