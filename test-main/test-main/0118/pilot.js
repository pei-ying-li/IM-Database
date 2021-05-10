const pilotList = document.querySelector("#pilot-list");
const pilotForm = document.querySelector("#add-pilot-form");
const searchPilotForm = document.querySelector("#search-pilot-form");

function renderPilot(doc){
    let li = document.createElement('li');
    let identity = document.createElement('span');
    let name = document.createElement('span');
    let miles = document.createElement('span');
    let gender = document.createElement('span');
    let cross = document.createElement('div');
    // let revise = document.createElement('button');

    li.setAttribute('data-id', doc.id);
    identity.textContent = 'ID: ' + doc.data().ID;
    name.textContent = 'name: ' + doc.data().name;
    miles.textContent = 'flight mileage: ' + doc.data().miles;
    gender.textContent = 'gender: ' + doc.data().gender;
    cross.textContent = 'x';

    // revise.textContent = 'revise';
    // revise.setAttribute('onclick', 'displayPilotRevise()');

    li.appendChild(identity)
    li.appendChild(name);
    li.appendChild(miles);
    li.appendChild(gender);
    li.appendChild(cross);
    // li.appendChild(revise);

    // let reviseForm = document.createElement('form');
    // reviseForm.id = 'revisePilotForm';
    // //reviseForm.style.display = 'none';

    // let inputID = document.createElement('input');
    // inputID.setAttribute('type', 'text');
    // inputID.setAttribute('name', 'inid');
    // inputID.setAttribute('placeholder', 'pilot ID');

    // let inputName = document.createElement('input');
    // inputName.setAttribute('type', 'text');
    // inputName.setAttribute('name', 'inname');
    // inputName.setAttribute('placeholder', 'name');

    // let inputMiles = document.createElement('input');
    // inputMiles.setAttribute('type', 'text');
    // inputMiles.setAttribute('name', 'inmiles');
    // inputMiles.setAttribute('placeholder', 'miles');

    // let inputGender = document.createElement('input');
    // inputGender.setAttribute('list', 'browsers');
    // inputGender.setAttribute('name', 'ingender');
    // inputGender.setAttribute('placeholder', 'gender');

    // let genderList = document.createElement('datalist');
    // genderList.id = 'browsers';

    // let male = document.createElement('option');
    // let female = document.createElement('option');

    // genderList.appendChild(male);
    // genderList.appendChild(female);

    // let reviseButton = document.createElement('span');
    // reviseButton.textcontent = 'submit';

    // reviseForm.appendChild(inputID);
    // reviseForm.appendChild(inputName);
    // reviseForm.appendChild(inputMiles);
    // reviseForm.appendChild(inputGender);
    // reviseForm.appendChild(reviseButton);
    // li.appendChild(reviseForm);

    pilotList.appendChild(li);

    // delete data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('pilots').doc(id).delete();
    });

    // // revise data
    // reviseButton.addEventListener('submit', (e) => {
    //     e.stopPropagation();
    //     let id = e.target.parentElement.getAttribute('data-id');
    //     db.collection('revise').doc(id).update({
    //         ID: reviseForm.inid.value,
    //         name: reviseForm.inname.value,
    //         miles: reviseForm.inmiles.value,
    //         gender: reviseForm.ingender.value
    //     });
    // })
}

// function displayPilotRevise(){
//     //
// }

// adding data
pilotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let inputID = pilotForm.id.value;
    let inputname = pilotForm.name.value;
    let inputmiles = pilotForm.miles.value;
    let inputgender = pilotForm.gender.value;

    if(inputID == "" || inputname == "" || inputmiles == "" || inputgender == ""){
         window.alert("Please enter with no space~");  
    }
    
    else{
        db.collection('pilots').where('ID', '==', inputID).get().then(snapshot => {
            if (!snapshot.empty){
                window.alert("You have entered a repeated ID, please enter again.");
            }else{
                db.collection('pilots').add({
                    ID: inputID,
                    name: inputname,
                    miles: inputmiles, 
                    gender: inputgender
                });
            }
        })
    }
    pilotForm.id.value = '';
    pilotForm.name.value = '';
    pilotForm.miles.value = '';
    pilotForm.gender.value = '';
})


let clearPilotSearch = document.createElement('button');
clearPilotSearch.textContent = "clear";
searchPilotForm.appendChild(clearPilotSearch);

// search data
searchPilotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    while (pilotList.firstChild){
        pilotList.removeChild(pilotList.firstChild);
    }

    let searchID = searchPilotForm.id.value;
    let searchName = searchPilotForm.name.value;
    let searchGender = searchPilotForm.gender.value;

    if (searchID != ''){
        db.collection('pilots').where('ID', '==', searchID).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderPilot(change.doc);
                } else if (change.type == 'removed'){
                    let li = pilotList.querySelector('[data-id=' + change.doc.id + ']');
                    pilotList.removeChild(li);
                }
            });
        });
    } else if (searchID == '' && searchName != '' && searchGender == ''){
        db.collection('pilots').where('name', '==', searchName).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderPilot(change.doc);
                } else if (change.type == 'removed'){
                    let li = pilotList.querySelector('[data-id=' + change.doc.id + ']');
                    pilotList.removeChild(li);
                }
            });
        });
    } else if (searchID == '' && searchName == '' && searchGender != ''){
        console.log(searchGender);
        db.collection('pilots').where('gender', '==', searchGender).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderPilot(change.doc);
                } else if (change.type == 'removed'){
                    let li = pilotList.querySelector('[data-id=' + change.doc.id + ']');
                    pilotList.removeChild(li);
                }
            });
        });
    }
});

// clear data after search
clearPilotSearch.addEventListener("click", (e) => {
    e.preventDefault();
    while (pilotList.firstChild){
        pilotList.removeChild(pilotList.firstChild);
    }
    db.collection('pilots').orderBy('ID').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added'){
                renderPilot(change.doc);
            } else if (change.type == 'removed'){
                let li = pilotList.querySelector('[data-id=' + change.doc.id + ']');
                pilotList.removeChild(li);
            }
        });
    });
    searchPilotForm.id.value = '';
    searchPilotForm.name.value ='';
    searchPilotForm.gender.value = '';
});

// display all
db.collection('pilots').orderBy('ID').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added'){
            renderPilot(change.doc);
        } else if (change.type == 'removed'){
            let li = pilotList.querySelector('[data-id=' + change.doc.id + ']');
            pilotList.removeChild(li);
        }
    })
})