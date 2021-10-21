$(function () {
  apiKEY = "992682d486cb8a7de0b93c8fd7e45c78";
  ApiUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=es";
  ApiUrlForecast =
    "https://api.openweathermap.org/data/2.5/onecall?units=metric&lang=es&exclude=current,minutely,hourly&lat=";

  //AL CARGAR LA PÁGINA UNICAMENTE SE MUESTRA EL CONTAINER DEL HOME.
  //TANTO LAS OTRAS DOS VENTANAS COMO LAS CAJAS PARA LOS RESULTADOS PERMACEN OCULTOS.
  $("#home").show();
  $("#buscar").hide();
  $("#localizacion").hide();
  $("#result-tmp-city").hide();
  $("#result-tmp-gps").hide();

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

  //FUNCIÓN PARA AÑADIR LA ESTRUCTURA HTML CON LA INFORMACIÓN
  function anadirHTML(city, temp, estado, tempMax, tempMin, wind, lugar) {
    var result =
      "<div class='row'><div class='col'><p>El tiempo en <span>" +
      city +
      "</span>: " +
      estado.description +
      "</p></div></div>";
    result +=
      "<div class='row align-items-center'>" +
      "<div class='col col-sm-6'><p class='display-3'>" +
      temp.toFixed(1) + //.toFixed() -> truncar decimales
      " ºC</p></div>" +
      "<div class='col col-sm-6'>" +
      imagenPorEstado(estado.main) + // LLAMADA PARA OBTENER IMAGEN SEGÚN EL ESTADO DEL TIEMPO
      "</div>" +
      "</div'></div>" +
      "<div class='row mt-3'><div class='col-6'>Max: " +
      tempMax.toFixed(1) +
      " ºC</div>" +
      "<div class='col-6'>Min: " +
      tempMin.toFixed(1) +
      " ºC</div></div>";
    $("#" + lugar).html(result);
  }

  //FUNCIÓN PARA OBTENER UAN IMAGEN SEGÚN EL ESTADO DEL TIEMPO
  function imagenPorEstado(estado) {
    switch (estado) {
      case "Thunderstorm":
        return "<img src='./assets/img/Thunderstorm.png' class='img-fluid' alt='Imagen tiempo' >";
      case "Drizzle":
        return "<img src='./assets/img/Drizzle.png' class='img-fluid' alt='Imagen tiempo' >";
      case "Rain":
        return "<img src='./assets/img/Rain.png' class='img-fluid' alt='Imagen tiempo' >";
      case "Snow":
        return "<img src='./assets/img/Snow.png' class='img-fluid' alt='Imagen tiempo' >";
      case "Atmosphere":
        return "<img src='./assets/img/Atmosphere.png' class='img-fluid' alt='Imagen tiempo' >";
      case "Clear":
        return "<img src='./assets/img/Clear.png' class='img-fluid' alt='Imagen tiempo' >";
      case "Clouds":
        return "<img src='./assets/img/Clouds.png' class='img-fluid' alt='Imagen tiempo' >";
      default:
        return "<img src='./assets/img/None.png' class='img-fluid' alt='Imagen tiempo' >";
    }
  }

  //FUNCIÓN PARA OBTENER INFO DEL PRONÓSTICO TIEMPO
  function getForecast(lon, lat, lugar) {
    $.get(
      ApiUrlForecast + lat + "&lon=" + lon + "&appid=" + apiKEY,
      function (tiempo) {
        var result = "";
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        if (tiempo && tiempo.daily.length > 0) {
          result =
            "<div class='row'><div class='col'><table class='table table-borderless forecast'><tbody>";
          $.each(tiempo.daily, function (index, dias) {
            if (index < 4) {
              //SE RECORRE ÚNICAMENTE LOS 4 PRIMEROS DÍAS
              day += 1;
              result +=
                "<tr class='final-table' align=center><td><p>" +
                ((day < 10 ? "0" : "") + day) +
                "/" +
                ((month < 10 ? "0" : "") + month) +
                "</p></td>" +
                "<td>" +
                imagenPorEstado(dias.weather[0].main) + // LLAMADA PARA OBTENER IMAGEN SEGÚN EL ESTADO DEL TIEMPO
                "</td>" +
                "<td><p><span class='temp-max'>" +
                dias.temp.max.toFixed() +
                "</span>&nbsp&nbsp<span class='temp-min'>" +
                dias.temp.min.toFixed() +
                "</span></p></td></tr>";
            } else {
              return;
            }
          });
          result += "</tbody></table></div></div>";
        }
        $("#" + lugar).append(result);
      }
    );
  }

  //FUNCIÓN PARA OBTENER INFO DEL TIEMPO POR CIUDAD Y LLAMADA PARA LA INFO DEL PRONÓSTICO
  function getWeather(city) {
    $.get(ApiUrl + "&q=" + city + "&appid=" + apiKEY, function (tiempo) {
      if (tiempo.cod != 401) {
        $("#result-tmp-city").show();
        var estado = tiempo.weather;
        anadirHTML(
          tiempo.name,
          tiempo.main.temp,
          estado[0],
          tiempo.main.temp_max,
          tiempo.main.temp_min,
          tiempo.wind.speed,
          "result-tmp-city"
        ); //FUNCIÓN PARA AÑADIR TODA LA ESTRUCTURA HTML Y LA INFORMACIÓN
        getForecast(tiempo.coord.lon, tiempo.coord.lat, "result-tmp-city"); //LLAMADA A LA FUNCIÓN DEL PRONÓSTICO
      } else {
        alert(
          "No se ha encontrado el tiempo en ninguna ciudad con ese nombre."
        );
      }
    }).fail(function () {
      alert("¡Error! Nombre de ciudad incorrecto.\nPrueba con otra.");
    });
  }

  // FUNCIÓN PARA OBTENER EL TIEMPO ACTUAL SEGÚN LOCALIZACIÓN - SE IMPLEMENTARÁ EN LA V2
  function getWeatherByPosition(lat, long) {
    $.get(
      ApiUrl + "&lat=" + lat + "&lon=" + long + "&appid=" + apiKEY,
      function (tiempo) {
        if (tiempo.weather.length) {
          $("#result-tmp-gps").show();
          var estado = tiempo.weather;
          anadirHTML(
            tiempo.name,
            tiempo.main.temp,
            estado[0],
            tiempo.main.temp_max,
            tiempo.main.temp_min,
            tiempo.wind.speed,
            "result-tmp-gps"
          );
          getForecast(long, lat, "result-tmp-gps");
        } else {
          alert(
            "No se ha encontrado el tiempo en ninguna ciudad con ese nombre."
          );
        }
      }
    ).fail(function () {
      alert(
        "¡Error! No se ha podido obtener la ubicación.\nDebe activar la ubicación y aceptar los permisos"
      );
    });
  }

  //METODOS SEGÚN LA RESPUESTA DE 'navigator. geolocation.getCurrentPosition()'. 'onSuccess' LLAMA A LA FUNCIÓN
  //'getWeatherByPosition' QUE OBTIENE LA INFORMACIÓN DEL TIEMPO.
  var onSuccess = function (position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    getWeatherByPosition(lat, long);
  };
  function onError(error) {
    switch (error.code) {
      case 1:
        alert("¡ERROR! No se ha podido activar la ubicación.");
        break;
      case 2:
        alert(
          "¡ERROR! La aplicación no tiene permiso para acceder a la ubicación."
        );
        break;
      case 3:
        alert("¡ERROR! Timeout expired");
        break;
      default:
        alert("¡ERROR! No se ha podido obtener la ubicación");
        break;
    }
  }

  //FUNCIÓN QUE AL DAR CLICK SOBRE EL BOTÓN DEL MENÚ DE 'LOCALIZACIÓN' SE MUESTRA LA CAJA CORRESPONDIENTE Y SE OCULTAN
  //LAS DEMÁS. ADEMÁS SE LLAMA AL MÉTODO 'getCurrentPosition' PARA OBTENER LA UBICACIÓN ACTUAL Y ASÍ OBTENER EL TIEMPO
  $("#localizacion-btn").on("click", function (event) {
    event.preventDefault();
    $("#home").hide();
    $("#buscar").hide();
    $("#localizacion").show();

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  });

  //FUNCIÓN QUE AL DAR CLICK EN EL BOTÓN 'CONSULTAR', LLAMA A OTRA FUNCIÓN PARA RECOGER LA INFORMACION DEL TIEMPO
  //SEGÚN LA CIUDAD INTRODUCIDA EN EL INPUT
  $("#frm-search .btn").on("click", function (event) {
    event.preventDefault();
    city = $("input[type='text'").val();
    getWeather(city);
  });
});
