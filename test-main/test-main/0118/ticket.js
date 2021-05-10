const ticketList = document.querySelector("#ticket-list");
const ticketForm = document.querySelector("#add-ticket-form");
const searchTicketForm = document.querySelector('#search-ticket-form');

function renderTicket(doc){
    let li = document.createElement('li');
    let ID = document.createElement('span');
    let flightID = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    ID.textContent = 'ticket ID: ' + doc.data().ID;
    flightID.textContent = 'flight ID: ' + doc.data().flightID;
    cross.textContent = 'x';

    li.appendChild(ID);
    li.appendChild(flightID);
    li.appendChild(cross);

    ticketList.appendChild(li);

    // delete data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('tickets').doc(id).delete();
    });
}

// adding data
ticketForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let inputID = ticketForm.ID.value;
    let inputflightID = ticketForm.flightID.value;

    if(inputID == "" || inputflightID == ""){
         window.alert("Please enter with no space~");  
    }
    
    else{
        db.collection('tickets').where('ID', '==', inputID).get().then(snapshot => {
            if (!snapshot.empty){
                window.alert("You have entered a repeated ID, please enter again.");
            }else{
                db.collection('tickets').add({
                    ID: inputID,
                    flightID: inputflightID
                });
            }
        })
    }
    
    ticketForm.ID.value = '';
    ticketForm.flightID.value = '';
})


let clearTicketSearch = document.createElement('button');
clearTicketSearch.textContent = "clear";
searchTicketForm.appendChild(clearTicketSearch);

// search data
searchTicketForm.addEventListener('submit', (e) => {
    e.preventDefault();
    while (ticketList.firstChild){
        ticketList.removeChild(ticketList.firstChild);
    }

    let searchID = searchTicketForm.ID.value;
    let searchFlightID = searchTicketForm.flightID.value;

    if (searchID != ''){
        db.collection('tickets').where('ID', '==', searchTicketForm.ID.value).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderTicket(change.doc);
                } else if (change.type == 'removed'){
                    let li = ticketList.querySelector('[data-id=' + change.doc.id + ']');
                    ticketList.removeChild(li);
                }
            });
        });
    } else if (searchID == '' && searchFlightID != ''){
        db.collection('tickets').where('flightID', '==', searchTicketForm.flightID.value).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderTicket(change.doc);
                } else if (change.type == 'removed'){
                    let li = ticketList.querySelector('[data-id=' + change.doc.id + ']');
                    ticketList.removeChild(li);
                }
            });
        });
    }
});

// clear data after search
clearTicketSearch.addEventListener("click", (e) => {
    e.preventDefault();
    while (ticketList.firstChild){
        ticketList.removeChild(ticketList.firstChild);
    }
    db.collection('tickets').orderBy('ID').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added'){
                renderTicket(change.doc);
            } else if (change.type == 'removed'){
                let li = ticketList.querySelector('[data-id=' + change.doc.id + ']');
                ticketList.removeChild(li);
            }
        });
    });
    searchTicketForm.ID.value = '';
    searchTicketForm.flightID.value = '';
});


// display all
db.collection('tickets').orderBy('ID').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added'){
            renderTicket(change.doc);
        } else if (change.type == 'removed'){
            let li = ticketList.querySelector('[data-id=' + change.doc.id + ']');
            ticketList.removeChild(li);
        }
    })
})
