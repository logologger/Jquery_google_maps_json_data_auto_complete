$(document).ready(function()
{

  $('#county').focus();
  console.log("Loading countries from External JSON");
  
  
  //First using Auto complete feature of JqueryUI to auto populate the country
  
  //getting the data from JSON file country.json
  
  
  var country_list_map=[];
  $.getJSON("json/country.json",function(data)
  {
    
    for(var countries in data)
    {
      var country_list=data[countries].country;
      country_list_map.push(country_list);
      
    }
   // JSON.stringify(country_list_map);  ...no need of it
    console.log(country_list_map);
    
   
    
  });
  
  
  
   $('#county').autocomplete(
      {
          source:country_list_map
      });
      
  
  $('#country').on('keypress',function(event)
  {
    
    console.log(event.which);
    if(event.which==13)
    {
      
      console.log("Enter Key pressed");
      var search=$('#county').val();


      
      if(typeof(Storage)!=="undefined")//checking Local Storage support
      {
        if(localStorage.getItem(search))
        {
        
        console.log("You again searched for the same country");
        console.log("Coming from Local Storage "+localStorage.getItem(search));
        }
        else
        {
          console.log("New Country Niggga");
         
        }
      }
      else
      {
        console.log("You poor Browser Just get Update");
      }





      //$.getJSON("https://restcountries.eu/rest/v1/all",function(data)
      
      //External JSON file code upper one
      
      //inner JSON file code
      
      
      $.getJSON("json/country_data.json",function(data)
      {
        
        console.log("checking external JSON...with data "+data[0].name);
        var ind=false;
        for(var count in data)
        {
          
        //  console.log(data[count].name);
          if(data[count].name.toLowerCase()==search.toLowerCase())
          {
            console.log("Country is present in the JSON");
            console.log("Capital is "+data[count].capital);
            $('#capital').html(data[count].capital);//printing the capital
            $('#lat_and_long').html("latitude is "+data[count].latlng[0]+" and longitude is  "+data[count].latlng[1]);//printing the lat and long
            
            //code for the google Map
                    
                    
                    
                    
           //This is the latest version for the google Map version 3.0
           
          var myLatLng = {
            
            lat: data[count].latlng[0], 
            lng: data[count].latlng[1]
            
          };
        
          var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: myLatLng
          });
        
          var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            draggable:true,
            title: data[count].capital
          });
          
            
         //The below code is for the Google Map 2.0     
              /*
            
             var map=new GMap2(document.getElementById("map"));
              var location=new GLatLng(data[count].latlng[0],data[count].latlng[1]);
              map.setCenter(location,4);
          
            
            var myLatLng={
              
              lat:data[count].latlng[0],
              lng:data[count].latlng[1]
            };
            
            var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng
  });


            //setting marker for the map
            
            var marker=new google.maps.Marker(
              {
                position:myLatLng,
                map:map,
                title:'Hello World'
                
              });
            
            */
            
            
            
            //using Localstorage of browser
            
             localStorage.setItem(search,data[count].capital);
            ind=true;
            
          }
        }
        if(!ind)
        {
          $('#capital').html('Sorry No Capital Found !');
          console.log("I found nothing");
        }
        
        
      });
    }
    
  });
  
  $('#current_location').on('click',function()
  {
    console.log('Running to your current location please wait.....');
    if(navigator.geolocation)
    {
      
      
      //This function is more GPS rather then getting your current position nd displayng it is checking after 5 seconds 
      //your  current position
      
     /* 
     
     //Use for GPS services watchposition
     
      navigator.geolocation.watchPosition(function showposition(position)
      {
        console.log("Current latitude is "+position.coords.latitude);
        console.log("Current longigtude is "+position.coords.longitude);
            var myLatLng = {
            
            lat: position.coords.latitude, 
            lng: position.coords.longitude
            
          };
        
          var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: myLatLng
          });
        
          var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Your Current Location'
          });
        
        
      });
      
      */
      console.log("Got your Current Location ..Please wait ");
      console.log("just a second.. here we are");
      navigator.geolocation.getCurrentPosition(function showPosition(position)
      {
        
        console.log("Current latitude is "+position.coords.latitude);
        console.log("Current longigtude is "+position.coords.longitude);
            var myLatLng = {
            
            lat: position.coords.latitude, 
            lng: position.coords.longitude
            
          };
        
          var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: myLatLng
          });
        
        
        //Now in the marker it should show current place or address 
        //This will be achieved using reverse geocoding
        
        //We will be using google Maps Api
        
        var url_lat_lng=position.coords.latitude+","+position.coords.longitude;
        
        var url="http://maps.googleapis.com/maps/api/geocode/json?latlng="+url_lat_lng+"&sensor=true";
        
        $.getJSON(url,function(data)
        {
          console.log("Your Current Address  is "+data.results[0].formatted_address);
          
        });
        
        
        
        
        
          var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            draggable:true,
            title: 'Your Current Location'
          });
          
          //Change the current marker and get its latitude and longitude
          //here dragend is the event after the dragging has ended
          google.maps.event.addListener(marker,'dragend',function(event)
          {
            console.log("latitude is "+event.latLng.lat()+" and longitude is "+event.latLng.lng());
          
          //on changing the marker position we will be printing current address of the marker
                     var url_lat_lng_marker=event.latLng.lat()+","+event.latLng.lng();
                    
                    var url="http://maps.googleapis.com/maps/api/geocode/json?latlng="+url_lat_lng_marker+"&sensor=true";
                    
                    $.getJSON(url,function(data)
                    {
                      if(data.results[0])
                           console.log("Your Current Address  is "+data.results[0].formatted_address);
                      else
                        console.log("Sorry Nobody is living there");
                      
                    });
          
          
          
          
          //setting the center of the map to the draggable position
          
          console.log("Marker position "+marker.position);//prints the Marker latitude and longitude
          map.setCenter(marker.position);//setting the center to the marker
          //marker.setMap(map);//placing the map marker in the map
          
          
          
          
          //This code is actually of no use and irrevelant here
           /*
           
            var map_dragged=new google.maps.Map(document.getElementById('map'),
            {
              zoom:4,
              center:{
                  lat:event.latLng.lat(),
                  lng:event.latLng.lng()
                
              }
              
            });
            new google.maps.Marker({
                    position:{
                        lat:event.latLng.lat(),
                        lng:event.latLng.lng()
                      
                    },
                    map:map_dragged,
                    draggable:true,
                    title:'You dragged me here'
            });
            
            */
          });
        
        
        
      },
      function showError(error)
      {
        
        console.log("Cannot Get your Current Location ..Please try later");
        
      });
    }
    else
    {
      alert('Please upgrade your brwoser');
    }
    
  });
  
  
});