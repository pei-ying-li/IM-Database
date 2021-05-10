const orderList = document.querySelector("#order-list");
const orderForm = document.querySelector("#add-order-form");
const searchOrderForm = document.querySelector('#search-order-form');

function renderOrder(doc){
    let li = document.createElement('li');
    let identity = document.createElement('span');
    let cID = document.createElement('span');
    let tID = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    identity.textContent = 'order ID: ' + doc.data().ID;
    cID.textContent = 'customer ID: ' + doc.data().cID;
    tID.textContent = 'ticket ID: ' + doc.data().tID;
    cross.textContent = 'x';

    li.appendChild(identity);
    li.appendChild(cID);
    li.appendChild(tID);
    li.appendChild(cross);

    orderList.appendChild(li);

    // delete data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('orders').doc(id).delete();
    });
}

// adding data
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let inputID = orderForm.id.value;
    let inputcustomerID = orderForm.cID.value;
    let inputticketID = orderForm.tID.value;

    if(inputID == "" || inputcustomerID == "" || inputticketID == ""){
         window.alert("Please enter with no space~");  
    }
    
    else{
        db.collection('orders').where('ID', '==', inputID).get().then(snapshot => {
            if (!snapshot.empty){
                window.alert("You have entered a repeated ID, please enter again.");
            }else{
                db.collection('orders').add({
                    ID: inputID,
                    cID: inputcustomerID,
                    tID: inputticketID
                });
            }
        })
    }
    
    orderForm.id.value = '';
    orderForm.cID.value = '';
    orderForm.tID.value = '';
})

let clearOrderSearch = document.createElement('button');
clearOrderSearch.textContent = "clear";
searchOrderForm.appendChild(clearOrderSearch);

// search data
searchOrderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    while (orderList.firstChild){
        orderList.removeChild(orderList.firstChild);
    }
    let searchID = searchOrderForm.id.value;
    let searchcustomerID = searchOrderForm.cID.value;

    if (searchID != ''){
        db.collection('orders').where('ID', '==', searchOrderForm.id.value).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderOrder(change.doc);
                } 
                else if (change.type == 'removed'){
                    let li = orderList.querySelector('[data-id=' + change.doc.id + ']');
                    orderList.removeChild(li);
                }
            });
        });
    }
    else if (searchID == '' && searchcustomerID != ''){
        db.collection('orders').where('cID', '==', searchOrderForm.cID.value).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderOrder(change.doc);
                } 
                else if (change.type == 'removed'){
                    let li = orderList.querySelector('[data-id=' + change.doc.id + ']');
                    orderList.removeChild(li);
                }
            });
        });
    }
});

// clear data after search
clearOrderSearch.addEventListener("click", (e) => {
    e.preventDefault();
    while (orderList.firstChild){
        orderList.removeChild(orderList.firstChild);
    }
    db.collection('orders').orderBy('ID').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added'){
                renderOrder(change.doc);
            } 
            else if (change.type == 'removed'){
                let li = orderList.querySelector('[data-id=' + change.doc.id + ']');
                orderList.removeChild(li);
            }
        });
    });
    searchOrderForm.id.value = '';
    searchOrderForm.cID.value = '';

});

// display all
db.collection('orders').orderBy('ID').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added'){
            renderOrder(change.doc);
        } 
        else if (change.type == 'removed'){
            let li = orderList.querySelector('[data-id=' + change.doc.id + ']');
            orderList.removeChild(li);
        }
    })
})
