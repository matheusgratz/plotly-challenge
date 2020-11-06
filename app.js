
// Create a function to get the id when change dropdown
function optionChanged(id) {
    getMetadata(id);
    plotCharts(id);
};

// Create a function to collect the metadata info
function getMetadata(id) {

    // Read the json file
    d3.json("data/samples.json").then((data) => {

        var metadata = data.metadata;
        //console.log(metadata);

        // Filter metadata using the selected ID
        var metadataFiltered = metadata.filter(data => data.id.toString() === id)[0];
        //console.log(metadataFiltered);

        // Select the Demographic panel
        var demographicPanel = d3.select("#sample-metadata");
        
        // Clean the HTML for new data
        demographicPanel.html("");

        // Iterate and load to the metadata Panel
        for (var key in metadataFiltered) {
            demographicPanel
                .append("h5")
                .append("strong")
                .text(key + ": " + metadataFiltered[key] + "\n");
        };

        //------------------------------
        //-------- GAUGE CHART ---------
        //------------------------------

        // Create the data por plot
        var dataGauge = [
            {
                gauge: {
                    axis:{
                        range: [0, 9],
                        tickwidth: 1,
                        tickcolor: "royalblue"
                    },
                    bar: {
                        color: "royalblue"
                    }
                },
                value: metadataFiltered.wfreq,
                title: { 
                    text: "Belly Button Washing Frequency" 
                },
                type: "indicator",
                mode: "gauge+number"
            }
        ];

        // Create layout for plot
        var layoutGauge = { 
            width: 600, 
            height: 300, 
            margin: { 
                t: 60, 
                b: 0 
            } 
        };

        // Create the gauge plot
        Plotly.newPlot("gauge", dataGauge, layoutGauge);
        
     });    
};

// Create a function to load the IDs to the dropdown menu
function loadDropdown() {

    // Select dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // Read the json file
    d3.json("data/samples.json").then((data) => {
        //console.log(dataSamples);

        // Iterate and append option/values to the dropdown
        data.names.forEach(function(name) {
        dropdownMenu.append("option").text(name).property("value");
        });
        
    });
};

// Create a function to create a plot
function plotCharts(id) {

    // Read the json file
    d3.json("data/samples.json").then((data) => {
    //console.log(data);
    
    // Get sample data
    var dataSamples = data.samples;
    
    // Filter dataSamples using the selected ID
    var dataSamplesFiltered = dataSamples.filter(data => data.id.toString() === id)[0];
        //console.log(dataSamplesFiltered);
    
    // Get top 10 labels
    var dataSamplesTopTenLabels = dataSamplesFiltered.otu_labels.slice(0, 10);
        //console.log(dataSamplesTopTenLabels);
    
    // Get top 10 Values
    var dataSamplesTopTenValues = dataSamplesFiltered.sample_values.slice(0, 10).reverse();
        //console.log(dataSamplesTopTenValues);

    // Get top 10 ids and rename them for the plot
    var dataSamplesTopTenIds = (dataSamplesFiltered.otu_ids.slice(0, 10)).reverse();
        //console.log(dataSamplesTopTenIds);

    var idOTU = dataSamplesTopTenIds.map(d => "OTU " + d)
        //console.log(idOTU);

//------------------------------
//-------- BAR CHART -----------
//------------------------------

    // Create the data por plot
    var dataBar = [{
        x: dataSamplesTopTenValues,
        y: idOTU,
        text: dataSamplesTopTenLabels,
        type:"bar",
        orientation: "h"
    }];

    // Create layout for plot
    var layoutBar = {
        title: "Top 10 OTU (operational taxonomic units)",
        yaxis:{
            tickmode:"linear"
        },
        margin: { 
            t: 60, 
            b: 0 
        } 
    };

    // Plot bar chart
    Plotly.newPlot("bar", dataBar, layoutBar);

//------------------------------
//-------- BUBBLE CHART --------
//------------------------------

    // Create a function to use otu_ids as color
    function intoRGB (value) {
    // Credit to https://stackoverflow.com/questions/44413996/generate-color-from-number for the idea of how to implement
    // MGRATZ: I just added the Math.random() to generate different colors
    var blue = Math.floor(Math.random() * value % 256);
    var green = Math.floor(Math.random() * value % 256);
    var red = Math.floor(Math.random() * value % 256);
  
    return "rgb(" + red + "," + green + "," + blue + ")";
    };


    // Create the data por plot
    var dataBubble = [{
        x: dataSamplesFiltered.otu_ids,
        y: dataSamplesFiltered.sample_values,
        mode: "markers",
        marker: {
            size: dataSamplesFiltered.sample_values.map(s => s),
            color: dataSamplesFiltered.otu_ids.map(c => intoRGB(c))
        },
        text: dataSamplesFiltered.otu_labels

    }];

    // Create layout for plot
    var layoutBubble = {
        title: "Samples by ID",
        xaxis:{
            title: "OTU (operational taxonomic units) ID"
        },
        height: 600,
        width: 1150
    };

    // Create the bubble plot
    Plotly.newPlot("bubble", dataBubble, layoutBubble); 

    });
};

// Create a function to be loaded when the page load =)
function loadPage(){

    // Call functions
    loadDropdown();

    d3.json("data/samples.json").then((data) => {
        getMetadata(data.names[0]);
        plotCharts(data.names[0]);
    });

};

// Call function LoadPage
loadPage();

