// used GPT to solve trouble-shoot why demographic info wasn't displaying
// Define the buildMetadata function
function buildMetadata(sample) {
  console.log("Building metadata for:", sample);

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);

    // Get the metadata field
    let metadata = data.metadata;
    console.log(metadata);

    // Filter the metadata for the object with the desired sample number
    let info = metadata.filter(x => x.id == sample)[0];
    console.log(info);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Loop through each key-value pair in the filtered metadata
    // and append a new h6 tag for each key-value pair
    Object.entries(info).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}
function buildCharts(sample) {
  console.log("Sample:", sample);
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);
    // Get the samples field
    let samples = data.samples;
    console.log(samples);
    // Filter the samples for the object with the desired sample number
    let sample_filter = samples.filter(x => x.id === sample)[0];
    if (!sample_filter) {
      console.error("No data found for sample:", sample);
      return;
    }

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample_filter.otu_ids;
    let otu_labels = sample_filter.otu_labels;
    let sample_values = sample_filter.sample_values;

    // Build a Bubble Chart
    let bbl = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Picnic"
      },
      text: otu_labels
    };
    
    let bbls = [bbl];

    // Render the Bubble Chart
    let bbl_layout = {
      title: 'Bacteria Cultures per Sample'
    };

    Plotly.newPlot('bubble', bbls, bbl_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_y = otu_ids.map(x => `OTU: ${x}`);
    console.log(bar_y);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace1 = {
      x: sample_values.slice(0, 10).reverse(),
      y: bar_y.slice(0, 10).reverse(),
      type: 'bar',
      marker: {
        colorscale: "Bluered",
        color: sample_values.slice(0, 10).reverse()
      },
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    };

    // Render the Bar Chart
    let traces = [trace1];
    let layout = { 
      title: "10 Most Prevalent Bacteria Cultures"
    };

    Plotly.newPlot("bar", traces, layout);
  });
}
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    console.log(data);

    // Get the names field
    let get_names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < get_names.length; i++){
      let name = get_names[i];
      dropdown.append("option").text(name);
    }

    // Get the first sample from the list
    let default_name = get_names[0];
    console.log(default_name);

    // Build charts and metadata panel with the first sample
    buildCharts(default_name);
    buildMetadata(default_name);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
