let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');

iconCart.addEventListener('click', () => {
    if (cart.style.right === '-100%') {
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    } else {
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
    }
});

close.addEventListener('click', () => {
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
});

let products = null;
let listCart = [];

// Function to fetch data from JSON file
function fetchData() {
    fetch("https://binalot.github.io/products/product.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            products = data;
            addDataToHTML();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to add products to HTML
function addDataToHTML() {
    let listProductHTML = document.querySelector('.listProduct');
    listProductHTML.innerHTML = '';

    if (products !== null) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML =
                `<div class='box'>
                    <div class='img-box'>
                        <img class='image' src="${product.image}" />
                    </div>
                
                </div>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}

// Function to check cart
function checkCart() {
    let cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }
}

// Function to add products to cart
function addCart(idProduct) {
    checkCart();
    let productCopy = JSON.parse(JSON.stringify(products));

    if (!listCart[idProduct]) {
        let dataProduct = productCopy.filter(
            product => product.id === idProduct
        )[0];

        listCart[idProduct] = dataProduct;
        listCart[idProduct].quantity = 1;
    } else {
        listCart[idProduct].quantity++;
    }

    let timeSave = "expires=Thu, 31 Dec 2025 23:59:59 UTC";
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; " + timeSave + "; path=/;";
    checkCart();
    addCartToHTML();
}

// Function to add products from cart to HTML
function addCartToHTML() {
    let listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    if (listCart) {
        Object.values(listCart).forEach(product => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML =
                    `<img src="${product.image}">
                    <div class="content">
                        <div class="name">${product.name}</div>
                        <div class="price">${product.price}/1 product</div>
                    </div>
                    <div class="quantity">
                        <button onclick="changeQuantity(${product.id}, '-')">-</button>
                        <span class="value">${product.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity += product.quantity;
            }
        });
    }
    totalHTML.innerText = totalQuantity;
}

// Initialize the page
fetchData();


function changeQuantity($idProduct, $type){
  switch ($type) {
    case '+':
      listCart[$idProduct].quantity++;
      break;
    case '-': 
      listCart[$idProduct].quantity--;
      if(listCart[$idProduct].quantity <= 0){
        delete listCart[$idProduct];
      }
      break;
  
    default:
      break;
  }

  let timeSave = "expires=Thu, 31 Dec 2025 23:59:59 UTC";
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; " + timeSave + "; path=/;";

    addCartToHTML();
}
