const form = document.querySelector("#search-form");  // Select the form for submission
const input = document.querySelector("#search-term");  // Select the search input field
const msg = document.querySelector("#form-msg");  // Select the message element for errors
const list = document.querySelector(".cities");  // Select the list where weather cards are added

const apikey = "48af4d76691582c510c59567f49ebf2c";  // Define the API key for OpenWeatherMap

form.addEventListener("submit", e => {  // Add event listener for form submission
    e.preventDefault();  // Prevent default form submission behavior

    msg.textContent = "";  // Clear any previous messages
    msg.classList.add("hidden");  // Hide the message element

    let inputValue = input.value.trim();  // Get the trimmed value from the input field

    const listItemArray = Array.from(list.querySelectorAll(".city"));  // Convert city elements into an array
    console.log(listItemArray);  // Log the list items for debugging

    if (listItemArray.length > 0) {  // Check if there are any cities in the list
        const filterArray = listItemArray.filter(el => {  // Filter the list items based on the input
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

            return content === inputValue.toLowerCase();  // Check if the filtered content matches the input
        });

        if (filterArray.length > 0) {  // If there is a match
            msg.textContent = `You already know the weather for ${filterArray[0].querySelector(".city_name").textContent}, please be more specific with the country code as well.`;
            msg.classList.remove("hidden");  // Show a message to the user
            form.reset();  // Reset the form
            input.focus();  // Focus on the input field
            return;  // Stop further execution
        }
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apikey}&units=metric`)  // Fetch weather data
        .then(response => response.json())  // Convert the response to JSON
        .then(data => {  // Handle the data from the API
            if (data.cod == "404") {  // Check for a 404 error
                throw new Error(`${data.cod} , ${data.message}`);  // Throw an error
            }

            const { main, name, sys, weather } = data;  // Destructure the data object
            const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}.png`;  // Construct the icon URL

            const li = document.createElement("li");  // Create a new list item
            li.classList.add("box-weather", "p-6", "bg-gradient-to-br", "from-[#00aaff]", "to-[#004e92]", "rounded-xl", "shadow-lg", "text-center", "flex", "flex-col", "items-center", "justify-center");  // Add classes for styling
            
            // Define the HTML structure for the weather card
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

            li.innerHTML = markup;  // Set the inner HTML of the list item
            list.appendChild(li);  // Add the new weather card to the list

            form.reset();  // Reset the form
            input.focus();  // Focus on the input field
        })
        .catch(error => {  // Handle errors from the API call
            msg.textContent = "Please search for a valid city.";  // Show an error message
            msg.classList.remove("hidden");  // Show the message element
            console.error("Error:", error);  // Log the error
        });
});
