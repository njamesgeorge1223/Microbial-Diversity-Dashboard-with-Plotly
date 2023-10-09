/****************************************************************************
 *
 *  File Name:  microbialDiversityApp.js
 *
 *  File Description:
 *      This Javascript file contains the function calls for the html file,
 *      microbialDiversityIndex.html.
 *
 *
 *  Date        Description                             Programmer
 *  ----------  ------------------------------------    ------------------
 *  10/06/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

// This global variable contains the belly button biodiversity data set as
// a List of JSON Dictionaries
let samplesDataGlobalJsonDictionaryList = null


/****************************************************************************
 *
 *  Function Name:  FetchJsonDataFromURLFunction
 *
 *  Function Description:  
 *      This function retrieves the belly button biodiversity data set 
 *      from the specified URL.
 *
 *
 *  Function Parameters:
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

async function FetchJsonDataFromURLFunction () 
{
    
    const jsonDataURLString 
            = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/'
              + 'v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

    let dataD3JsonObject = null;
  

    try 
    {
        dataD3JsonObject 
            = await 
                d3.json
                    (jsonDataURLString)
    }
    catch (errorObject) 
    {
        console.error
            (errorObject)
    }
 
  
    return dataD3JsonObject;
 
} // This right brace ends the block for the function, FetchJsonDataFromURLFunction.


/****************************************************************************
 *
 *  Function Name:  InitializeWebPageFunction
 *
 *  Function Description:  
 *      This function initializes the Microbial Diversity Dashboard 
 *      by populating the drop down menu and setting up the various 
 *      charts.
 *
 *
 *  Function Parameters:
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

function InitializeWebPageFunction () 
{

    let dropdownMenuSelectionObject 
            = d3.select
                ('#selectDataset');


    FetchJsonDataFromURLFunction ()
        .then
            (
                (resultsObject => 
                    {
                        samplesDataGlobalJsonDictionaryList
                            = resultsObject;  

                        resultsObject
                            .names.forEach
                                (
                                    (currentIDString => 
                                        {
                                            dropdownMenuSelectionObject
                                                .append ('option')
                                                .text (currentIDString)
                                                .property ('value', 
                                                           currentIDString);
                                        }
                                    )
                                );

                                
                        //console.log
                        //    (resultsObject)


                        let firstIDString 
                                = resultsObject.names [0];
            
                        OptionsChangeFunction
                            (firstIDString);
                    }
                )
            );

}; // This right brace ends the block for the function, InitializeWebPageFunction.


/****************************************************************************
 *
 *  Function Name:  OptionsChangeFunction
 *
 *  Function Description:  
 *      This function updates the metadata and charts with the current
 *      sample's data.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          currentIDString
 *                          This parameter is the ID for the current sample.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/06/23    Initial Development                     N. James George
 *
 ****************************************************************************/

function OptionsChangeFunction
            (currentIDString) 
{ 

    console.log
        (currentIDString)


    GenerateBarChartFunction
      (currentIDString);

    GenerateBubbleChartFunction
       (currentIDString);

    GenerateMetadataFunction
      (currentIDString);

    GenerateGaugeChartFunction
      (currentIDString);

}; // This right brace ends the block for the function, optionsChangeFunction.


/****************************************************************************
 *
 *  Function Name:   GenerateBarChartFunction
 *
 *  Function Description:  
 *      This function generates the Dashboard's bar chart
 *      for the current sample.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          currentIDString
 *                          This parameter is the ID for the current sample.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/06/23    Initial Development                     N. James George
 *
 ****************************************************************************/

