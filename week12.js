class Plant {
    constructor(name) {
        this.plantname = name;
        this.daystoharvest = "Not Specified";
        this.season = "Not Specified";
    }

}





class PlantService {
    static url = 'https://640d4b41b07afc3b0daaeb4e.mockapi.io/plants';

    static getAllPlants() {
        return $.get(this.url);
    }

    static getPlant(id) {
        return $.get(this.url + `/${id}`);
    }

    static addPlant(plant) {
        return $.post(this.url, plant);
    }

    static updatePlant(plant) {
        return $.ajax({
            url: this.url + `/${plant.id}`,
            dataType: 'json',
            data: JSON.stringify(plant),
            contentType: 'application/json',
            type: 'PUT'

        });
    }


    static deletePlant(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }

}

class DOMManager {
    static plants;

    static getAllPlants() {
        PlantService.getAllPlants().then(plants => this.render(plants));
    }

    static deletePlant(id) {
        PlantService.deletePlant(id)
            .then(() => {
                return PlantService.getAllPlants();
            })
            .then((plants) => this.render(plants))
            .then(() => {
                let alertDiv = document.getElementById('alertDiv');
                alertDiv.className="";
                
                alertDiv.innerHTML = "Plant Has Been Deleted";
                alertDiv.classList.add("alert");
                alertDiv.classList.add("alert-danger");
            });
;
    }

    static addPlant(name) {
        PlantService.addPlant(new Plant(name))
            .then(() => {
                return PlantService.getAllPlants();
            })
            .then((plants) => this.render(plants))
            .then(() => {
                let alertDiv = document.getElementById('alertDiv');
                alertDiv.className="";

                alertDiv.innerHTML = "Plant Has Been Added!";
                alertDiv.classList.add("alert");
                alertDiv.classList.add("alert-success");
            });;
    }

    static updatePlant(id) {
        for (let plant of this.plants) {
            console.log(plant.id + "    " + id);
            if (plant.id == id) {
                //plant.push(new Room($(`#${plant._id}-room-name`).val(), $(`#${plant._id}-room-area`).val()));
                plant.daystoharvest = $(`#${plant.id}-Harvest`).val();
                console.log(plant.daystoharvest);
                console.log($(`#${plant.id}-Harvest`).val());
                plant.season = $(`#${plant.id}-Season`).val();
                console.log(plant.season);
                console.log($(`#${plant.id}-Season`).val());
                PlantService.updatePlant(plant)
                    .then(() => {
                        return PlantService.getAllPlants();
                    })
                    .then((plants) => this.render(plants))
                    .then(() => {
                        let alertDiv = document.getElementById('alertDiv');
                        alertDiv.className="";
                        
                        alertDiv.innerHTML = "Planting Data Updated";
                        alertDiv.classList.add("alert");
                        alertDiv.classList.add("alert-primary");
                    });
            }
        }
    }

    static deletePlanting(plantID) {
        for (let plant of this.plants) {
            if (plant.id == plantID) {


                plant.season = "Not Specified";
                plant.daystoharvest = "Not Specified";

                PlantService.updatePlant(plant)
                    .then(() => {
                        return PlantService.getAllPlants();
                    })
                    .then((plants) => this.render(plants))
                    .then(() => {
                        let alertDiv = document.getElementById('alertDiv');
                        alertDiv.className="";
                        
                        alertDiv.innerHTML = "Planting Data Deleted";
                        alertDiv.classList.add("alert");
                        alertDiv.classList.add("alert-danger");
                    });


            }
        }

    }


    static render(plants) {
        this.plants = plants;
        $('#app').empty();

        for (let plant of plants) {
            $('#app').prepend(
                `<div id="${plant.id}" class="card">
                <div class="card-header">
                    <h2>${plant.plantname}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.deletePlant('${plant.id}')">Delete</button>
                </div>
                 <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm"> 
                                <input type="text" id="${plant.id}-Season" class="form-control" placeholder="Planting Season">
                                
                            </div>

                            <div class="col-sm"> 
                                <input type="text" id="${plant.id}-Harvest" class="form-control" placeholder="Days Till Harvest">
                            </div>
                        </div>

                        <button id="${plant.id}-new-room" onclick="DOMManager.updatePlant('${plant.id}')" class="btn btn-primary">Update Planting Info</button>
                    </div> 
                 </div>
                </div><br>  
                <br>
                
                
                `

            );


            $(`#${plant.id}`).find('.card-body').append(
                `
                <p>
                <span id="name-${plant.id}"><strong>Name: </strong> ${plant.daystoharvest}</span>
                <span id="area-${plant.id}"><strong>Area: </strong> ${plant.season}</span>
                <button class="btn btn-danger" onclick="DOMManager.deletePlanting('${plant.id}','${plant.id}')">Delete Planting Data</button>`

            );

        }
    }

}





$('#create-new-plant').click(() => {
    DOMManager.addPlant($('#new-plant-name').val());
    $('#new-plant-name').val('');
});

DOMManager.getAllPlants(); 