function initShop() {
  return;
  const shopPlaceholder = document.getElementById('shop-anchor');

  if (shopPlaceholder) {
    const script = document.createElement('script');
    script.src = 'https://cdn.quinbook.com/shop.js';
    script.dataset.shopid = '01161aaa0b6d1345dd8fe4e481144d84';
    shopPlaceholder.appendChild(script);
  }
}
