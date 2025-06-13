export const vpc = new sst.aws.Vpc("defaultVPC");

export const cluster = new sst.aws.Cluster("apiCluster", { vpc });

export const api = new sst.aws.Service("backendApi", {
  cluster,
  public: {
    ports: [{ listen: "80/http", forward: "3000/http" }],
  },
  dev: {
    directory: "packages/api",
    command: "npm run dev",
  },
});
