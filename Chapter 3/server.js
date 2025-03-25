import express from 'express';


const app = express();

// Set static folder
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded ({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json()); 

// Handle GET request to fetch users
app.get('/users', async(req, res) => {
    setTimeout(async ()=> {
    const limit = +req.query.limit || 10;
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/users?_limit=${limit}`
         );
    const users = await response.json()
    res.send(`
    <h2>Users</h2>
    <ul class="list-group">
    ${users.map((user)=>`<li class="list-group-item">${user.name}</li>`).join('')}
    </ul>
    `)
 },2000)
 
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
app.post('/search', async(req, res) => {
  const searchTerm = req.body.search.toLowerCase();
  if(!searchTerm) {
  return res.send('<tr></tr>');
  }
  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const users = await response.json()

  const searchResults = users.filter((user) =>{
    const name = user.name.toLowerCase();
    const email = user.email.toLowerCase();
    return name.includes(searchTerm) || email.includes(searchTerm)
    })
    const searchResultHtml = searchResults
    .map((user) => `
    <tr>
    <td>${user.name}</td>
    <td>${user.email}</td>
    </tr>
    `)
 .join('');
 res.send(searchResultHtml);
});

// Start the server
app.listen (3000, ()=>{
console. log('Server listening on port 3000');
});
