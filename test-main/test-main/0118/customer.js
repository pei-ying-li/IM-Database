const customerList = document.querySelector("#customer-list");
const customerForm = document.querySelector("#add-customer-form");
const searchCustomerForm = document.querySelector('#search-customer-form');

function renderCustomer(doc){
    let li = document.createElement('li');
    let identity = document.createElement('span');
    let name = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    identity.textContent = 'ID: ' + doc.data().ID;
    name.textContent = 'name: ' + doc.data().name;
    cross.textContent = 'x';

    li.appendChild(identity);
    li.appendChild(name);
    li.appendChild(cross);

    customerList.appendChild(li);

    // delete data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('customers').doc(id).delete();
    });
}

// adding data
customerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let inputID = customerForm.id.value;
    let inputname = customerForm.name.value;

    if(inputID == "" || inputname == ""){
         window.alert("Please enter with no space~");  
    }
    else{
        db.collection('customers').where('ID', '==', inputID).get().then(snapshot => {
            if (!snapshot.empty){
                window.alert("You have entered a repeated ID, please enter again.");
            } else {
                db.collection('customers').add({
                    ID: inputID,
                    name: inputname
                });
            }
        })
    }
    
    customerForm.id.value = '';
    customerForm.name.value = '';
})

let clearCustomerSearch = document.createElement('button');
clearCustomerSearch.textContent = "clear";
searchCustomerForm.appendChild(clearCustomerSearch);

// search data
searchCustomerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    while (customerList.firstChild){
        customerList.removeChild(customerList.firstChild);
    }

    let searchID = searchCustomerForm.id.value;
    let searchName = searchCustomerForm.name.value;

    if (searchID != ''){
        db.collection('customers').where('ID', '==', searchCustomerForm.id.value).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderCustomer(change.doc);
                } else if (change.type == 'removed'){
                    let li = customerList.querySelector('[data-id=' + change.doc.id + ']');
                    customerList.removeChild(li);
                }
            });
        });
    } else if (searchID == '' && searchName != ''){
        db.collection('customers').where('name', '==', searchCustomerForm.name.value).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderCustomer(change.doc);
                } else if (change.type == 'removed'){
                    let li = customerList.querySelector('[data-id=' + change.doc.id + ']');
                    customerList.removeChild(li);
                }
            });
        });
    }
});


// searchCustomerForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     while (customerList.firstChild){
//         customerList.removeChild(customerList.firstChild);
//     }
//     db.collection('customers').where('ID', '==', searchCustomerForm.id.value).onSnapshot(snapshot => {
//         let changes = snapshot.docChanges();
//         changes.forEach(change => {
//             if (change.type == 'added'){
//                 renderCustomer(change.doc);
//             } 
//             else if (change.type == 'removed'){
//                 let li = customerList.querySelector('[data-id=' + change.doc.id + ']');
//                 customerList.removeChild(li);
//             }
//         });
//     });
// });

// clear data after search
clearCustomerSearch.addEventListener("click", (e) => {
    e.preventDefault();
    while (customerList.firstChild){
        customerList.removeChild(customerList.firstChild);
    }
    db.collection('customers').orderBy('ID').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added'){
                renderCustomer(change.doc);
            } 
            else if (change.type == 'removed'){
                let li = customerList.querySelector('[data-id=' + change.doc.id + ']');
                customerList.removeChild(li);
            }
        });
    });
    searchCustomerForm.id.value = '';
    searchCustomerForm.name.value = '';
});

// display all
db.collection('customers').orderBy('ID').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added'){
            renderCustomer(change.doc);
        } else if (change.type == 'removed'){
            let li = customerList.querySelector('[data-id=' + change.doc.id + ']');
            customerList.removeChild(li);
        }
    })
})
