/****************************************************************************
 *
 *  File Name:  microbialDiversityApp.js
 *
 *  File Description:
 *      This Javascript file contains the function and subroutine calls for 
 *      the html file, index.html. Here is a list of the functions and
 *      subroutines.
 * 
 *      FetchJsonDataFromURLFunction
 *      OptionsChangeSubroutine
 *      GenerateMetadataSubroutine
 *      GenerateGaugeChartSubroutine
 *      GenerateBarChartSubroutine
 *      GenerateBubbleChartSubroutine
 *      InitializeWebPageSubroutine
 *      
 *
 *  Date        Description                             Programmer
 *  ----------  ------------------------------------    ------------------
 *  10/06/2023  Initial Development                     N. James George
 *  11/10/2023 Upgraded code with new features          N. James George
 *
 ****************************************************************************/

const 
    urlString
        = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';


/****************************************************************************
 *
 *  Function Name:  FetchJsonDataFromURLFunction
 *
 *  Function Description:  
 *      This function is the first stage for retrieving the aviation 
 *      accidents data set from the specified URL.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          jsonUrlString
 *                          This parameter is the URL for the source data.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/06/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

async function FetchJsonDataFromURLFunction 
                (jsonUrlString) 
{
    let dataD3JsonObject = null;
  
    try 
    {
        dataD3JsonObject 
            = await 
                d3.json(jsonUrlString);
    }
    catch (error) 
    {
        console.error(error);
    }
 
    return dataD3JsonObject;
} // This right brace ends the block for the function, 
// FetchJsonDataFromURLFunction.


/****************************************************************************
 *
 *  Subroutine Name:  OptionsChangeSubroutine
 *
 *  Subroutine Description:  
 *      This subroutine updates the metadata and charts with the current
 *      sample's data.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          currentSampleNameString
 *                          This parameter is the name of the current sample.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/06/23    Initial Development                     N. James George
 *
 ****************************************************************************/

function OptionsChangeSubroutine
            (currentSampleNameString) 
{ 
    GenerateMetadataSubroutine
      (currentSampleNameString);

    GenerateGaugeChartSubroutine
      (currentSampleNameString);

    GenerateBarChartSubroutine
      (currentSampleNameString);

    GenerateBubbleChartSubroutine
       (currentSampleNameString);
}; // This right brace ends the block for the subroutine, 
// OptionsChangeSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:   GenerateMetadataSubroutine
 *
 *  Subroutine Description:  
 *      This subroutine generates the Dashboard's metadata information
 *      for the current sample.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          currentSampleNameString
 *                          This parameter is the name of the current sample.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/06/23    Initial Development                     N. James George
 *
 ****************************************************************************/

function GenerateMetadataSubroutine
            (currentSampleNameString) 
{
    FetchJsonDataFromURLFunction (urlString)
        .then
            (microbialDataDictionary => 
                {
                    var currentMetadataDictionary 
                            = microbialDataDictionary
                                .metadata
                                .filter
                                    (metadataKey => 
                                        metadataKey.id == currentSampleNameString)[0];
 
                    var currentMetadataD3Object 
                            = d3.select('#metadataSample');

                    currentMetadataD3Object.html('');

                    Object
                        .entries
                            (currentMetadataDictionary)
                        .forEach
                        (
                            ([key, value]) => 
                                {
                                    var valueFinalString;
                                    
                                    if (typeof value === 'string') 
                                    {
                                        if (value.includes('Caucasian/Midleastern') === true)
                                        {
                                            valueFinalString = 'Caucasian, Middle Eastern'; 
                                        }
                                        else if (value.includes('WashingtonDC') === true)
                                        {
                                            valueFinalString = 'Washington, DC'; 
                                        }
                                        else if (value.includes('DurhamNC') === true)
                                        {
                                            valueFinalString = 'Durham, NC';
                                        }
                                        else if (value.includes('St.Louis') === true)
                                        {
                                            valueFinalString = 'St.Louis, MO';
                                        }
                                        else if (value.includes('London') === true)
                                        {
                                            valueFinalString = 'London, UK';
                                        }
                                        else if (value.includes ('/') === true) 
                                        {
                                            valueFinalString = value.replace('/', ', ');
                                        }
                                        else if (value.includes(',') === true 
                                                    && value.includes(', ') === false) 
                                        {
                                            valueFinalString = value.replace(',', ', ');
                                        }
                                        else if (value.includes('Unknown') === true)
                                        {
                                            valueFinalString = value.toLowerCase();
                                        }
                                        else if (value === 'm' || value === 'f')
                                        {
                                            valueFinalString = value.toUpperCase();
                                        }
                                        else 
                                        {
                                            valueFinalString = value;
                                        }
                                    }
                                    else if (value === null)
                                    {
                                        valueFinalString = 'unknown';
                                    }
                                    else 
                                    {
                                        valueFinalString = value;
                                    }
                                    
                                    currentMetadataD3Object
                                        .append('h6')
                                        .text(`${key.toUpperCase()}: ${valueFinalString}`);
                    }
                );
            }
        );
}; // This right brace ends the block for the subroutine, 
// GenerateMetadataSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:   GenerateGaugeChartSubroutine
 *
 *  Subroutine Description:  
 *      This subroutine generates the Dashboard's gauge chart
 *      for the current sample.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          currentSampleNameString
 *                          This parameter is the name of the current sample.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/06/23    Initial Development                     N. James George
 *
 ****************************************************************************/

