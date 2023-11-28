window.onload = function() {
    fetch('/products')
      .then(response => response.json())
      .then(data => {
        // Handle the received data on the client side
        const productListContainer = document.getElementById('product-list');
        const products = data.datas;

        // Render the product data on the page
        products.forEach(product => {
          const productElement = document.createElement('div');
          productElement.innerHTML = `<p>${product.name} - $${product.price.toFixed(2)}</p>`;
          productListContainer.appendChild(productElement);
        });
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  };