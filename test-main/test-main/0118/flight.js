const flightList = document.querySelector("#flight-list")
const flightForm = document.querySelector("#add-flight-form")
const searchFlightForm = document.querySelector("#search-flight-form")

function renderFlight(doc){
    // setting adding page
    let li = document.createElement('li');
    let flightID = document.createElement('span');
    let routeID = document.createElement('span');
    let departDate = document.createElement('span');
    let departTime = document.createElement('span');
    let pilotID = document.createElement('span');
    let planeID = document.createElement('span');
    let cross = document.createElement('div');
    //let revise = document.createElement('button');

    li.setAttribute('data-id', doc.id);
    flightID.textContent = 'flight ID: '+ doc.data().flightID;
    routeID.textContent = 'route ID: ' + doc.data().routeID;
    departDate.textContent = 'departure date: ' + doc.data().departDate;
    departTime.textContent = 'departure time: ' + doc.data().departTime;
    pilotID.textContent = 'pilot ID: ' + doc.data().pilotID;
    planeID.textContent = 'plane ID: ' + doc.data().planeID;
    cross.textContent = 'x';
    //revise.textContent = 'revise';
    //revise.setAttribute("onclick", "displayFlightsRevised()");

    li.appendChild(flightID);
    li.appendChild(routeID);
    li.appendChild(departDate);
    li.appendChild(departTime);
    li.appendChild(pilotID);
    li.appendChild(planeID);
    li.appendChild(cross);
    //li.appendChild(revise);

    // setting revise page
    /*
    let reviseForm = document.createElement('form');
    reviseForm.id = "reviseRouteForm";
    reviseForm.style.display = "none";
    
    let inputflightID = document.createElement('input');
    inputflightID.setAttribute("type", "text");
    inputflightID.setAttribute("name", "inFID");
    inputflightID.setAttribute("placeholder", "flight ID");

    let inputrouteID = document.createElement('input');
    inputrouteID.setAttribute("type", "text");
    inputrouteID.setAttribute("name", "inRID");
    inputrouteID.setAttribute("placeholder", "route ID");
    
    let inputdepartDate = document.createElement('input');
    inputdepartDate.setAttribute("type", "text");
    inputdepartDate.setAttribute("name", "inDDate");
    inputdepartDate.setAttribute("placeholder", "departDate");

    let inputdepartTime = document.createElement('input');
    inputdepartTime.setAttribute("type", "text");
    inputdepartTime.setAttribute("name", "inDTime");
    inputdepartTime.setAttribute("placeholder", "departTime");

    let inputpilotID = document.createElement('input');
    inputpilotID.setAttribute("type", "text");
    inputpilotID.setAttribute("name", "inPilotID");
    inputpilotID.setAttribute("placeholder", "pilot ID");

    let inputplaneID = document.createElement('input');
    inputplaneID.setAttribute("type", "text");
    inputplaneID.setAttribute("name", "inPlaneID");
    inputplaneID.setAttribute("placeholder", "plane ID");

    let reviseButton = document.createElement('button');
    reviseButton.textContent = 'submit';

    reviseForm.appendChild(inputflightID);
    reviseForm.appendChild(inputrouteID);
    reviseForm.appendChild(inputdepartDate);
    reviseForm.appendChild(inputdepartTime);
    reviseForm.appendChild(inputpilotID);
    reviseForm.appendChild(inputplaneID);
    reviseForm.appendChild(reviseButton);
    */
    flightList.appendChild(li);

    ///deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation(); 
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('flights').doc(id).delete();
    })

    // revising data
    /*
    reviseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('flights').doc(id).update({
            flightID: reviseForm.inFID.value,
            routeID: reviseForm.inRID.value,
            departDate: reviseForm.inDDate.value,
            departTime: reviseForm.inDTime.value,
            pilotID: reviseForm.inPilotID.value,
            planeID: reviseForm.inPlaneID.value
        });
        reviseForm.inFID.value = '';
        reviseForm.inRID.value = '';
        reviseForm.inDDate.value ='';
        reviseForm.inDTime.value ='';
        reviseForm.inPilotID.value ='';
        reviseForm.inPlaneID.value ='';
    })
    */
}

/*
function displayFlightsRevised(){
    let frf = document.getElementById("reviseFlightForm");
    if(frf.style.display == "none"){
        frf.style.display = "block";
    }
    else{
        frf.style.display = "none";
    }
}
*/


// adding data
flightForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let inputID = flightForm.flightID.value;
    let inputrouteID = flightForm.routeID.value;
    let inputdepDate = flightForm.departDate.value;
    let inputdepTime = flightForm.departTime.value;
    let inputpilotID = flightForm.pilotID.value;
    let inputplaneID = flightForm.planeID.value;

    if(inputID == "" || inputrouteID == "" || inputdepDate == ""
       || inputdepTime == "" || inputpilotID == "" || inputplaneID == ""){
         window.alert("Please enter with no space~");  
    }
    else{
        db.collection('flights').where('flightID', '==', inputID).get().then(snapshot => {
            if (!snapshot.empty){
                window.alert("You have entered a repeated ID, please enter again.");
            }else{
                db.collection('flights').add({
                    flightID: inputID,
                    routeID: inputrouteID,
                    departDate: inputdepDate,
                    departTime: inputdepTime,
                    pilotID: inputpilotID,
                    planeID: inputplaneID
                });
            }
        })
    }
    
    //to empty the adding block
    flightForm.flightID.value = '';
    flightForm.routeID.value = '';
    flightForm.departDate.value = '';
    flightForm.departTime.value = '';
    flightForm.pilotID.value = '';
    flightForm.planeID.value = '';
})


let clearSearchFlight = document.createElement('button');
clearSearchFlight.textContent = "clear";
searchFlightForm.appendChild(clearSearchFlight);


// search data
searchFlightForm.addEventListener('submit', (e) => {
    e.preventDefault();
    while (flightList.firstChild){
        flightList.removeChild(flightList.firstChild);
    }

    let searchID = searchFlightForm.flightID.value;
    let searchRouteID = searchFlightForm.routeID.value;

    if (searchID != ''){
        db.collection('flights').where('flightID', '==', searchFlightForm.flightID.value).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderFlight(change.doc);
                } else if (change.type == 'removed'){
                    let li = flightList.querySelector('[data-id=' + change.doc.id + ']');
                    flightList.removeChild(li);
                }
            });
        });
    } else if (searchID == '' && searchRouteID != ''){
        db.collection('flights').where('routeID', '==', searchFlightForm.routeID.value).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added'){
                    renderFlight(change.doc);
                } else if (change.type == 'removed'){
                    let li = flightList.querySelector('[data-id=' + change.doc.id + ']');
                    flightList.removeChild(li);
                }
            });
        });
    }
});

// clear data after search
clearSearchFlight.addEventListener("click", (e) => {
    e.preventDefault();
    while (flightList.firstChild){
        flightList.removeChild(flightList.firstChild);
    }
    db.collection('flights').orderBy('flightID').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added'){
                renderFlight(change.doc);
            } 
            else if (change.type == 'removed'){
                let li = flightList.querySelector('[data-id=' + change.doc.id + ']');
                flightList.removeChild(li);
            }
        });
    });
    searchFlightForm.flightID.value = '';
    searchFlightForm.routeID.value = '';
});


// real-time listener
db.collection('flights').orderBy('flightID').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added'){
            renderFlight(change.doc);
        } 
        else if (change.type == 'removed'){
            let li = flightList.querySelector('[data-id=' + change.doc.id + ']');
            flightList.removeChild(li);
        }
    })
})