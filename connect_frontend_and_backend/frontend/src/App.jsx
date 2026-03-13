import { useState } from "react";
import axios from "axios";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios   // no need to parse json data, axios handles it
      .get("/api/jokes")   // in production, full url is not a good practice, Proxying API Requests in Development
      .then((response) => {
        setJokes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <h1>Hello azeem and full stack development</h1>
      <p>Jokes: {jokes.length}</p>

      {jokes.map((joke) => (
        <div key={joke.id}>
          <h3>{joke.title}</h3>
          <p>{joke.content}</p>
        </div>
      ))}
    </>
  );
}

export default App;

/*
--> Curly braces = code block = you MUST write return
const double = (x) => { return x * 2 }
--> Parentheses = expression = automatically returned
const double = (x) => ( x * 2 )
*/

/*
fetch vs axios — Quick Reference
Feature                      fetch        axios
──────────────────────────────────────────────────
Built into browser           ✅           ❌ (install needed)
Auto JSON parsing            ❌           ✅
Throws on 4xx/5xx errors     ❌           ✅
Request timeout support      ❌           ✅
Intercept requests/responses ❌           ✅
Upload progress tracking     ❌           ✅
Used in industry             sometimes    very commonly
*/

/*
Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources.
*/
