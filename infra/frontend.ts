import { api } from "./api";

export const web = new sst.aws.StaticSite("StaticSite", {
  path: "packages/frontend",
  build: {
    output: "dist",
    command: "npm run build",
  },
  environment: {
    VITE_API_URL: $dev ? "http://localhost:3000" : api.url,
  },
});
