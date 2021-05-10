const planeList = document.querySelector("#plane-list");
const planeForm = document.querySelector("#add-plane-form");
const searchPlaneForm = document.querySelector('#search-plane-form');

function renderPlane(doc){
    let li = document.createElement('li');
    let identity = document.createElement('span');
    let mID = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    identity.textContent = 'plane ID: ' + doc.data().ID;
    mID.textContent = 'model ID: ' + doc.data().mID;
    cross.textContent = 'x';

    li.appendChild(identity);
    li.appendChild(mID);
    li.appendChild(cross);

    planeList.appendChild(li);

    // delete data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('planes').doc(id).delete();
    });
}


//adding data
planeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let inputID = planeForm.id.value;
    let inputmodelID = planeForm.mID.value;

    if(inputID == "" || inputmodelID == ""){
         window.alert("Please enter with no space~");  
    }
    else{
        db.collection('planes').where('ID', '==', inputID).get().then(snapshot => {
            if (!snapshot.empty){
                window.alert("You have entered a repeated ID, please enter again.");
            }else{
                db.collection('planes').add({
                    ID: inputID,
                    mID: inputmodelID
                });
            }
        })
    }

    planeForm.id.value = '';
    planeForm.mID.value = '';
});

let clearPlaneSearch = document.createElement('button');
clearPlaneSearch.textContent = "clear";
searchPlaneForm.appendChild(clearPlaneSearch);


// search data
searchPlaneForm.addEventListener('submit', (e) => {
    e.preventDefault();
    while (planeList.firstChild){
        planeList.removeChild(planeList.firstChild);
    }
    let searchID = searchPlaneForm.id.value;
    let searchmodelID = searchPlaneForm.mID.value;

    if (searchID != ''){
        db.collection('planes').where('ID', '==', searchPlaneForm.id.value).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderPlane(change.doc);
                } 
                else if (change.type == 'removed'){
                    let li = planeList.querySelector('[data-id=' + change.doc.id + ']');
                    planeList.removeChild(li);
                }
            });
        });
    }
    else if (searchID == '' && searchmodelID != ''){
        db.collection('planes').where('mID', '==', searchPlaneForm.mID.value).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderPlane(change.doc);
                } 
                else if (change.type == 'removed'){
                    let li = planeList.querySelector('[data-id=' + change.doc.id + ']');
                    planeList.removeChild(li);
                }
            });
        });
    }
});

// clear data after search
clearPlaneSearch.addEventListener("click", (e) => {
    e.preventDefault();
    while (planeList.firstChild){
        planeList.removeChild(planeList.firstChild);
    }
    db.collection('planes').orderBy('ID').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added'){
                renderPlane(change.doc);
            } 
            else if (change.type == 'removed'){
                let li = planeList.querySelector('[data-id=' + change.doc.id + ']');
                planeList.removeChild(li);
            }
        });
    });
    searchPlaneForm.id.value = '';
    searchPlaneForm.mID.value = '';
});



// display all
db.collection('planes').orderBy('ID').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added'){
            renderPlane(change.doc);
        } 
        else if (change.type == 'removed'){
            let li = planeList.querySelector('[data-id=' + change.doc.id + ']');
            planeList.removeChild(li);
        }
    })
})
