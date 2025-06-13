import express from "express";
import cors from "cors";

const PORT = 3000;

const app = express();

app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/configs", async (req, res) => {
  res.json({
    configs: [
      {
        id: "1",
        name: "Config 1",
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
