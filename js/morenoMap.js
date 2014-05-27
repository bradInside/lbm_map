
function Search()
{
	codeAddress();

}

function setMapSelectListener()
{
	$('#map_pays_select').change(function()
	{
		getForeignSalons($(this).val());
	});


}


function getForeignSalons(pays)
{
	var _data = "action=getSalonsByCountry&country="+pays;
	$.ajax({
		type:"GET",
		url:"webservice.php",
		data:_data,
		dataType:"json",
		success:function(data,xhr)
		{
			onGetSalonsResult(data);
		},
		error:function()
		{

		}

	});	
}

var salons_markers = [];


function onGetSalonsResult(data)
{
	$('#map_salons_container').empty();
	resetMarkers(); // on remet à Zero les marqueurs affichés
	data.reverse();
	var lg = data.length;
	for(var i=0;i<lg;i++)
	{
		var salon = data[i];
		$('#map_salons_container').append(data[i].html);
		addMarker(salon.Lat,salon.Lng,salon.id);
	}

	makeScrollBar(); // on met à jour la scrollBar
	if(lg != 0)
	{
		map.fitBounds(bounds); // on ajuste la carte aux bounds
	}
	if (map.getZoom() > 16) map.setZoom(14);
	setListenersSelections(); // on ajoute les écouteurs de sélection.
}

function DoSearch(coords)
{
	var rayon = $('#map_rayon_select_container select').val();
	rayon = rayon;

	var _data = "action=getSalons&lat="+coords.lat+"&lng="+coords.lng+"&rayon="+rayon;
	$.ajax({
		type:"GET",
		url:"webservice.php",
		data:_data,
		dataType:"json",
		success:function(data,xhr)
		{
			onGetSalonsResult(data);
		},
		error:function()
		{

		}

	});	
}

/**
	Suppression des markeurs déjà affichés sur la carte.
**/
function resetMarkers()
{
	bounds = new google.maps.LatLngBounds(); // on remet à zero les bounds.
	var lg = salons_markers.length;
	for(var i = 0;i<lg;i++)
	{
		var marker = salons_markers[i];
		marker.setMap(null); // on supprime le marqueur de la carte
	}

	salons_markers.length =0;// on vide le tableau.

}

function addMarker(lat,lng,id)
{
	var myLatLng = new google.maps.LatLng(lat,lng);
	bounds.extend(myLatLng);
	var marker = new google.maps.Marker({
 	 map: map,
  	 position: myLatLng,
  	 icon: 'img/map/moreno_marker.png'
	 });
	marker.morenoid = id;
	salons_markers.push(marker);

	google.maps.event.addListener(marker, 'click', function() {
   	 	map.setZoom(14);
    	map.setCenter(marker.getPosition());
    	var id = marker.morenoid;
    	makeSalonSelection(id);
  });
}


function makeSalonSelection(id)
{
	$('.template_salon.selected').removeClass('selected');
	$('#tp_'+id).addClass('selected');
	$('#map_salons_container').mCustomScrollbar("scrollTo",' #tp_'+id);
}

function centerMapOnMarker(id)
{
	if( id.length >4)
	{
		id = id.substring(3);
		var lg = salons_markers.length;
		for(var i=0;i<lg;i++)
		{
			var marker = salons_markers[i];
			if(marker.morenoid == id)
			{
				map.setCenter(marker.getPosition());
				map.setZoom(14);
				break;
			}

		}
		
	}
}

function checkCodePostal(cp)
{
	// on test si c'est un code postal francais.
	return cp.match(/^((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}$/);
}

function codeAddress() {
	/* Récupération de la valeur de l'adresse saisie */
	var address = $('#map_input_txt').val();
	
	if(checkCodePostal(address))
	{
		// si c'est un code postal, on modifie en rajoutant France derrière.
	}

	/* Appel au service de geocodage avec l'adresse en paramètre */
	geocoder.geocode( { 'address': address,region:'fr' }, function(results, status) {
		/* Si l'adresse a pu être géolocalisée */
		if (status == google.maps.GeocoderStatus.OK) {
			 /* Récupération de sa latitude et de sa longitude */
			var lat = results[0].geometry.location.lat();
			var lng =  results[0].geometry.location.lng();

			map.setCenter(results[0].geometry.location); // on centre la carte sur la recherche.
			/* TEST GEOCODE */
			/*
			 map.setCenter(results[0].geometry.location);
			 var marker = new google.maps.Marker({
			  map: map,
			  position: results[0].geometry.location
			 });
			 */
			 DoSearch({'lat':lat,'lng':lng});
  		}else
  		{
  			alert('Cette ville n\'a pas été trouvée');
  		}
	});
}