function GenerateBarChartFunction
            (currentIDString) 
{

    let chartDataObject 
            = samplesDataGlobalJsonDictionaryList
                .samples
                .filter
                    (results => results.id == currentIDString) [0];

    let sample_values 
        =  chartDataObject.sample_values;
  
    let otu_ids 
        =  chartDataObject.otu_ids;
                  
    let otu_labels 
        =  chartDataObject.otu_labels;
 

    let top10ValuesDataObject 
        = sample_values
            .slice (0, 10)
            .reverse ();

    let top10IDsDataObject 
        = otu_ids
            .slice (0, 10)
            .map (currentID => `OTU ${currentID}`)
            .reverse ();

    let top10LabelsDataObject 
        = otu_labels
            .slice (0, 10)
            .reverse ();
                

    //console.log
    //    (sample_values)

    //console.log
    //    (otu_ids)

    //console.log
    //    (otu_labels)


    let barChartTraceDictionaryList
        = [{
                text: top10LabelsDataObject,
                type: 'bar',
                orientation: 'h',
                x: top10ValuesDataObject,
                y: top10IDsDataObject,
                marker: 
                    {color: 'aqua',
                     line: {color: 'black',
                            width: 1.0}}
            }];

    let barChartLayoutDictionary 
            = {
                title: '<b>Top 10 OTUs</b>',
                titlefont: {size: 28},
                font: {color: 'black', 
                       family: 'Garamond'},
                xaxis: {title: 'Sample Count', 
                        titlefont: {size: 20}},
                yaxis: {title: 'OTU ID', 
                        titlefont: {size: 20}},
                paper_bgcolor: 'lavender'
              };


    //console.log
    //    (barChartTraceDictionaryList)
        
    //console.log
    //    (barChartLayoutDictionary)


    Plotly.newPlot
        ('bar', 
         barChartTraceDictionaryList,
         barChartLayoutDictionary)

}; // This right brace ends the block for the function, GenerateBarChartFunction.


/****************************************************************************
 *
 *  Function Name:   GenerateBubbleChartFunction
 *
 *  Function Description:  
 *      This function generates the Dashboard's bubble chart
 *      for the current sample.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          currentIDString
 *                          This parameter is the ID for the current sample.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/06/23    Initial Development                     N. James George
 *
 ****************************************************************************/

function GenerateBubbleChartFunction 
            (currentIDString) 
{

    let chartDataObject 
        = samplesDataGlobalJsonDictionaryList
            .samples
            .filter
                (results => results.id == currentIDString) [0];

    let sample_values 
        =  chartDataObject.sample_values;
  
    let otu_ids 
        =  chartDataObject.otu_ids;
                  
    let otu_labels 
        =  chartDataObject.otu_labels;


    //console.log
    //    (sample_values)

    //console.log
    //    (otu_ids)

    //console.log
    //    (otu_labels)


    let bubbleChartTraceDictionaryList
            = [{
                    text: otu_labels,
                    x: otu_ids,
                    y: sample_values,
                    mode: 'markers',
                    marker: 
                        {size: sample_values,
                         color: otu_ids,
                         colorscale: 'Bluered'}
                }];

    let bubbleChartLayoutDictionary 
        = {
                title: '<b>Sample Specimen Composition</b>',
                titlefont: {size: 28},
                font: {color: 'black', family: 'Garamond'},
                xaxis: {title: 'OTU ID', 
                        titlefont: {size: 20}},
                yaxis: {title: 'Composition', 
                        titlefont: {size: 20}},
                hovermode: 'closest',
                paper_bgcolor: 'lavender'
          };


    //console.log
    //    (bubbleChartTraceDictionaryList)
  
    //console.log
    //    (bubbleChartLayoutDictionary)


    Plotly.newPlot
        ('bubble', 
         bubbleChartTraceDictionaryList, 
         bubbleChartLayoutDictionary)

}; // This right brace ends the block for the function, GenerateBarChartFunction.


/****************************************************************************
 *
 *  Function Name:   GenerateMetadataFunction
 *
 *  Function Description:  
 *      This function generates the Dashboard's metadata information
 *      for the current sample.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          currentIDString
 *                          This parameter is the ID for the current sample.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/06/23    Initial Development                     N. James George
 *
 ****************************************************************************/

