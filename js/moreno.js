
	var controller = null;
	var map;
	var bounds;
	var geocoder;

	var initialized = false;

	$.fn.preload = function() {
	    this.each(function(){
	        $('<img/>')[0].src = this;
	    });
	}

	$(document).ready(function() {
		$(['img/evenements/evenements_manequin.png',
				'img/collections/evenements_manequin1.png',
				'img/collections/evenements_manequin2.png',
				'img/collections/evenements_manequin3.png',
				'img/concept/concept1.jpg',
				'img/concept/concept2.jpg',
				'img/concept/concept3.jpg',
				'img/concept/concept4.jpg',
				'img/collections/evenements_manequin4.png']).preload();
		$.pageLoader();

			


		
	});

	function init()
	{
		if(!initialized)
		{
			$('body').css('visibility','visible');
			initScrollAnimations();
			setEventListener();
			map = setMap();	
			manageResize();
			makeSelects();
			makeScrollBar();
			makeLinks();
			scrolltoHome();
			manageInputText();
			getForeignSalons('France');
			initialized = true;

			
		}
	}


	function loadPlayer()
	{
		jwplayer("fmvideo").setup({
	        file: "http://youtu.be/ib6RyJVG0JU",
	        image: "videos/poster.jpg"
    	});
	}

	function scrolltoHome()
	{
		TweenLite.to(window, 0.5, {scrollTo:{y:$('#home').offset().top}, ease:Quint.easeOut});
		
	}

	var default_input_value = 'Par ville ou code postal...';
	function manageInputText()
	{


		$('#map_input_txt').focus(function()
		{
			if($(this).val() == default_input_value)
			{
				$(this).val('');
			}
		});
		$('#map_input_txt').focusout(function()
		{
			if($(this).val() == '')
			{
				$(this).val(default_input_value);
			}
		});
	}

	function makeLinks()
	{
		$('#bandeau_menu_part a, .div_link_moreno').click(function()
		{
			var rel =$(this).attr('rel');
			if(rel != undefined)
			{
				var _y = $('#'+rel).offset().top -60;
				TweenLite.to(window, 4, {scrollTo:{y:_y}, ease:Quint.easeOut});
			}
		});

		$('#find_salon').click(function()
		{
			var _y = $('#map_part').offset().top -60;
			TweenLite.to(window, 4, {scrollTo:{y:_y}, ease:Quint.easeOut});
		});

		$('#home_link_marque').click(function()
		{
			TweenLite.to(window, 4, {scrollTo:{y:0}, ease:Quint.easeOut});
		});

		$('#home_link_concept').click(function()
		{
			var _y = $('#tendances').offset().top -60;
			TweenLite.to(window, 4, {scrollTo:{y:_y}, ease:Quint.easeOut});
		});
	}
	function makeScrollBar()
	{

		$('#map_salons_container').mCustomScrollbar();
	}
	function makeSelects()
	{

		$('.mini_moreno_select').Selectyze({
			theme : 'mini_moreno',
			effectOpen : 'fade'
		});
		$('.moreno_select').Selectyze({
			theme : 'moreno',
			effectOpen : 'fade'
		});
		setMapSelectListener();

	}

	function manageResize()
	{
		$(window).resize(function() {

			var bodywidth = $(document).width();
			/*if(bodywidth > 1280)
			{
				bodywidth = 1280;
			}else*/ if(bodywidth < 1024)
			{
				bodywidth = 1024;
			}
		    //$(".titlebar").width(bodywidth);
		    $("#map_canvas").width(bodywidth);
		});


	}


	function setMap()
	{
		var myLatlng = new google.maps.LatLng(46.52863469527167,2.43896484375);
			var myOptions = {
			zoom: 6,
			scrollwheel: false,
			center: myLatlng,
			scaleControl: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		geocoder = new google.maps.Geocoder();
		bounds = new google.maps.LatLngBounds();


		var input = /** @type {HTMLInputElement} */(document.getElementById('map_input_txt'));
  		var autocomplete = new google.maps.places.Autocomplete(input);
  		autocomplete.bindTo('bounds', map);
  		google.maps.event.addListener(autocomplete, 'place_changed', function() {
  			Search();
		});

 		 
		return map;
	}

	var tendance_test_cursor = 0;
	function setEventListener()
	{


		$('#concept_detail_button').click(function()
		{
			// on scrolle pour avoir la fenetre entiere
			TweenLite.to(window, 2, {scrollTo:{y:3875}, ease:Bounce.easeOut});
			$('#concept_bloc_texte').show('slow');
		});
		$('#concept_close_button').click(function()
		{
			$('#concept_bloc_texte').hide('slow');
		});


		
		$('#slider img').click(function()
		{
			if(true || !concept_is_sliding)
			{
				//concept_is_sliding = true;
				//$('#concept').fadeOut('slow',function()
				//{
					changeConceptBackground();
				//});

			}
			
			

		}
		);
		
		
		$('#collection1').click(function()
		{	
			if(tendance_test_cursor == 0)
			{
				var index = tendance_test_cursor+1;
				$('#tendances_manequin').addClass('tendeance_test1');
				tendance_test_cursor ++;
			}else
			{
				if(tendance_test_cursor < 4)
				{
					var index = tendance_test_cursor+1;
					$('#tendances_manequin').removeClass('tendeance_test'+tendance_test_cursor);
					$('#tendances_manequin').addClass('tendeance_test'+index);
					tendance_test_cursor ++;
				}else
				{
						$('#tendances_manequin').removeClass('tendeance_test'+tendance_test_cursor);
						tendance_test_cursor = 0;
				}
				
			}

			
		});
		
		
		
		$('#concept1').click(function()
		{
			if(true || !concept_is_sliding)
			{
				//concept_is_sliding = true;
				//$('#concept').fadeOut('slow',function()
				//{
					changeConcept();
				//});

			}
			
			

		}
		);
		
		$('#concept2').click(function()
		{
			if(true || !concept_is_sliding)
			{
				//concept_is_sliding = true;
				//$('#concept').fadeOut('slow',function()
				//{
					changeConcept2();
				//});

			}
			
			

		}
		);
		
		$('#concept3').click(function()
		{
			if(true || !concept_is_sliding)
			{
				//concept_is_sliding = true;
				//$('#concept').fadeOut('slow',function()
				//{
					changeConcept3();
				//});

			}
			
			

		}
		);
		
		$('#concept4').click(function()
		{
			if(true || !concept_is_sliding)
			{
				//concept_is_sliding = true;
				//$('#concept').fadeOut('slow',function()
				//{
					changeConcept4();
				//});

			}
			
			

		}
		);
		

		$('#evenement_button').click(function()
		{
			$('#popup_evenements').dialog(
			{
				width:995,
				height:480,
				dialogClass:'popupEvents'
			});
		});

		$('#evenement_bulle_clicker').click(function()
		{
			window.open($('#go_facebook').attr('href'));
		});

		$('#collection_clicker_div').click(function()
		{
			$('#popup_video').dialog(
			{
				open: function()
				{
					//loadPlayer();
					$('#fmvideo').html('<iframe width="853" height="480" src="//www.youtube.com/embed/ib6RyJVG0JU" frameborder="0" allowfullscreen></iframe>');
				},
				width:900,
				height:540,
				dialogClass:'popupVideo',
				beforeClose: function()
				{
					//jwplayer("fmvideo").stop();
					$('#fmvideo').empty();
				}
				
			});
		});


		$('#map_search_button').click(function()
		{
			Search();
		});

	  // GESTION du focus sur le champ texte.
      SEARCH_INPUT_DEFAULT_VAL =  $('#map_input_txt').val();
      $('#map_input_txt').focus(function()
      {
         if($(this).val() ==SEARCH_INPUT_DEFAULT_VAL)
         {
            $(this).val('');
         }
      });
      $('#map_input_txt').focusout(function()
      {
         if($(this).val() =='')
         {
            $(this).val(SEARCH_INPUT_DEFAULT_VAL);
         }
      });

      setListenersSelections();

      $('#search_form').submit(function()
      {
      	$('#map_search_button').click();
      	return false;
      });


      $('#logo').click(function()
      {
      	scrolltoHome();
      });

	}


	function setListenersSelections()
	{
	  // clic sur un salon dans le menu
      $('.template_salon').click(function()
      {
         $('.template_salon.selected').removeClass('selected');
         $(this).addClass('selected');
         centerMapOnMarker($(this).attr('id'));
      });

      	//gestion du clic sur les logos facebook des salons.
		$('.map_facebook_logo').click(function()
		{
				window.open($(this).attr('rel'));
				return false;
		});	
	}

	var test = 0;
	var concept_is_sliding = false;

    /**
     * changeConceptBackground
     * 
     * @access public
     *
     * @return mixed Value.
     */
	function changeConceptBackground()
	{
		if(test == 0)
		{
			
			$('#concept').css("background-image", "url(img/concept/bagi-warrior.jpg)");
		}else if( test == 1)
		{
				$('#concept').css("background-image", "url(img/concept/image.jpeg)");  
		}else
		{
			$('#concept').css("background-image", "url(img/concept/fond_concept.jpg)"); 
		}
		test++;
		if(test == 3)
		{
			test = 0;
		}
		/*
		$('#concept').fadeIn('slow',function()
		{
			concept_is_sliding = false;
		}); */
	}
	
	function changeCollection()
	{

			$('#tendances_manequin').css("background-image", "url(img/collections/evenements_manequin1.png)");

	}
	
		function changeCollection2()
	{

			$('#tendances_manequin').css("background-image", "url(img/collections/evenements_manequin2.png)");

	}
	
		function changeCollection3()
	{

			$('#tendances_manequin').css("background-image", "url(img/collections/evenements_manequin4.png)");

	}
	
		function changeCollection4()
	{

			$('#tendances_manequin').css("background-image", "url(img/collections/evenements_manequin3.png)");

	}
	
	function changeConcept()
	{

			$('#concept').css("background-image", "url(img/concept/concept1.jpg)");

	}
	
		function changeConcept2()
	{

			$('#concept').css("background-image", "url(img/concept/concept2.jpg)");

	}
	
		function changeConcept3()
	{

			$('#concept').css("background-image", "url(img/concept/concept3.jpg)");

	}
	
		function changeConcept4()
	{

			$('#concept').css("background-image", "url(img/concept/concept4.jpg)");

	}
	
	


	function initScrollAnimations()
	{
		$('#home_goutte_1').parallax("45%", 1.5);
		$('#home_goutte_2').parallax("50%", 0.3);
		$('#home_manequins').parallax('50%',0.1);

		$('#tendances_fauteuil').parallax("50%", 0.5);
		$('#tendances_brosse').parallax("50%", 0.4);
		$('#tendances_manequin').parallax("50%", 1);

		$('#evenements_goutte').parallax('50%',0.4);
		$('#evenements_manequin').parallax('50%',0.8);
		$('#evenements_produit').parallax('50%',-0.5);

		$('#prochainement_peigne').parallax('50%',0.4);

		//$('#home').parallax("50%", 0.5);
		controller = $.superscrollorama();


/*		controller.addTween(
				$('#home_rond_container'),
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#home_rond_container'), 1, 
							{css:{top: 400}, immediateRender:true}, 
							{css:{top: 600}})
						
							
					]),
				1000 // scroll duration of tween,
				
			);*/
		
		/*
		controller.addTween(
				$('#home').offset().top - 400,
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#home_goutte_1'), 1, 
							{css:{top: 39}, immediateRender:true}, 
							{css:{top: 200}})
						
							
					]),
				2000 // scroll duration of tween,
				
			);*/
		/*
		controller.addTween(
				$('#home').offset().top - 400,
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#home_goutte_2'), 1, 
							{css:{top: -100}, immediateRender:true}, 
							{css:{top: 152}}
							)
						
							
					]),
				1500 // scroll duration of tween,
				
			);		*/


		//ROND HOME
/*		controller.addTween(
				$('#home').offset().top - 400,
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#home_rond_container'), 1, 
							{css:{top: -600}, immediateRender:true}, 
							{css:{top: -100}}
							)
						
							
					]),
				1000 // scroll duration of tween,
				
			);*/



		//popup de gauche
		/*
		controller.addTween(
				850,
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#concept_bloc_texte'), 1, 
							{css:{marginLeft: 1280,alpha:0}, immediateRender:true}, 
							{css:{marginLeft: 0,alpha:1}})
						
							
					]),
				300 // scroll duration of tween,
				
			);
		*/

		// parralax table
/*		controller.addTween(
				$('#concept').offset().top +300,
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#concept_table'), 1, 
							{css:{top: -150}, immediateRender:true}, 
							{css:{top: -800}}),
						TweenMax.fromTo($('#concept_brosse'), 1, 
							{css:{top: -1300}, immediateRender:true}, 
							{css:{top: 0}})	
							
					]),
				1000 // scroll duration of tween,
				
			);


		// parralax brosse
		controller.addTween(
				$('#concept').offset().top -500,
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#concept_brosse'), 1, 
							{css:{top: -1100,right:-300,rotation:0}, immediateRender:true}, 
							{css:{top: 0,right:-1200,rotation:160}})	
							
					]),
				2000 // scroll duration of tween,
				
			);
*/
	/*#######################################################################################################*/
	/*###                                      TENDANCES                                                  ###*/
	/*#######################################################################################################*/
		//parallax tendance manequin
/*		controller.addTween(
				$('#tendances').offset().top -800,
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#tendances_manequin'), 1, 
							{css:{top: -150}, immediateRender:true}, 
							{css:{top: 150}})	
							
					]),
				1100 // scroll duration of tween,
				
			);*/
/*
		//parallax tendance fauteuil
		controller.addTween(
				$('#tendances'),
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#tendances_fauteuil'), 1, 
							{css:{top: -400}, immediateRender:true}, 
							{css:{top: -1200}})	
							
					]),
				1100 // scroll duration of tween,
				
			);


		// lampe partie tendances
		controller.addTween(
				$('#tendances'),
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#tendances_lampe'), 1, 
							{css:{top: -1800, right:-107}, immediateRender:true}, 
							{css:{top: -800,right:220}})	
							
					]),
				1100 // scroll duration of tween,
				
			);
*/

	/*#######################################################################################################*/
	/*###                                      COLLECTIONS                                                  ###*/
	/*#######################################################################################################*/
		/*

		// titres collection
		controller.addTween(
				$('#collections'),
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#collections_titles'), 1, 
							{css:{top: -300}, immediateRender:true}, 
							{css:{top: 250}})	
							
					]),
				300 // scroll duration of tween,
				
			);

		// spray collection
		controller.addTween(
				$('#collections'),
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#collections_spray'), 1, 
							{css:{left: -1500,rotation:-280,top:-100}, immediateRender:true}, 
							{css:{left: 3000,rotation:360,top:200}})	
							
					]),
				3000 // scroll duration of tween,
				
			);


	*/
	/*#######################################################################################################*/
	/*###                                      GIMME                                                      ###*/
	/*#######################################################################################################*/
	/*
		controller.addTween(
				$('#collections'),
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#gimme_gouttes'), 1, 
							{css:{top:0 }, immediateRender:true}, 
							{css:{top: 1200}})	
							
					]),
				4000 // scroll duration of tween,
				
			);


		// manequin
		controller.addTween(
				$('#gimme_peigne'),
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#gimme_mannequin'), 1, 
							{css:{top:-0 }, immediateRender:true}, 
							{css:{top: 300}})	
							
					]),
				1000 // scroll duration of tween,
				
			);



		// pot
		controller.addTween(
				$('#gimmeMore'),
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#gimme_pot'), 1, 
							{css:{top:0,left:0 }, immediateRender:true}, 
							{css:{top: 400,left:100}})	
							
					]),
				1500 // scroll duration of tween,
				
			);
		// canape
		controller.addTween(
				$('#gimmeMore'),
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#gimme_canape_mobile'), 1, 
							{css:{top:0,left:0 }, immediateRender:true}, 
							{css:{top: 100,left:-100}})	
							
					]),
				1500 // scroll duration of tween,
				
			);

			// peigne
		controller.addTween(
				$('#gimmeMore').offset().top-800,
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#gimme_peigne_anim'), 1, 
							{css:{rotation:0,left:0 }, immediateRender:true}, 
							{css:{rotation: -180,left:-800}})	
							
					]),
				1500 // scroll duration of tween,
				
			);	


		//plumeau
		controller.addTween(
				$('#gimmeMore'),
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#gimme_tondeuse img'), 1, 
							{css:{rotation:-180,left:-800 }, immediateRender:true}, 
							{css:{rotation: 0,left:480}})	
							
					]),
				800 // scroll duration of tween,
				
			);

*/
	/*#######################################################################################################*/
	/*###                                      EVENEMENTS                                                      ###*/
	/*#######################################################################################################*/
	/*
	// siege
		controller.addTween(
				$('#evenements').offset().top-600,
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#ev_siege'), 1, 
							{css:{left:-900,opacity:0 }, immediateRender:true}, 
							{css:{left: 25,opacity:1}})	
							
					]),
				500 // scroll duration of tween,
				
			);

*/
		controller.addTween(
				0,
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#marque_seche_cheveux'), 1, 
							{css:{rotation:0,opacity:1 }, immediateRender:true}, 
							{css:{rotation: 50,opacity:1}})	
							
					]),
				600 // scroll duration of tween,
				
			);


		controller.addTween(
				0,
				(new TimelineLite())
					.append([
						TweenMax.fromTo($('#marque_peigne'), 1, 
							{css:{top:0 }, immediateRender:true}, 
							{css:{top:435}})	
							
					]),
				600 // scroll duration of tween,
				
			);
		
	}

