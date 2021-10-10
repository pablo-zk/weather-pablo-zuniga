$(function () {
  apiKEY = "992682d486cb8a7de0b93c8fd7e45c78";
  ApiUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=es";

  $("#home").show();
  $("#buscar").hide();
  $("#localizacion").hide();

  $("#home-btn").on("click", function () {
    $("#home").show();
    $("#buscar").hide();
    $("#localizacion").hide();
  });
  $("#buscar-btn").on("click", function () {
    $("#home").hide();
    $("#buscar").show();
    $("#localizacion").hide();
  });
  $("#localizacion-btn").on("click", function (event) {
    event.preventDefault();
    $("#home").hide();
    $("#buscar").hide();
    $("#localizacion").show();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        getWeatherByPosition(lat, long);
        console.log(
          "Found your location nLat : " +
            position.coords.latitude +
            " nLang :" +
            position.coords.longitude
        );
      });
    } else {
      console.log("Browser doesn't support geolocation!");
    }
  });

  function getWeather(city) {
    $.get(ApiUrl + "&q=" + city + "&appid=" + apiKEY, function (tiempo) {
      var result = "";

      if (tiempo.cod != 401) {
        var estado = tiempo.weather;
        var imagen = imagenPorEstado(estado[0].main);
        result += "<ul><li>Estado el cielo: " + estado[0].main + "</li>";
        result += "<li>Descripción: " + estado[0].description;
        result +=
          "<li>Temperatura:" +
          tiempo.main.temp +
          " º</li><ul><li>Max: " +
          tiempo.main.temp_max +
          " º</li><li>Min: " +
          tiempo.main.temp_min +
          " º</li></ul></ul>";
      } else {
        alert("No se ha encontrado el tiempo en ningún país con ese nombre.");
      }
      $(".card").html(imagen + "<div class='card-body'>" + result + "</div>");
      // $(".card-body").html(result);
    });
  }

  function getWeatherByPosition(lat, long) {
    $.get(
      ApiUrl + "&lat=" + lat + "&lon=" + long + "&appid=" + apiKEY,
      function (tiempo) {
        var result = "";

        if (tiempo.cod != 401) {
          var estado = tiempo.weather;
          var imagen = imagenPorEstado(estado[0].main);
          result += "<ul><li>Ciudad: " + tiempo.name + "</li>";
          result += "<li>Estado el cielo: " + estado[0].main + "</li>";
          result += "<li>Descripción: " + estado[0].description;
          result +=
            "<li>Temperatura:" +
            tiempo.main.temp +
            " º</li><ul><li>Max: " +
            tiempo.main.temp_max +
            " º</li><li>Min: " +
            tiempo.main.temp_min +
            " º</li></ul></ul>";
        } else {
          alert("No se ha encontrado el tiempo en ningún país con ese nombre.");
        }
        $("#divLocalizacion").append(imagen);
        $("#divLocalizacion div.card-body").html(result);
      }
    );
  }

  function imagenPorEstado(estado) {
    switch (estado) {
      case "Thunderstorm":
        return "<img src='../assets/img/Thunderstorm.png' class='card-img-top' alt=''>";
      case "Drizzle":
        return "<img src='../assets/img/Drizzle.png' class='card-img-top' alt=''>";
      case "Rain":
        return "<img src='../assets/img/Rain.png' class='card-img-top' alt=''>";
      case "Snow":
        return "<img src='../assets/img/Snow.png' class='card-img-top' alt=''>";
      case "Atmosphere":
        return "<img src='../assets/img/Atmosphere.png' class='card-img-top' alt=''>";
      case "Clear":
        return "<img src='../assets/img/Clear.png' class='card-img-top' alt=''>";
      case "Clouds":
        return "<img src='../assets/img/Clouds.png' class='card-img-top' alt=''>";
      default:
        return "<img src='../assets/img/None.png' class='card-img-top' alt=''>";
    }
  }

  $("#frm-search .btn").on("click", function (event) {
    event.preventDefault();
    city = $("input[type='text'").val();
    getWeather(city);
  });
});
