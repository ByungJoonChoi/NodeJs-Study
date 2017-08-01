const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());

var products = {
  1:{title:"스타크래프트 리마스터"},
  2:{title:"오버워치"}
};

app.get('/products', (req,res) => {
  var output = '';
  for (var name in products){
    output += `<li>${products[name].title}<a href="/cart/${name}">add</a></li>`
  }
  res.send(`<h1>Products List</h1>
    <ul>${output}</ul>
    <a href="/cart">Cart</a>`);
})
/*
웹브라우져 쿠키에 cart
cart {
  1:3  //{product id}:{수량}
  2:5
}
*/
app.get('/cart/:id', (req,res) => {
  let id = req.params.id;
  if(req.cookies.cart){
    var cart = req.cookies.cart;
  } else{
    cart = {};
  }
  if(!cart[id]){
    cart[id] = 0;
  }
  cart[id] = parseInt(cart[id]) + 1;
  res.cookie('cart', cart);
  res.redirect('/cart');
});

app.get('/cart', (req,res)=>{
  let cart = req.cookies.cart;
  if(!cart){
    res.send("Empty cart!! You hava to buy something!!");
    return;
  }
  var output = '';
  for(var id in cart){
    let title = products[id].title;
    let count = cart[id];
    output += `<li>${title} (${count})</li>`
  }
  res.send(`<h1>Cart</h1><ul>${output}</ul><a href="/products">Products List</a>`);
});

app.get('/count', (req,res) => {
  console.log('Cookies: ', req.cookies);
  let count = parseInt(req.cookies.count);
  if(!count)
    count = 0;
  count += 1;
  res.cookie("count", count);
  res.send("Count : " + count);
});

app.listen(3003, () => {
  console.log("Connected 3003 port!!!");
});
