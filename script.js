/*
Create (új sor, új objektum)
Read (táblázat lista)
Update (sor (objektum) módoisítás)
Delete (sor tötlés)

CRUD műveletek
*/

//state

state = {
    //Adatstruktúra
    products: [
        {
            id: idGen(),
            name: "Áru 1",
            price: 1500,
            quantity: 97,
            isInStock: true
        },
        {
            id: idGen(),
            name: "Áru 2",
            price: 2500,
            quantity: 15,
            isInStock: true
        },
        {
            id: idGen(),
            name: "Áru 3",
            price: 3500,
            quantity: 25,
            isInStock: false
        },
        {
            id: idGen(),
            name: "Áru 4",
            price: 4500,
            quantity: 10,
            isInStock: true
        }
    ],

    cart: [],

    event: "read",
    currentId: null
}

//#region Segéd függvények
//Űrlap megjelenítése
function formView() {
    document.getElementById("form").classList.remove("d-none")
}

//űrlap elrejtése
function formHide() {
    document.getElementById("form").classList.add("d-none")
}

//Id generátor
function idGen() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

//id alapján megkeresi az index-et: id -> index
function searchIndex(id) {
    for (let index = 0; index < state.products.length; index++) {
        if (id === state.products[index].id) {
            return index;
        }
    }
}
//#endregion 

//Mégse gomb működtetése
document.getElementById("cancel-product").onclick = function () {
    state.event = "read";
    formHide();
};

//Create: Új áru gomb
document.getElementById("new-product").onclick = function (id) {
    state.event = "create";
    //látszódjon az Új áru cím

    document.getElementById("title-new").classList.remove("d-none");
    document.getElementById("title-update").classList.add("d-none");
    formView();
};

//Save: Mentés gomb
document.getElementById("save-product").onclick = function (event) {
    event.preventDefault();

    //Hozzájutás az adatokhoz
    let name = document.getElementById("name").value;
    let price = +document.getElementById("price").value;
    let isInStock = document.getElementById("isInStock").checked;

    //validálás
    let errorList = [];
    if (!(name)) {
        console.log("namehiba");
        document.getElementById("name-label").classList.add("text-danger");
        errorList.push("Name hiba");
    } else {
        document.getElementById("name-label").classList.remove("text-danger");
    }
    if (!(price)) {
        console.log("namehiba");
        document.getElementById("price-label").classList.add("text-danger");
        errorList.push("Price hiba");
    } else {
        document.getElementById("price-label").classList.remove("text-danger");
    }

    if (errorList.length > 0) {
        return;
    }

    //alapban generálunk
    let id = idGen();
    if (state.event === "update") {
        //update: az kéne, amire kattintottunk
        id = state.currentId;
    }


    let product = {
        id: id,
        name: name,
        price: price,
        isInStock: isInStock
    }

    if (state.event == "create") {
        state.products.push(product);
    }
    else if (state.event = "update") {
        let index = searchIndex(id);
        state.products[index] = product;
    }

    renderProducts();
    formHide()

    //mezők ürítése
    document.getElementById("name").value = null;
    document.getElementById("price").value = null;
}

//Read: product lista
function renderProducts() {
    state.event = "read";
    let prodctsHtml = "";

    state.products.forEach(product => {
        prodctsHtml += `
        <div class="col">
            <div class="card ${product.quantity > 0 ? "" : "bg-warning"}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Termék ár: ${product.price} Ft</p>
                    <p class="card-text">Raktáron ${product.quantity} db</p>

                </div>
                <button type="button" 
                    class="btn btn-danger col-6 m-2"
                    onclick="deleteProduct('${product.id}')"
                >
                    Törlés
                </button>
                <button type="button" 
                    class="btn btn-success col-7 m-2"
                    onclick="updateProduct('${product.id}')"
                >
                    Módosít
                </button>
                <button type="button" class="btn btn-primary col-6 m-2"onclick="Kosar('${product.id}')">
                <i class="bi bi-bag-plus"></i>  

                </button>

                <input class="form-control" value="1" type="number" id="${product.id}">

                
            </div>
        </div>`;

    });
    document.getElementById("product-list").innerHTML = prodctsHtml;
}


//Kosár
//issue: ugyanazt a terméket többször lehet bele tenni
//issue: mennyiség mínuszba 
//issue: negatívot megenged
//issue: nem kell az isInStock: bevitel és egyéb helyeken
function Kosar(id) {
    //derítsük ki az indexet
    let index = searchIndex(id)

    let quantity = +document.getElementById(`${id}`).value

    //mennyiség korrekció: 
    //le kell vonni az eredeti mennyiségből
    state.products[index].quantity = state.products[index].quantity - quantity;


    // let product =         {
    //     id: state.products[index].id,
    //     name: state.products[index].name,
    //     price: state.products[index].price,
    //     quantity: quantity,
    //     isInStock: state.products[index.isInStock]
    // }

    let product = { ...state.products[index] }
    product.quantity = quantity;

    // let product = state.products[index]

    //a kosárba ezzel a mennyiséggel kell berakni
    //push a kosárba
    state.cart.push(product);

    //újrarendeljük a termékeket
    renderProducts();


    //logoljuk a kosarat 
    console.log(state.cart);
}


//Update: Módosít gomb függvénye
function updateProduct(id) {
    state.event = "update"
    state.currentId = id;
    //kerüljenek bele az űrlapba a kártya datai
    let index = searchIndex(id);
    //beolvassuk az űrlapba
    let name = state.products[index].name
    let price = state.products[index].price
    let isInStock = state.products[index].isInStock
    document.getElementById("name").value = name;
    document.getElementById("price").value = price;
    document.getElementById("isInStock").checked = isInStock;

    document.getElementById("title-update").classList.remove("d-none");
    document.getElementById("title-new").classList.add("d-none");

    formView();
    console.log(id);
}

//Delete: Töröl gomb függvénye
function deleteProduct(id) {
    state.event = "delete";
    let index = searchIndex(id)
    state.products.splice(index, 1);
    renderProducts()
}

//Amikor betöltődött az oldal, elindul a: renderProducts függvény
window.onload = renderProducts;