function GenerateMetadataFunction
            (currentIDString) 
{

    let metaDataObject
            = samplesDataGlobalJsonDictionaryList
                .metadata
                .filter
                    (results => results.id == currentIDString) [0];


    d3.select
        ('#metadata-sample')
      .html
        ('');


    Object
        .entries
            (metaDataObject)
        .forEach
            (
                ([keyObject, valueObject]) => 
                    {
                        if (typeof valueObject === 'string') 
                        {
                            if (valueObject.includes('WashingtonDC') === true)
                            {
                                valueFinalObject = 'Washington, DC'
                            }
                            else if (valueObject.includes('DurhamNC') === true)
                            {
                                valueFinalObject = 'Durham, NC'
                             }
                            else if (valueObject.includes('St.Louis') === true)
                            {
                                valueFinalObject = 'St.Louis, MO'
                            }
                            else if (valueObject.includes('London') === true)
                            {
                                valueFinalObject = 'London, UK'
                            }
                            else if (valueObject.includes ('/') === true) 
                            {
                                valueFinalObject = valueObject.replace('/', ', ')
                            }
                            else if (valueObject.includes(',') === true 
                                     && valueObject.includes(', ') == false) 
                            {
                                valueFinalObject = valueObject.replace(',', ', ')
                            }
                            else 
                            {
                                valueFinalObject = valueObject
                            }
                        }
                        else 
                        {
                            valueFinalObject = valueObject
                        }


                        //console.log
                        //    (keyObject.toUpperCase())
                
                        //console.log
                        //    (valueFinalObject)
                

                        d3.select
                            ('#metadata-sample')
                          .append
                            ('h6')
                          .text
                            (`${keyObject.toUpperCase()}: ${valueFinalObject}`);
                    }
            );

};


/****************************************************************************
 *
 *  Function Name:   GenerateGaugeChartFunction
 *
 *  Function Description:  
 *      This function generates the Dashboard's gauge chart
 *      for the current sample.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          currentIDString
 *                          This parameter is the ID for the current sample.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/06/23    Initial Development                     N. James George
 *
 ****************************************************************************/

function GenerateGaugeChartFunction 
            (currentIDString) 
{
 
    let gaugeChartDataObject
            = samplesDataGlobalJsonDictionaryList
                .metadata
                .find
                    (results => results.id == currentIDString);

    let washingFrequencyInteger
            = gaugeChartDataObject.wfreq

    let gaugeChartTraceDictionaryList
            = [
                {
                    type: 'indicator',
                    mode: 'gauge+number',
                    value: washingFrequencyInteger,
                    title: {text: '<b>Belly Button Washing Frequency</b>' 
                                  + '<br> Scrubs Per Week',
                            font: {size: 28}},
                    domain: {x: [0, 1], y: [0, 1]},
                    gauge: {axis: {range: [null, 9], 
                                   tickwidth: 2.0, 
                                   tickcolor: 'black'},
                            bar: {color: 'blue'},
                            bgcolor: 'white',
                            borderwidth: 1.0,
                            bordercolor: 'black',
                            steps: [{range: [0, 2], color: '6e78ff'},
                                    {range: [2, 4], color: '6c8dfa'},
                                    {range: [4, 5], color: '6aa1f4'},
                                    {range: [5, 6], color: '68b6ef'},
                                    {range: [6, 7], color: '65cbe9'},
                                    {range: [7, 8], color: '63dfe4'},
                                    {range: [8, 9], color: '61f4de'}],
                            threshold: {line: {color: 'indigo', 
                                               width: 4.0},
                                        thickness: 1.0,
                                        value: 9}}
                }
              ];
    
  
    let gaugeChartLayoutDictionary  
            = {width: 445, 
               height: 450, 
               font: {color: 'black', 
                      family: 'Garamond', 
                      size: 20.0},
               paper_bgcolor: 'lavender'};
    

    //console.log
    //    (currentIDString)
       
    //console.log
    //    (gaugeChartDataObject)
       
    //console.log
    //    (washingFrequencyInteger)

    //console.log
    //    (gaugeChartTraceDictionaryList)

    //console.log
    //    (gaugeChartLayoutDictionary)              
    

    Plotly.newPlot
        ('gauge', 
         gaugeChartTraceDictionaryList, 
         gaugeChartLayoutDictionary);

} // This right brace ends the block for the function, GenerateGaugeChartFunction.


// This line of code calls the initialize function for the Microbial Diversity Dashboard.
InitializeWebPageFunction();