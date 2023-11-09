var loc = "Warsaw";
document.addEventListener("DOMContentLoaded", () => {
  fetchDataForNewLocation(loc);
});

document.addEventListener("keydown", handleKeyPress);
function handleKeyPress(e) {
  if (e.key === "Enter") {
    var newLocation = document.getElementById("locat").value;
    if (newLocation.trim() !== "") {
      loc = newLocation;
      fetchDataForNewLocation(loc);
    } else {
      console.log("enter correct location");
    }
  }
}

async function fetchDataForNewLocation(newLoc) {
  const apiEndpoints = [
    `http://api.weatherapi.com/v1/current.json?key=b91106d7c2a048e59e8144617233110&q=${newLoc}&aqi=yes`,
    `http://api.weatherapi.com/v1/forecast.json?key=b91106d7c2a048e59e8144617233110&q=${newLoc}&days=7&aqi=no&alerts=yes`,
  ];

  Promise.all(apiEndpoints.map(fetchData))
    .then((results) => {
      var chosenD = 0;
      const currTime = new Date().getHours();
      console.log(currTime);
      var graphChoiceContainer = document.getElementById("graph-choice");

      // middle graphs
      var tempGraphContainer = document.getElementById("temp-graph");
      var rainGraphContainer = document.getElementById("rain-graph");
      var windGraphContainer = document.getElementById("wind-graph");

      var graphHours = document.getElementById("graph-hours");
      var weatherInfoContainer = document.getElementById("weather-info");
      const dataFromAPI2 = results[1];
      console.log(dataFromAPI2);
      if (dataFromAPI2.current.is_day) {
        document.getElementById("outer-layer").style.background =
          "linear-gradient(to bottom, #25749c 0%, #2768b3 100%)";
        document.getElementById("border").style.background =
          "linear-gradient(to bottom, #3585db 1%, #5dadcc 70%, #b7b9d8 100%)";
      } else {
        document.getElementById("border").style.background =
          "linear-gradient(to bottom, #020111 10%,#3a3a52 100%)";
        document.getElementById("outer-layer").style.background =
          "linear-gradient(to bottom, #020111 10%,#3a3a52 100%)";
      }

      function generateWeatherInfo(chosenD, time) {
        if (time != null) {
          data = dataFromAPI2.forecast.forecastday[chosenD].hour[time];
          date = `<p>${data.time}</p>`;
          humidity = data.humidity;
          will_it_rain = data.will_it_rain;
          wind = data.wind_kph;
          temp = data.temp_c;
        } else {
          data = dataFromAPI2.forecast.forecastday[chosenD].day;
          date = `<p>${dataFromAPI2.forecast.forecastday[chosenD].date}</p>`;
          humidity = data.avghumidity;
          will_it_rain = data.daily_will_it_rain;
          wind = data.maxwind_kph;
          temp = data.avgtemp_c;
        }
        weatherInfoContainer.innerHTML = `
        <div id="left-side">
        <img src=${data.condition.icon}/>
        <div id="temperature">
        <span id="temp-number">${temp}</span>
        <div id="scale">
        <p>c|f</p>
        </div>
        </div>
        <div id="detail-info">
        <p>szansa opadów: ${will_it_rain}%</p>
        <p>wilgotność: ${humidity}%</p>
        <p>wiatr: ${wind}km/h</p>
        </div>
        </div>
        <div id="right-side">
        <h4>Pogoda</h4>
        ${date}
        <p>${data.condition.text}</p>
        </div>
        `;
      }

      var weatherForecastContainer =
        document.getElementById("weather-forecast");
      var dayss = document.getElementsByClassName("day");

      // graph functions

      // temperature graph
      function generateTempGraph(chosenD) {
        const tempGraph = dataFromAPI2.forecast.forecastday[chosenD].hour
          .filter((element, index) => index % 3 === 0)
          .map((x) => {
            var temperature = `<div>${x.temp_c}</div>`;
            return x.temp_c * 10 + 100;
          });
        const tempDiv = dataFromAPI2.forecast.forecastday[chosenD].hour
          .filter((element, index) => index % 3 === 0)
          .map((x) => {
            return `<div>${x.temp_c}</div>`;
          });
        tempGraphContainer.innerHTML = `<div id=temperatures-num>${tempDiv.join(
          ""
        )}</div><svg width="100%" height="300">
        <circle cx="150" cy="${300 - tempGraph[0]}" r="3" fill='blue'/>
        <circle cx="350" cy="${300 - tempGraph[1]}" r="3" fill="blue" />
        <circle cx="550" cy="${300 - tempGraph[2]}" r="3" fill="blue" />
        <circle cx="750" cy="${300 - tempGraph[3]}" r="3" fill="blue" />
        <circle cx="930" cy="${300 - tempGraph[4]}" r="3" fill="blue" />
        <circle cx="1100" cy="${300 - tempGraph[5]}" r="3" fill="blue" />
        <circle cx="1300" cy="${300 - tempGraph[6]}" r="3" fill="blue" />
        <circle cx="1500" cy="${300 - tempGraph[7]}" r="3" fill="blue" />
        
          <!-- Connecting lines -->
          <polyline
          points="0,300 0,${300 - tempGraph[0]} 350,${300 - tempGraph[1]} 550,${
          300 - tempGraph[2]
        } 750,${300 - tempGraph[3]} 930,${300 - tempGraph[4]} 1100,${
          300 - tempGraph[5]
        } 1300,${300 - tempGraph[6]} 1670,${300 - tempGraph[7]} 1670,300"
          style="fill: rgba(244, 247, 25, 0.37); stroke: #daa520; stroke-width: 2"
          />
          </svg>`;
      }

      // rain graph
      function generateRainGraph(chosenD) {
        let data = dataFromAPI2.forecast.forecastday[chosenD].hour
          .filter((element, index) => index % 3 === 0)
          .map((x) => {
            return `<div class='graph-container'><div>${x.chance_of_rain}</div><div data-water-line=${x.chance_of_rain}></div></div>`;
          });
        rainGraphContainer.innerHTML = data.join("");
        const waterLine = document.querySelectorAll("[data-water-line]");
        waterLine.forEach((element) => {
          const waterLineValue = element.getAttribute("data-water-line");
          element.style.height = waterLineValue + "%";
        });
      }

      // wind graph
      function generateWindGraph(chosenD) {
        var newData = dataFromAPI2.forecast.forecastday[chosenD].hour
          .filter((element, index) => index % 3 === 0)
          .map((x) => {
            return `<div class='graph-container'><div>${x.wind_kph}km/h</div><div data-wind-dir=${x.wind_degree}><img src='arroww.png'></div></div>`;
          });
        windGraphContainer.innerHTML = newData.join("");

        const windDir = document.querySelectorAll("[data-wind-dir]");
        windDir.forEach((element) => {
          const windDirValue = element.getAttribute("data-wind-dir");
          element.children[0].style.transform = `rotate(${
            parseInt(windDirValue) + 180
          }deg)`;
        });
      }

      // fixed hours under graph
      const graphTimes = dataFromAPI2.forecast.forecastday[0].hour
        .filter((element, index) => index % 3 === 0)
        .map((x) => {
          return `<div>${x.time.split(" ")[1]}</div>`;
        });

      // bottom weather info showing future days
      const days = dataFromAPI2.forecast.forecastday.map((x) => {
        const dateString = x.date;
        const date = new Date(dateString);
        const daysOfWeek = ["pon", "wt", "śr", "czw", "pt", "sob", "niedz"];
        const dayOfWeekIndex = date.getDay();
        const dayName = daysOfWeek[dayOfWeekIndex];
        return `<div class='day'><p>${dayName}.</p><img src='${x.day.condition.icon}'><p>${x.day.maxtemp_c} ${x.day.mintemp_c}</p></div>`;
      });
      var weatherForecast = days;
      weatherForecastContainer.innerHTML = weatherForecast.join("");

      // event listeners to change info when different day is clicked
      for (let i = 0; i < dayss.length; i++) {
        dayss[i].addEventListener("click", function () {
          chosenD = i;
          // add main weather info
          generateTempGraph(chosenD);
          generateRainGraph(chosenD);
          generateWindGraph(chosenD);
          generateWeatherInfo(chosenD);
        });
      }

      // default html inicialization
      generateWeatherInfo(chosenD, currTime);
      graphChoiceContainer.innerHTML = `<div id=choice-temp>Temperatura</div><div id=choice-rain>Szansa opadów</div><div id=choice-wind>Wiatr</div>`;
      generateTempGraph(chosenD);
      generateRainGraph(chosenD);
      generateWindGraph(chosenD);
      graphHours.innerHTML = graphTimes.join("");

      // graph shown changes depending on button clicked
      document
        .getElementById("choice-temp")
        .addEventListener("click", function () {
          tempGraphContainer.style.display = "grid";
          rainGraphContainer.style.display = "none";
          windGraphContainer.style.display = "none";
        });
      document
        .getElementById("choice-rain")
        .addEventListener("click", function () {
          tempGraphContainer.style.display = "none";
          rainGraphContainer.style.display = "grid";
          windGraphContainer.style.display = "none";
        });
      document
        .getElementById("choice-wind")
        .addEventListener("click", function () {
          tempGraphContainer.style.display = "none";
          rainGraphContainer.style.display = "none";
          windGraphContainer.style.display = "grid";
        });
    })

    .catch((error) => {
      console.error("error", error);
    });
}

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// funckja ktora bierze info z pogody i je zmienia
// funckja ktora zmienia c na f
// zmienic kolory grafow
// dodac mozliwosc najechania i klikniecia w kropke np
