const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const history = [];
let ques = "";

const operations = {
  plus: { operation: (a, b) => a + b, symbol: "+" },
  minus: { operation: (a, b) => a - b, symbol: "-" },
  into: { operation: (a, b) => a * b, symbol: "*" },
  divide: { operation: (a, b) => a / b, symbol: "/" },
};

app.get("/:expression*", (req, res) => {
  const { expression } = req.params;
  var fullString = expression + req.params[0];
  const parts = fullString.split("/");

  let result = parseFloat(parts.shift());
  ques = result;
  while (parts.length >= 2) {
    const operator = parts.shift();
    const operand = parseFloat(parts.shift());
    ques = ques + operations[operator].symbol + operand;

    try {
      result = operations[operator].operation(result, operand);
      const his = { question: ques, Result: result };
      history.push(his);
    } catch (e) {
      res.status(400).send("Invalid operator");
      return;
    }
  }

  res.json({ question: ques, Result: result, History: history });
});
app.get("/history", (req, res) => {
  res.json({History :history});
});
app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});