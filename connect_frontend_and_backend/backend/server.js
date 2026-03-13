import express from "express";
const app = express();

// express serves a route and listen
// app.get("/", (req, res) => {
//   res.send("server is ready");
// });

app.get("/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "The Programmer's Diet",
      content:
        "A programmer's wife says 'Go to the store, get a gallon of milk, and if they have eggs, get a dozen.' He comes back with 12 gallons of milk.",
    },
    {
      id: 2,
      title: "Why No Friends?",
      content:
        "I told my wife she should embrace her mistakes. She gave me a hug.",
    },
    {
      id: 3,
      title: "DNS Problem",
      content:
        "99% of computer problems can be diagnosed with the question: 'Did you turn it off and on again?' The other 1% is DNS.",
    },
    {
      id: 4,
      title: "Infinite Loop",
      content: "How do you comfort a JavaScript developer? You console them.",
    },
    {
      id: 5,
      title: "404: Sleep Not Found",
      content:
        "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
    },
  ];
  res.send(jokes);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serve at http://localhost:${PORT}`);
});

// common js (require syntax)   code comes synchronously
// module js (import syntax)    works asynchronously a bit
// package.json is the main manifesting file, "type" = "module"

/*
Express routes  →  decide what DATA to send back
React routes    →  decide what UI to show on screen
*/

// https://jsonformatter.org/