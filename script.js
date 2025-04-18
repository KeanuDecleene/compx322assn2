/**
 * when the DOM is loaded, a function will be called to fetch the commodities from the database
 * and event listener to the dropdown list
 */
document.addEventListener("DOMContentLoaded", () => {
  getCommodityFromDB();

  //event listener for the clear graph button
  document.getElementById("clearGraphButton").addEventListener("click", () => {
    destroyGraph();
  });

  //event listener for the dropdown selection
  document
    .getElementById("widgetDropdown")
    .addEventListener("change", (event) => {
      const selectedId = event.target.value;
      const selectedCommodity = commoditiesArray.find(
        (c) => c.id === selectedId
      );
      if (!selectedCommodity) return;

      if (!document.getElementById(`widget-${selectedId}`)) {
        const widget = new CommodityWidget(selectedCommodity);
        document.getElementById("widgetContainer").appendChild(widget.element);
      }
    });
});

let commoditiesArray = []; //array to store object literals of commodities from DB
let chartInstance = null; //chart instance to be used in the graph

/**
 * if there is a chart instance it will be destroyed
 */
destroyGraph = () => {
  if (chartInstance) {
    chartInstance.destroy(); //destroys the current chart
    chartInstance = null; //resets chart instance
  }
};

/**
 * calls the sort function and populates the drop down list using the commoditiesArray
 */
const populateDropDownLi = () => {
  sortCommoditiesByName();
  const dropdown = document.getElementById("widgetDropdown");
  dropdown.innerHTML = ""; //clear

  //default option on select list
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a commodity...";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  dropdown.appendChild(defaultOption);

  commoditiesArray.forEach((commodity) => {
    const option = document.createElement("option");
    option.value = commodity.id;
    option.textContent = commodity.name;
    dropdown.appendChild(option);
  });
};

/**
 * sorts the commoditiesArray in alphaetical order by name
 */
const sortCommoditiesByName = () => {
  commoditiesArray.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * fetches the commodities from the database using GET, then maps the returned json commodity data into an array of object literals
 * then calls the populateDropDownLi function to populate the dropdown list
 */
const getCommodityFromDB = () => {
  fetch("comm_fetchDB.php", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      //uses map to store each commodity as a object literal in the commoditiesArray
      if (Array.isArray(data)) {
        commoditiesArray = data.map((c) => ({
          id: c.id,
          name: c.name,
          information: c.information,
          code: c.code,
        }));
      } else {
        console.log("Unexpected response:", data);
      }
    })
    .then(() => {
      populateDropDownLi();
    });
};

/**
 * Commodity Widget constructor function creates a widget for the selected commodity
 * @param {the commodity information for the selected commodity} commodity
 */
function CommodityWidget(commodity) {
  //outer container for the widget
  this.element = document.createElement("div");
  this.element.classList.add("widget");
  this.element.id = `widget-${commodity.id}`;

  //name
  const title = document.createElement("h3");
  title.textContent = commodity.name;
  this.element.appendChild(title);
  //info
  const info = document.createElement("p");
  info.textContent = `Global price of ${commodity.name}`;
  this.element.appendChild(info);
  //buttons
  const showGraphBtn = document.createElement("button");
  showGraphBtn.textContent = "Show Graph";
  const addToGraphBtn = document.createElement("button");
  addToGraphBtn.textContent = "Add to Graph";
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";

  //adds all event listeners to buttons with the appropriate functions
  removeBtn.addEventListener("click", () => {
    this.element.remove();
  });

  showGraphBtn.addEventListener("click", () => {
    handleShowGraphBtn(commodity);
  });

  addToGraphBtn.addEventListener("click", () => {
    handleAddToGraphBtn(commodity);
  });

  this.element.appendChild(showGraphBtn);
  this.element.appendChild(addToGraphBtn);
  this.element.appendChild(removeBtn);
}

/**
 * initialises the graph with the selected commodity using the vantage API data and charts.js
 * @param {the commodity being initialised and shown on the graph} commodity
 */
const handleShowGraphBtn = (commodity) => {
  destroyGraph(); //destroy the current graph if it exists
  fetch("vantage_fetch.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: commodity.code }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }

      //maps dates and values into arrays to be used as x and y for graph
      const labels = data.map((point) => point.date);
      const values = data.map((point) => parseFloat(point.value));

      const ctx = document.getElementById("graphCanvas").getContext("2d");
      color = getRandomColor();

      //creates a new instance of a chart with given formatting and dataset
      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: commodity.name,
              data: values,
              borderColor: "black",
              backgroundColor: color,
              borderWidth: 0.5,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              labels: {
                color: "black",
                font: {
                  weight: "bold",
                },
              },
            },
            title: {
              display: true,
              text: "Commodity Prices Over Time",
              color: "black",
              font: {
                weight: "bold",
                size: 24,
              },
            },
          },
        },
      });
    })
    .catch((err) => console.error("Error fetching commodity prices:", err));
};

/**
 * handles the commodity being added to the graph by calling the vantage API
 * and updating the chart with the new data so that it can be compared
 * @param {the commodity being added to the graph} commodity
 */
const handleAddToGraphBtn = (commodity) => {
  //checks if a chart is already initialised
  if (!chartInstance) {
    alert(
      "Please click 'Show Graph' on a commodity first to initialise the graph."
    );
    return;
  }

  //checks if the commodity is already in the graph
  const alreadyAdded = chartInstance.data.datasets.some(
    (dataset) => dataset.label === commodity.name
  );

  //prevents adding the same commodity twice if it is already in the graph
  if (alreadyAdded) {
    alert(`${commodity.name} is already in the graph.`);
    return;
  }

  color = getRandomColor();

  fetch("vantage_fetch.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: commodity.code }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }

      //maps dates and values into arrays to be used as x and y for graph
      const labels = data.map((point) => point.date);
      const values = data.map((point) => parseFloat(point.value));

      //updates the chart with new dataset
      chartInstance.data.datasets.push({
        label: commodity.name,
        data: values,
        borderColor: "black",
        backgroundColor: color,
        borderWidth: 0.5,
        fill: false,
      });

      //merge the existing and new labels together
      const existingLabels = chartInstance.data.labels;
      const mergedLabels = [...new Set([...existingLabels, ...labels])].sort();

      chartInstance.data.labels = mergedLabels;

      chartInstance.update();
    })
    .catch((err) => console.error("Error adding commodity to graph:", err));
};

/**
 * generates a random RGB color
 * @returns {a random RGB color string}
 */
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r}, ${g}, ${b})`;
};