function GenerateGaugeChartSubroutine 
            (currentSampleNameString) 
{
    FetchJsonDataFromURLFunction (urlString)
        .then
            (microbialDataDictionary => 
                {
                    var currentMetadataDictionary 
                            = microbialDataDictionary
                                .metadata
                                .filter
                                    (metadataKey => 
                                        metadataKey.id == currentSampleNameString)[0];

                    var washingFrequencyInteger
                            = currentMetadataDictionary.wfreq

                    var gaugeChartTraceDictionaryList
                            = [
                                {
                                    title: {text: '<b>Belly Button Washing Frequency</b>' 
                                                  + '<br> Scrubs Per Week',
                                            font: {size: 18}},
                                    mode: 'gauge+number',
                                    type: 'indicator',
                                    value: washingFrequencyInteger,
                                    domain: {x: [0, 1], y: [0, 1]},
                                    gauge: {axis: {range: [null, 9], 
                                                   tickwidth: 2.0, 
                                                   tickcolor: 'black'},
                                            bar: {color: 'blue'},
                                            bgcolor: 'white',
                                            borderwidth: 1.0,
                                            bordercolor: 'black',
                                            steps: [{range: [0, 2], color: '208b3a'},
                                                    {range: [2, 4], color: '99ca3c'},
                                                    {range: [4, 5], color: 'cbdb47'},
                                                    {range: [5, 6], color: 'fcec52'},
                                                    {range: [6, 7], color: 'fbb040'},
                                                    {range: [7, 8], color: 'f78e31'},
                                                    {range: [8, 9], color: 'f26b21'}],
                                            threshold: {line: {color: 'indigo', 
                                                               width: 4.0},
                                                        thickness: 1.0,
                                                        value: 9}}
                                }
                              ];
                    
                    var gaugeChartLayoutDictionary  
                            = {width: 350, 
                               height: 400, 
                               font: {color: 'black', 
                                      family: 'Garamond', 
                                      size: 20.0}};

                    Plotly
                        .newPlot
                            ('gaugeChart', 
                             gaugeChartTraceDictionaryList, 
                             gaugeChartLayoutDictionary);
                }
            );
} // This right brace ends the block for the subroutine, 
// GenerateGaugeChartSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:   GenerateBarChartSubroutine
 *
 *  Subroutine Description:  
 *      This subroutine generates the Dashboard's bar chart for the current
 *      sample.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          currentSampleNameString
 *                          This parameter is the name of the current sample.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/06/23    Initial Development                     N. James George
 *
 ****************************************************************************/

function GenerateBarChartSubroutine
            (currentSampleNameString) 
{
    FetchJsonDataFromURLFunction (urlString)
        .then
            (microbialDataDictionary => 
                {
                    var currentSampleDictionary 
                            = microbialDataDictionary
                                .samples
                                .filter
                                    (sampleKey => 
                                        sampleKey.id == currentSampleNameString)[0];

                    var top10SampleValuesArray
                            = currentSampleDictionary
                                .sample_values
                                    .slice (0, 10)
                                    .reverse ();

                    var top10OTUIDsArray
                            = currentSampleDictionary 
                                .otu_ids
                                    .slice (0, 10)
                                    .map (sampleNameString => `OTU ${sampleNameString}`)
                                    .reverse ();

                    var top10OTULabelsArray
                            = currentSampleDictionary
                                .otu_labels
                                    .slice (0, 10)
                                    .reverse ();

                    var barChartTraceDictionaryList
                        = [{
                                x: top10SampleValuesArray,
                                y: top10OTUIDsArray,
                                text: top10OTULabelsArray,
                                hoverlabel: 
                                    {font: 
                                        {color: 'black', 
                                         family: 'garamond',
                                         size: 12},
                                         bgcolor: 'white',
                                         bordercolor: 'brown'},
                                hovermode: 'closest',
                                hovertemplate:
                                    '<b>%{yaxis.title.text}:</b> %{y}<br>'
                                    + '<b>%{xaxis.title.text}:</b> %{x}<br>'
                                    + '<b>Bacteria:</b> %{text}'
                                    + '<extra></extra>',
                                marker: 
                                    {color: 'firebrick',
                                     opacity: 0.7,
                                     line: {color: 'black',
                                            width: 1.0}},
                                type: 'bar',
                                orientation: 'h'
                            }];
                    
                    var barChartLayoutDictionary 
                            = {
                                title: 
                                    {text: '<b>Top 10 Operational Taxonomic Units (OTUs)</b>',
                                     font: 
                                        {color: 'black', 
                                         family: 'georgia', 
                                         size: 18}},
                                xaxis: 
                                    {title:
                                        {text: 'Sample Values', 
                                         font: 
                                            {size: 14, 
                                             color: 'black', 
                                             family: 'georgia'}},
                                     tickcolor: 'black',
                                     tickfont: 
                                        {family: 'georgia', 
                                         color: 'black'},
                                     tickwidth: 10},
                                yaxis: 
                                    {automargin: true,
                                     title: 
                                        {text: 'Operational Taxonomic Units (OTUs)',
                                         font: 
                                            {size: 14, 
                                             color: 'black', 
                                             family: 'georgia'}},
                                     tickcolor: 'black',
                                     tickfont: 
                                        {family: 'georgia', 
                                         color: 'black'},
                                     tickwidth: 20},
                                height: 400,
                                width: 400,
                                margin: 
                                    {l: 100, 
                                     r: 100, 
                                     t: 100, 
                                     b: 100}
                              };
                    
                    Plotly
                        .newPlot
                            ('barChart', 
                             barChartTraceDictionaryList,
                             barChartLayoutDictionary)
                }
            );
}; // This right brace ends the block for the subroutine, 
// GenerateBarChartSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:   GenerateBubbleChartSubroutine
 *
 *  SubroutineDescription:  
 *      This subroutine generates the Dashboard's bubble chart
 *      for the current sample.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          currentSampleNameString
 *                          This parameter is the name of the current sample.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/06/23    Initial Development                     N. James George
 *
 ****************************************************************************/

