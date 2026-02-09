const cart = {};
const cartBox = document.querySelector(".order-box");
const emptyBox = cartBox.querySelector(".icon-order");

document.querySelectorAll(".box-item").forEach((item, index) => {
  const btn = item.querySelector(".shop-card");

  btn.addEventListener("click", (e) => {
    e.preventDefault(); // جلوگیری از پرش صفحه

    const id = index;

    if (!cart[id]) {
      cart[id] = {
        title: item.querySelector(".sub-title strong").innerText,
        price: 8.5,
        qty: 1,
      };

      item.classList.add("selected-product");
    }

    updateButton(item, id);
    updateCartBox();
  });
});

function updateButton(item, id) {
  const oldBtn = item.querySelector(".shop-card");
  oldBtn.style.display = "none";

  let counter = document.createElement("div");
  counter.className = "counter-box";
  counter.innerHTML = `
      <span class="minus">-</span>
      <span class="count">${cart[id].qty}</span>
      <span class="plus">+</span>
    `;

  item.appendChild(counter);

  counter.querySelector(".plus").addEventListener("click", () => {
    cart[id].qty++;
    counter.querySelector(".count").innerText = cart[id].qty;
    updateCartBox();
  });

  counter.querySelector(".minus").addEventListener("click", () => {
    cart[id].qty--;
    if (cart[id].qty <= 0) {
      delete cart[id];
      counter.remove();
      oldBtn.style.display = "flex";
      item.classList.remove("selected-product");
    } else {
      counter.querySelector(".count").innerText = cart[id].qty;
    }
    updateCartBox();
  });
}

function updateCartBox() {
  // حذف وضعیت خالی
  emptyBox.style.display = Object.keys(cart).length === 0 ? "flex" : "none";

  // اگر بخش cart-items وجود نداشت بساز
  let list = cartBox.querySelector(".cart-items");
  if (!list) {
    list = document.createElement("div");
    list.className = "cart-items";
    list.style.padding = "20px";
    cartBox.appendChild(list);
  }

  list.innerHTML = "";

  let totalQty = 0;
  let totalPrice = 0;

  Object.entries(cart).forEach(([id, item]) => {
    totalQty += item.qty;
    const itemTotal = item.qty * item.price;
    totalPrice += itemTotal;

    list.innerHTML += `
        <div class="cart-item">
          <div class="info">
            <strong>${item.title}</strong>
            <span class="qty">${item.qty} × $${
      item.price
    } — $${itemTotal.toFixed(2)}</span>
          </div>
          <div class="remove-item" data-id="${id}">×</div>
        </div>
      `;
  });

  // آپدیت عنوان
  cartBox.querySelector(".title strong").innerText = `Your Cart (${totalQty})`;

  // دکمه پرداخت
  let checkout = cartBox.querySelector(".checkout-btn");
  if (!checkout) {
    checkout = document.createElement("button");
    checkout.className = "checkout-btn";
    checkout.innerText = "Checkout";
    cartBox.appendChild(checkout);
  }

  checkout.onclick = () => {
    fillCheckoutList(); // ←← قبل از باز شدن مودال لیست را بساز
    openCheckoutModal();
  };

  // رویداد حذف محصول
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      delete cart[id];

      // حذف حالت استایل انتخاب‌شده
      document
        .querySelectorAll(".box-item")
        [id].classList.remove("selected-product");

      // بازگرداندن دکمه Add to Cart
      const box = document.querySelectorAll(".box-item")[id];
      box.querySelector(".shop-card").style.display = "flex";
      const counter = box.querySelector(".counter-box");
      if (counter) counter.remove();

      updateCartBox();
    });
  });
}

const modal = document.querySelector(".checkout-modal");
const backdrop = document.querySelector(".checkout-backdrop");
const closeCheckout = document.querySelector(".close-checkout");

function openCheckoutModal() {
  modal.classList.add("active");
}

function closeCheckoutModal() {
  modal.classList.remove("active");
}

backdrop.addEventListener("click", closeCheckoutModal);
closeCheckout.addEventListener("click", closeCheckoutModal);

function fillCheckoutList() {
  const list = document.querySelector(".checkout-window .list");
  list.innerHTML = ""; // خالی کردن لیست قبلی

  let totalPrice = 0;

  Object.entries(cart).forEach(([id, item]) => {
    const itemTotal = item.qty * item.price;
    totalPrice += itemTotal;

    // پیدا کردن عکس محصول از صفحه اصلی
    const productImg = document
      .querySelectorAll(".box-item")
      [id].querySelector(".img-item img").src;

    list.innerHTML += `
            <div class="checkout-item" style="display:flex; justify-content:space-between; align-items:center; padding:15px; border-bottom:1px solid #ccc;">
                
                <div style="display:flex; align-items:center; gap:15px;">
                    <img src="${productImg}" style="width:70px; height:70px; border-radius:10px; object-fit:cover;">
                    
                    <div>
                        <strong style="font-size:18px;">${item.title}</strong>
                        <div style="opacity:0.7; font-size:14px;">
                            ${item.qty} × $${item.price.toFixed(2)}
                        </div>
                    </div>
                </div>

                <strong style="font-size:18px; color:orangered;">
                    $${itemTotal.toFixed(2)}
                </strong>
            </div>
        `;
  });

  // جمع کل نهایی
  list.innerHTML += `
        <div style="padding:20px; display:flex; justify-content:space-between; font-size:22px; font-weight:bold;">
            <span>Total:</span>
            <span style="color:orangered;">$${totalPrice.toFixed(2)}</span>
        </div>
    `;
}
