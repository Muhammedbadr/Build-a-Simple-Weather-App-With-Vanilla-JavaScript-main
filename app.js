const form = document.querySelector("#search-form");
const input = document.querySelector("#search-term");
const msg = document.querySelector("#form-msg");
const list = document.querySelector(".cities");

const apikey = "48af4d76691582c510c59567f49ebf2c";

form.addEventListener("submit", e => {
    e.preventDefault();

    msg.textContent = "";
    msg.classList.add("hidden");

    let inputValue = input.value.trim();

    const listItemArray = Array.from(list.querySelectorAll(".city"));
    console.log(listItemArray);

    if (listItemArray.length > 0) {
        const filterArray = listItemArray.filter(el => {
            let content = "";
            let cityName = el.querySelector(".city_name").textContent.toLowerCase();
            let countryName = el.querySelector(".country_name").textContent.toUpperCase();

            if (inputValue.includes(',')) {
                if (inputValue.split(',')[0].length > 2) {
                    content = cityName;
                } else {
                    content = `${cityName},${countryName}`;
                }
            } else {
                content = cityName;
            }

            return content === inputValue.toLowerCase();
        });

        if (filterArray.length > 0) {
            msg.textContent = `You already know the weather for ${filterArray[0].querySelector(".city_name").textContent}, please be more specific with the country code as well.`;
            msg.classList.remove("hidden");
        
            form.reset();
            input.focus();
        
            return;
        }
        
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apikey}&units=metric`)
        .then(response => response.json())
        .then(data => { 
            if (data.cod == "404") {
                throw new Error(`${data.cod} , ${data.message}`);
            }

            const { main, name, sys, weather } = data;
            
            const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}.png`;

            const li = document.createElement("li");
            li.classList.add("box-weather", "p-6", "bg-gradient-to-br", "from-[#00aaff]", "to-[#004e92]", "rounded-xl", "shadow-lg", "text-center", "flex", "flex-col", "items-center", "justify-center");

            const markup = `
                <figure class="weather-icon bg-blue-200 mb-4 p-[15px] rounded-full">
                    <img src="${icon}" alt="${weather[0]["description"]}" class="w-12 h-12" />
                </figure>
                <div class="info">
                    <p class="text-sm text-gray-200 mb-1">${weather[0]["description"].toUpperCase()}</p>
                    <h3 class="text-2xl font-semibold mb-2 text-white">${Math.round(main.temp)}<span>°C</span></h3>
                    <h2 class="text-lg font-bold text-white">
                        <span class="city_name">${name}</span>
                        <span class="country_name text-xs font-semibold bg-[#000F42] p-1 text-white rounded-md ml-1">${sys.country}</span>
                    </h2>
                </div>
            `;

            li.innerHTML = markup;
            list.appendChild(li);

            form.reset();
            input.focus();
        })
        .catch(error => {
            msg.textContent = "Please search for a valid city.";
            msg.classList.remove("hidden");
            console.error("Error:", error);
        });
});
