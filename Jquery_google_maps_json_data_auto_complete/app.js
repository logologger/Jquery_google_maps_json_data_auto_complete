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
            
             var map=new GMap2(document.getElementById("map"));
              var location=new GLatLng(data[count].latlng[0],data[count].latlng[1]);
              map.setCenter(location,4);
            
            
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
  
  
});