let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCart() {
    const $cartList = $("#cart-items");
    $cartList.empty();
    let total = 0;

    $.each(cart, function(index, item) {
        total += item.price;
        $cartList.append(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.name} - $${item.price.toFixed(2)}
        <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
      </li>
    `);
    });

    $("#total").text(total.toFixed(2));
    localStorage.setItem("cart", JSON.stringify(cart));
}

function populateCheckoutSummary() {
    let summary = "<ul class='list-group mb-3'>";
    let total = 0;

    $.each(cart, function(_, item) {
        total += item.price;
        summary += `<li class="list-group-item d-flex justify-content-between">
      ${item.name}
      <span>$${item.price.toFixed(2)}</span>
    </li>`;
    });

    summary += `</ul><h5>Total: $${total.toFixed(2)}</h5>`;
    $("#checkout-summary").html(summary);
}

function placeOrder() {
    const name = $("#customerName").val().trim();
    const email = $("#customerEmail").val().trim();
    const address = $("#customerAddress").val().trim();

    if (!name || !email || !address) {
        alert("Please fill out all fields.");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const quantity = cart.length;
    const date = new Date().toLocaleString();

    const newOrder = {
        name,
        email,
        address,
        date,
        total: total.toFixed(2),
        quantity
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order placed!");
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();

    $("#checkoutModal").modal("hide");
    $("#checkout-form")[0].reset();
}

$(document).ready(function() {
    updateCart();

    // Add to cart button
    $(".add-to-cart").on("click", function() {
        const name = $(this).data("name");
        const price = parseFloat($(this).data("price"));
        cart.push({ name, price });
        updateCart();
        alert(`${name} added to cart!`);
    });

    // Remove item from cart
    $(document).on("click", ".remove-item", function() {
        const index = $(this).data("index");
        cart.splice(index, 1);
        updateCart();
    });

    // Populate summary when modal opens
    $("#checkoutModal").on("show.bs.modal", function() {
        populateCheckoutSummary();
    });
});