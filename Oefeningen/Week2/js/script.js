(function(){
	"use strict";
	/*jslint browser: true*/
	/*jslint devel: true*/
	let apiAddress = "http://mydomain-lingxu.be/WM/les2/api.php?";

	let apiAddress2 = "http://mydomain-lingxu.be/WM/les2/deel2/testdb.php?";
	/* Vorige lijn aanpassen naar jouw domein! */
	
	let alertEl = document.getElementById("alert");
	let opties = {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "omit" // include, *same-origin, omit
		/* Opgelet : volgende headers niet toevoegen :
		   JSON triggert de pre-flight mode, waardoor de toegang op
		   deze manier niet meer zal lukken.
		*/
		/*, headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		}*/
	};
	
	function getApiGebruiker() {
		// een ONVEILIGE manier om gebruikersgegevens te testen
    
		let url = apiAddress + "m=login";
		// onze php api verwacht een paar parameters
		// we voegen deze toe aan de body van de opties
    
		// body data type must match "Content-Type" header
		opties.body = JSON.stringify({
			name: document.getElementById("login").value,
			password: document.getElementById("pwd").value,
			format: "json"
		}); 
		
		// test de api
		fetch(url, opties)
			.then(function(response) {
				return response.json();
			})
			.then(function(responseData){
				// test status van de response        
				if(responseData.status < 200 || responseData.status > 299) {
					// login faalde, boodschap weergeven
					// Hier kan je ook een groter onderscheid maken tussen de verschillende vormen van login falen.
					alerter("Login mislukt : deze naam/paswoord combinatie bestaat niet");
					// return, zodat de rest van de fetch niet verder uitgevoerd wordt
					return;
				}
        
				// de verwerking van de data
				var list = responseData.data;

				if (Object.keys(list).length > 0) {
					// list bevat minstens 1 property met waarde
					list.ID = parseInt(list.ID);   
					// alles wat via json komt, is standaard een string of een object.
					// hier is het omzetten naar een int wel niet nodig, omdat we er niet met gaan rekenen
					alerter("Gebruikersgevens ok : ID = " + list.ID);
				} else {
					alerter("Login failed : this login/password combination does not exist");
				}

			})
			.catch(function(error) {
				// verwerk de fout
				alertEl.innerHTML = "fout : " + error;
			});
	}

	function getApiProducten() {
		// de producten van de server opvragen en weergeven dmv de alerter functie
		let url = apiAddress2;

		// body data type must match "Content-Type" header
		opties.body = JSON.stringify({
			bewerking: "get",
			table: "producten2",
			format: "json"
			//, user : "test" // als je de authentication in de api op true zet, heb je dit hier wel nodig 
			//, password : "test" // als je de authentication in de api op true zet, heb je dit hier wel nodig
		}); 

		// test de api
		fetch(url, opties)
			.then(function(response) {
				return response.json();
			})
			.then(function(responseData){
				// de verwerking van de data
				var list = responseData.data;
				console.log(responseData.data)
				if (list.length > 0) {
					// er zit minstens 1 item in list, we geven dit ook onmiddelijk weer
					var tLijst = "<span class='rij kOdd'><span class='smallcolumn'>ID</span><span class='smallcolumn2'>Categorie ID</span><span>Product</span><span class='smallcolumn'>Prijs</span></span>";
					for (var i = 0; i < list.length; i++) {
						tLijst += "<span class='rij'><span class='smallcolumn'>" + list[i].PR_ID + "</span><span class='smallcolumn2'>" + list[i].PR_CT_ID + "</span><span>" + list[i].PR_naam + "</span><span class='smallcolumn'>" + list[i].prijs + "</span></span>";
					}
					tLijst += "<br>";

					alerter(tLijst);
				} else {
					alerter("Servertijd kon niet opgevraagd worden");
				}

			})
			.catch(function(error) {
				// verwerk de fout
				alertEl.innerHTML = "fout : " + error;
			});
	}

	function getApiTijd() {
		// de tijd van de server opvragen en weergeven dmv de alerter functie
		let url = apiAddress + "m=getTime";

		// body data type must match "Content-Type" header
		opties.body = JSON.stringify({
			format: "json"
			//, user : "test" // als je de authentication in de api op true zet, heb je dit hier wel nodig 
			//, password : "test" // als je de authentication in de api op true zet, heb je dit hier wel nodig
		}); 

		// test de api
		fetch(url, opties)
			.then(function(response) {
				return response.json();
			})
			.then(function(responseData){
				// de verwerking van de data
				var list = responseData.data;

				if (Object.keys(list).length > 0) {
					// er zit slechts 1 item in de lijst, we geven dit ook onmiddelijk weer
					alerter("Servertijd : " + list.servertime);
				} else {
					alerter("Servertijd kon niet opgevraagd worden");
				}
				

			})
			.catch(function(error) {
				// verwerk de fout
				alerter("<br>API Fout. Probeer later nog eens.<br>(" + error + ")");
			});
	}


	// EventListeners
	document.getElementById("btnTestLogin").addEventListener("click", function(){
		getApiGebruiker();
	});
  
	document.getElementById("btnGetTijd").addEventListener("click", function(){
		getApiTijd();
	});

	document.getElementById("btnGetProducten").addEventListener("click", function(){
		getApiProducten();
	});
  
	// helper functies
	function alerter(message) {
		alertEl.innerHTML = message;
	}



	//CODE oefening 

	// De GUI/formulieren van de bewerkingen
	let FormAddPr = document.getElementById("FormAddPr");
	let FormDellPr = document.getElementById("FormDellPr");
	let FormModPr = document.getElementById("FormModPr");
	// buttons die de GUI weergeven/verbergen van betreffende bewerking
	let ShowBtnAddPr = document.getElementById("showAddProduct");
	let ShowDelProduct = document.getElementById("showDelProduct");
	let ShowModProduct = document.getElementById("showModProduct");
	
	// de uiteindelijke buttons die iets gaan uitvoeren afhankelijk van de gekozen bewerking
	let btnAddProd = document.getElementById("btnaddProd");
	let btnDellProd = document.getElementById("btnDellProd");
	let btnModProd = document.getElementById("btnModProd");
	

	// Events die de GUI tonen/ verbergen

	let button1State = false;
	let button2State = false;
	let button3State = false;

	// events die focus geven aan de reeds geklikte button 
	ShowBtnAddPr.addEventListener("click", function(){

		if (button1State) {
			button1State = false;
			FormDellPr.classList.add('hide')
			FormModPr.classList.add('hide')
			FormAddPr.classList.add('hide')
			ShowBtnAddPr.classList.remove('current')
			ShowDelProduct.classList.remove('current')
			showModProduct.classList.remove('current')
		} else if(button1State == false) {
			button1State = true;
			FormAddPr.classList.remove('hide')
			FormDellPr.classList.add('hide')
			FormModPr.classList.add('hide')
			ShowDelProduct.classList.remove('current')
			showModProduct.classList.remove('current')
			ShowBtnAddPr.classList.add('current')
		}
		
	});
	ShowDelProduct.addEventListener("click", function(){

		if (button2State) {
			button2State = false;
			FormDellPr.classList.add('hide')
			FormModPr.classList.add('hide')
			FormAddPr.classList.add('hide')
			ShowDelProduct.classList.remove('current')
			showModProduct.classList.remove('current')
			ShowBtnAddPr.classList.remove('current')
		} else if(button2State == false) {
			button2State = true;
			FormDellPr.classList.remove('hide')
			FormAddPr.classList.add('hide')
			FormModPr.classList.add('hide')
			ShowBtnAddPr.classList.remove('current')
			showModProduct.classList.remove('current')
			ShowDelProduct.classList.add('current')
		}
	});
	showModProduct.addEventListener("click", function(){

		if (button3State) {
			button3State = false;
			FormDellPr.classList.add('hide')
			FormModPr.classList.add('hide')
			FormAddPr.classList.add('hide')
			ShowDelProduct.classList.remove('current')
			showModProduct.classList.remove('current')
			ShowBtnAddPr.classList.remove('current')
		} else if(button3State == false) {
			button3State = true;
			FormModPr.classList.remove('hide')
			FormDellPr.classList.add('hide')
			FormAddPr.classList.add('hide')
			ShowBtnAddPr.classList.remove('current')
			showModProduct.classList.add('current')
			ShowDelProduct.classList.remove('current')
		}
	});

	
	// functies om producten toetevoegen gebruikmakend van de testdb.php api
	function AddProduct() {
		let url = apiAddress2;
		// onze php api verwacht een paar parameters
		// we voegen deze toe aan de body van de opties
	
		let catSel = document.getElementById("prctid")

		// body data type must match "Content-Type" header
		opties.body = JSON.stringify({
			PR_CT_ID: catSel.options[catSel.selectedIndex].value,
			PR_naam: document.getElementById("prname").value ,
			prijs: document.getElementById("prprice").value,
			bewerking: "add",
			table: "producten2",
			format: "json"
		}); 

		// test de api
		fetch(url, opties)
		.then(function(response) {
			return response.json();
		})
		.then(function(responseData){
			console.log(responseData.message)
			alert(responseData.message + "- Please refresh page!")
		})
		.catch(function(error) {
			// verwerk de fout
			alertEl.innerHTML = "fout : " + error;
		});
	}

	function DeleteProducten() {
		let url = apiAddress2;
		// onze php api verwacht een paar parameters
		// we voegen deze toe aan de body van de opties
		// body data type must match "Content-Type" header

		let ID = "";
		if (document.getElementById('prIdDel').value.length == 0) {
			ID = null;
		}else{
			ID = document.getElementById('prIdDel').value;
		}

		opties.body = JSON.stringify({
			id: ID,
			bewerking: "delete",
			table: "producten2",
			format: "json"
		}); 

		// test de api
		fetch(url, opties)
		.then(function(response) {
			return response.json();
		})
		.then(function(responseData){
			console.log(responseData.message)
			alert(responseData.message + " - STATUS: " + responseData.status + " - Please refresh the page to see any changes, that have been made!")
		})
		.catch(function(error) {
			// verwerk de fout
			alertEl.innerHTML = "fout : " + error;
		});
	}

	function ModifyProducten() {
		let url = apiAddress2;
		let catSel2 = document.getElementById("prmodctid")
		// onze php api verwacht een paar parameters
		// we voegen deze toe aan de body van de opties
		// body data type must match "Content-Type" header

		console.log(document.getElementById('prmodid').value, document.getElementById("prmodname").value, document.getElementById("prmodprice").value, catSel2.options[catSel2.selectedIndex].value)
		
/* 		let ID = "";
		if (document.getElementById('prmodid').value.length == 0) {
			ID = null;
		}else{
			ID = document.getElementById('prmodid').value;
		} */

		opties.body = JSON.stringify({
			id: document.getElementById("prmodid").value,
			PR_naam: document.getElementById("prmodname").value ,
			prijs: document.getElementById("prmodprice").value,
			PR_CT_ID: catSel2.options[catSel2.selectedIndex].value,
			bewerking: "modify",
			table: "producten2",
			format: "json"
		}); 

		// test de api
		fetch(url, opties)
		.then(function(response) {
			return response.json();
		})
		.then(function(responseData){
			console.log(responseData)
			alert(responseData.message + " - STATUS: " + responseData.status + " - Please refresh the page to see any changes, that have been made!")
		})
		.catch(function(error) {
			// verwerk de fout
			alertEl.innerHTML = "fout : " + error;
		});
	}

	// Funtie uitvoeren als er op de buttons geklikt wordt.
	btnAddProd.addEventListener("click", function(){
		AddProduct();
	});
	btnDellProd.addEventListener("click", function(){
		DeleteProducten();
	});

	btnModProd.addEventListener("click", function(){
		ModifyProducten();
	});
})();