function GenerateBubbleChartSubroutine 
            (currentSampleNameString) 
{
    FetchJsonDataFromURLFunction (urlString)
        .then
            (microbialDataDictionary => 
                {
                    var currentSampleDictionary 
                            = microbialDataDictionary
                                .samples
                                .filter
                                    (sampleKey => 
                                        sampleKey.id == currentSampleNameString)[0];

                    var bubbleChartTraceDictionaryList
                            = [{
                                    x: currentSampleDictionary.otu_ids,
                                    y: currentSampleDictionary.sample_values,
                                    text: currentSampleDictionary.otu_labels,
                                    hoverlabel: 
                                        {font: 
                                            {color: 'black', 
                                             family: 'garamond',
                                             size: 12},
                                            bgcolor: 'white',
                                            bordercolor: 'brown'},
                                    hovermode: 'closest',
                                    hovertemplate:
                                        '<b>%{xaxis.title.text}:</b> %{x}<br>'
                                        + '<b>%{yaxis.title.text}:</b> %{y}<br>' 
                                        + '<b>Bacteria:</b> %{text}' 
                                        + '<extra></extra>',
                                    mode: 'markers',
                                    marker: 
                                        {color: currentSampleDictionary.otu_ids,
                                         colorscale: 'Bluered',
                                         size: currentSampleDictionary.sample_values,
                                         opacity: 0.7}
                                }];
                                
                    var bubbleChartLayoutDictionary 
                            = {
                                    title: '<b>Specimen Composition for Sample</b>',
                                    titlefont: {size: 28},
                                    font: {color: 'black', 
                                           family: 'garamond'},
                                    height: 1000,
                                    width: 1140,
                                    xaxis: {title: 'Operational Taxonomic Units (OTUs)', 
                                            titlefont: {size: 20}},
                                            yaxis: {title: 'Sample Values', 
                                                    titlefont: {size: 20}},
                                            hovermode: 'closest',
                                            margin: {l: 100, r: 100, b: 100, t: 100}
                              };
                
                    Plotly
                        .newPlot
                            ('bubbleChart', 
                             bubbleChartTraceDictionaryList, 
                             bubbleChartLayoutDictionary)
            }
        );
}; // This right brace ends the block for the subroutine, 
// GenerateBarChartSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:  InitializeWebPageSubroutine
 *
 *  Subroutine Description:  
 *      This subroutine initializes the Microbial Diversity Dashboard 
 *      by populating the drop down menu and setting up the various 
 *      charts.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  n/a     n/a             n/a
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/06/23    Initial Development                     N. James George
 *
 ****************************************************************************/

function InitializeWebPageSubroutine () 
{
    var dropdownMenuSelectionObject 
            = d3.select
                ('#selectDataset');

    FetchJsonDataFromURLFunction (urlString)
        .then
            (microbialDataDictionary => 
                microbialDataDictionary
                    .names
                    .forEach
                        (nameString => 
                            dropdownMenuSelectionObject
                                .append('option')
                                .text(nameString)
                                .property('value'),

                            OptionsChangeSubroutine
                                (microbialDataDictionary.names[0])
                        )
            );
}; // This right brace ends the block for the subroutine, 
// InitializeWebPageSubroutine.


// This line of code calls the initialize function for the Microbial Diversity Dashboard.
InitializeWebPageSubroutine();