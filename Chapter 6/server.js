import express from "express";

const app = express();

// Set static folder
app.use(express.static("public"));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Handle GET request to fetch users
app.get("/users", async (req, res) => {
  setTimeout(async () => {
    const limit = +req.query.limit || 10;
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?_limit=${limit}`
    );
    const users = await response.json();
    res.send(`
    <h2>Users</h2>
    <ul class="list-group">
    ${users
        .map((user) => `<li class="list-group-item">${user.name}</li>`)
        .join("")}
    </ul>
    `);
  }, 2000);
});

// Handle GET request for profile edit
app.get("/user/:id/edit", (req, res) => {
  const userId = req.params.id; // Extract user ID from the route parameter
  res.send(`<form hx-put="/user/${userId}" hx-target="this" hx-swap="outerHTML">
    <div class="mb-3">
      <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" name="name" value="Greg Lim">
    </div>
  <div class="mb-3">
  <label for="bio" class="form-label">Bio</label>
  <textarea type="text" class="form-control" id="bio" name="bio">Follower of Christ |
 Author of Best-selling Amazon Tech Books and Creator of Coding Courses
  </textarea>
  </div>
  <button type="submit" class="btn btn-primary">
    Save Changes
  </button>
  <button type="submit" hx-get="/index.html"
                class="btn btn-secondary">
                Cancel
      </button>
  </form>`);
});

//    app.post('/calculate',(req,res)=>{
//     const height = parseFloat(req.body.height);
//     const weight = parseFloat(req.body.weight);
//     const bmi = weight/(height * height);
//     res.send(`
//     <p>Height of ${height} & Weight of ${weight} gives you BMI of ${bmi.toFixed(2)}</p>
//     `);
//    })

//   let currentPrice = 60;

//   app.get('/get-price',(req,res)=>{
//     currentPrice = currentPrice + Math.random() * 2 - 1;
//     res.send('$' + currentPrice.toFixed(1))
// })

// Handle POST request for contacts search
app.post("/search", async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();
  if (!searchTerm) {
    return res.send("<tr></tr>");
  }
  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const users = await response.json();

  const searchResults = users.filter((user) => {
    const name = user.name.toLowerCase();
    const email = user.email.toLowerCase();
    return name.includes(searchTerm) || email.includes(searchTerm);
  });
  const searchResultHtml = searchResults
    .map(
      (user) => `
    <tr>
    <td>${user.name}</td>
    <td>${user.email}</td>
    </tr>
    `
    )
    .join("");
  res.send(searchResultHtml);
});

// Handle POST request for email validation
app.post("/email", (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (emailRegex.test(submittedEmail)) {
    return res.send(
      `  <div class="mb-3" hx-target="this" hx-swap="outerHTML">
      <label class="form-label">Email address</label>
      <input
      type="email"
      class="form-control
      name="email"
      hx-post="/email"
      value="${submittedEmail}"
      >
      <div class="alert alert-success" role="alert">
     That email is valid
      </div>
      </div>`
    );
  } else {
    return res.send(`
      <div class="mb-3" hx-target="this" hx-swap="outerHTML">
      <label class="form-label">Email address</label>
      <input
      type="email"
      class="form-control"
      name="email"
      hx-post="/email"
      value="${submittedEmail}"
      >
      <div class="alert alert-danger" role="alert">
      Please enter a valid email address
      </div>
      </div>`);
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
