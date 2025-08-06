// Store selected products
let selectedProducts = [];

const buttons = document.querySelectorAll('.add-to-bundle');
const progressBar = document.querySelector('.continue-bar');
const progressText = document.querySelector('.continue-text');
const bundleList = document.querySelector('.list');
const discountEl = document.querySelector('.discount span');
const subtotalEl = document.querySelector('.subtotal span');
const addToCartBtn = document.querySelector('.add-bundle-to-cart');

const DISCOUNT_THRESHOLD = 3; // number of products for discount
const DISCOUNT_RATE = 0.3;    // 30% discount

// Add button click events
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.grid');
    const id = card.dataset.id;
    const title = card.dataset.title;
    const price = parseFloat(card.dataset.price);
    const img = card.querySelector('img').src;

    const productIndex = selectedProducts.findIndex(item => item.id === id);

    if (productIndex === -1) {
      // Add product
      selectedProducts.push({ id, title, price, img });
      button.classList.add('added');
      button.textContent = 'Remove';
    } else {
      // Remove product
      selectedProducts.splice(productIndex, 1);
      button.classList.remove('added');
      button.textContent = 'Add to Bundle +';
    }

    updateUI();
  });
});

function updateUI() {
  // Update progress bar
  const count = selectedProducts.length;
  const progressPercent = Math.min((count / DISCOUNT_THRESHOLD) * 100, 100);
  progressBar.style.width = `${progressPercent}%`;
  progressText.textContent = `${count}/${DISCOUNT_THRESHOLD} added`;
  progressBar.parentElement.setAttribute('aria-valuenow', count);

  // Update bundle list
  bundleList.innerHTML = '';
  selectedProducts.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('bundle-item');
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <span>${item.title} - $${item.price.toFixed(2)}</span>
    `;
    bundleList.appendChild(div);
  });

  // Calculate totals
  let subtotal = selectedProducts.reduce((sum, item) => sum + item.price, 0);
  let discount = 0;

  if (count >= DISCOUNT_THRESHOLD) {
    discount = subtotal * DISCOUNT_RATE;
  }

  subtotalEl.textContent = `$${(subtotal - discount).toFixed(2)}`;
  discountEl.textContent = `$${discount.toFixed(2)} (${Math.round((discount / (subtotal || 1)) * 100)}%)`;

  // Enable/disable Add to Cart
  addToCartBtn.disabled = count === 0;
}
