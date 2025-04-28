import express from "express";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.set("view engine", "ejs");
async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Connected to MySQL via Prisma:", result);
  } catch (error) {
    console.error("❌ Connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

app.get("/", function (req, res) {
  if (req.headers.authorization == undefined) {
    res.status(404).send({
      status: "Error",
    });
  }
  
  res.send({
    status: "true",
  });
  // res.render("pages/index", {
  //   tagline: "awf",
  // });
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

prisma.account.create({
  data: {
    customer: {
      create: {
        name: "",
        phoneNumber: "",
      },
    },
    email: "",
    password: "",
    role: "",
  },
});
