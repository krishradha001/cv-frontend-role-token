$(function(){ // on dom ready

    var elemsNodes = {};
    var softwareviewData = [];
    
    var url_string = window.location.href;
    var url = new URL(url_string);
    var devicesDetails = '';

    var cytoAry = [];

    function getHtmlFrmtDetails(elementAry){
        return '<h2><strong>Device Details</strong></h2>'+
        '<table border="1" style="border-collapse: collapse; width: 100%; height: 105px;">'+
        '<tbody><tr style="height: 21px;">'+
        '<td style="width: 50%; height: 21px;"><strong>Name</strong></td>'+
        '<td style="width: 50%; height: 21px;">'+ elementAry.name +'</td></tr>'+        
        '<tr style="height: 21px;"><td style="width: 50%; height: 21px;"><strong>Ram</strong></td>'+
        '<td style="width: 50%; height: 21px;">'+ elementAry.ram +'</td></tr>'+
        '<tr style="height: 21px;"><td style="width: 50%; height: 21px;"><strong>CPU Core</strong></td>'+
        '<td style="width: 50%; height: 21px;">'+ elementAry.cpucore +'</td></tr>'+
        '<tr style="height: 21px;"><td style="width: 50%; height: 21px;"><strong>OS</strong></td>'+
        '<td style="width: 50%; height: 21px;">'+ elementAry.os +'</td></tr>'+
        '<tr style="height: 21px;"><td style="width: 50%; height: 21px;"><strong>CPU Count</strong></td>'+
        '<td style="width: 50%; height: 21px;">'+ elementAry.cpucount +'</td></tr></tbody></table>'+
        '<p></p>'+
        '<h3><strong>IP Addresses:</strong></h3>'+
        '<table border="1" style="border-collapse: collapse; width: 100%;">'+
        '<tbody><tr>'+
        '<td style="width: 50%;"><strong>Subnet</strong></td>'+
        '<td style="width: 50%;">'+ elementAry.ip_addresses.subnet +'</td></tr>'+
        '<tr><td style="width: 50%;"><strong>IP</strong></td>'+
        '<td style="width: 50%;">'+ elementAry.ip_addresses.ip +'</td></tr>'+
        '<tr><td style="width: 50%;"><strong>Vrf Group Name</strong></td>'+
        '<td style="width: 50%;">'+ elementAry.ip_addresses.vrf_group_name +'</td></tr></tbody></table>';
    }


    $.getJSON('http://localhost:5000/serverview', {}, function(data, textStatus, jqXHR){
                
        var elems = {};
        var edgeData = [];
        var dataNodes = [];
        softwareviewData = data;

        if (softwareviewData.length > 0) {
            cytoAry["nodes"] = [];
            softwareviewData.forEach((deviceItem, index) => {                 
                if (deviceItem.name) {
                    cytoAry["nodes"].push(deviceItem.name);
                }
            });
        
            softwareviewData.forEach((dependent_devices, index) => {
                let softwareDetails = dependent_devices.dependent_devices;
        
                if(softwareDetails.length > 0){                        
                    softwareDetails.forEach((devices, ipIndex) => {                      
                        if (devices.name) {
                            cytoAry["nodes"].push(devices.name);
                        }                    
                    });
                }                  
            });

            // console.log(cytoAry["nodes"]);           
            cytoAry["nodes"] = [...new Set(cytoAry["nodes"])];
            // console.log(cytoAry["nodes"]);                    
        }    
    });

    $.getJSON('http://localhost:5000/devdetails', {}, function(data, textStatus, jqXHR){
        devicesDetails = data;

        var elems = {};
        var edgeData = [];
        var dataNodes = [];
        cytoAry["2DimIds"]=[];
        cytoAry["names"]=[];
        cytoAry["temp"] = [];

        if (cytoAry["nodes"].length > 0) {
            cytoAry["nodes"].forEach((deviceItem, index) => {
                var subNodeData = {};
                if (deviceItem) {
                    devicesDetails.forEach(element => {
                        if(element.name == deviceItem){ 
                            subNodeData["data"] = {
                                id: deviceItem,
                                popup: getHtmlFrmtDetails(element),
                            }
                            dataNodes.push(subNodeData);
                            // console.log(element);
                            }
                    });
                }
            });

            softwareviewData.forEach((dependent_devices, index) => {
                let softwareDetails = dependent_devices.dependent_devices;
        
                if(softwareDetails.length > 0){
                    softwareDetails.forEach((devices, ipIndex) => {
                        var subNodeData = {};
                        let custEdgeNodesIp = {};
                        let temPos = {};   

                        if((!cytoAry["2DimIds"].includes(devices+dependent_devices.name)) && (!cytoAry["2DimIds"].includes(dependent_devices.name+devices))){

                            custEdgeNodesIp["data"]={};

                            custEdgeNodesIp["data"] = {
                                id: devices+dependent_devices.name,
                                source: dependent_devices.name,
                                target: devices
                            }

                            edgeData.push(custEdgeNodesIp);
                            cytoAry["2DimIds"].push(devices+dependent_devices.name);                            
                            cytoAry["2DimIds"].push(dependent_devices.name+devices);                           
                        }else{
                            cytoAry["names"].push(dependent_devices.name+devices);
                        }
                                                                          
                    });
                }                  
            });

            elemsNodes["nodes"] = dataNodes;
            elemsNodes["edges"] = edgeData;
            elems = elemsNodes;
            var nodes = elems.nodes;

            console.log(elems);
            // console.log(cytoAry["temp"]);

            var maxZoomIndex = parseFloat(3.0);
            var minZoomIndex = parseFloat(0.5);
            
            var cy = cytoscape({            
                container: document.getElementById('cy'),
                boxSelectionEnabled: false,
                autounselectify: true,
                maxZoom: 2,
                minZoom: 0.5,
                elements: elems,
                layout: {
                name: 'cose',
                padding: 100
                },
                style: [{
                selector: 'node',
                style: 'node { content: data(label); }'
            }, {
                "selector": "node",
                "style": {
                    "width": "50px",
                    "height": "50px",
                    "content": "data(id)",
                    "font-size": "4px",
                    "text-valign": "center",
                    "text-halign": "center",
                    "background-color": "#fff",
                    "color": "#000",
                    "overlay-padding": "6px",
                    "z-index": "10",
                    "border-width": "1px",
                    "border-color": "#7a7480",
                    "border-opacity": "1",
                    '-webkit-font-smoothing': 'antialiased',
                    '-moz-osx-font-smoothing': 'grayscale'
                }
            }, {
                "selector": "node.subnet",
                "style": {
                    "width": "100px",
                    "height": "100px",
                }
            }, {
                "selector": "node.deviceName",
                "style": {
                    "width": "75px",
                    "height": "75px",
                }
            }, {
                "selector": "edge",
                "style": {
                    'curve-style': 'bezier',
                    "opacity": "1",
                    "line-color": "#7a7480",
                    "width": "1px",
                    'line-style': 'solid',
                    "color": "#7a7480",                    
                }
            },{
                "selector": "edge.singleDirection",
                "style": {
                    "line-color": "#0097ac",
                    'target-arrow-color': '#0097ac',
                    'target-arrow-shape': 'triangle',
                    "background-color": "#0097ac",
                    "color": "#0097ac",  
                    'source-arrow-color': '#0097ac'                  
                }
            },{
                "selector": "edge.twoDirection",
                "style": {
                    "line-color": "#881e87",
                    'target-arrow-color': '#881e87',
                    'target-arrow-shape': 'triangle',
                    "background-color": "#881e87",
                    "color": "#0097ac",  
                    'source-arrow-shape': 'triangle',
                    'source-arrow-color': "#881e87",               
                }
            }, {
                selector: 'edge.semitransp', // on hover class for edges
                style: {
                    'opacity': '1'
                }
            }],          
                ready: function(){
                window.cy = this;
                }
            });

            console.log(cytoAry["names"]);

            cytoAry["names"].forEach(element => {
                console.log(element);
                // cy.getElementById(element).style({'target-arrow-color': '#000','source-arrow-color': '#000','source-arrow-shape': 'triangle-backcurve', 'target-arrow-shape': 'triangle-backcurve'});
            });

            if (elems.edges && elems.edges.length > 0) {
                elems.edges.forEach((item, index) => {
                    if(cytoAry["names"].includes(item.data.id)){
                        cy.$("#" + item.data.id).addClass('twoDirection');
                    }else{
                        cy.$("#" + item.data.id).addClass('singleDirection');
                    }                    
                    console.log(item.data.id);
                });
            }
            
            if (nodes && nodes.length > 0) {
                nodes.forEach((item, index) => {
                    cy.$("#" + item.data.id).addClass('singleDirection');
                    console.log(item.data.id);

                    // you can use qtip's regular options
                    // see http://qtip2.com/
                    
                    cy.$('#'+item["data"].id).qtip({
                        content: item["data"].popup,
                        position: {
                        my: 'top center',
                        at: 'bottom center'
                        },
                        style: {
                        classes: 'qtip-bootstrap',
                        tip: {
                            width: 16,
                            height: 8
                        }
                        }
                    });

                    
                    if (nodes.length - 1 == index) {
                        setTimeout(function() {
                            document.getElementById("cy").style.position = "inherit";
                            console.log(item);
                            cy.animate({
                                zoom: 1.5
                            }, {
                                duration: 1000
                            });

                            setTimeout(function() {
                                cy.animate({
                                    center: true,
                                    zoom: 1.5
                                }, {
                                    duration: 1000
                                });
                            }, 2000);
                            document.querySelector("#cy div").style.height = "100vh";
                        }, 4000);
                    }
                    /* if node ends here */

                });
            }/* if node length exists ends here */

            var slider = document.getElementById("zoomVal");

                slider.onchange = function() {
                    let zoomVal = +this.value / 100;
                    cy.zoom(zoomVal);
                    console.log(zoomVal);
                }

                document.getElementById("cy").addEventListener("wheel", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    cy.userZoomingEnabled(false);

                    let zoomSliderVal = parseFloat(document.getElementById("zoomVal").value / 100);
                    let zoomIndex = zoomSliderVal;

                    if (Math.sign(e.deltaY) == 1) {

                        if ((zoomIndex >= minZoomIndex) && (zoomIndex <= maxZoomIndex)) {
                            document.getElementById("zoomVal").value = (zoomIndex - parseFloat(0.1)) * parseFloat(100);
                            cy.zoom((zoomIndex - parseFloat(0.1)));
                        }
                    }

                    if (Math.sign(e.deltaY) == -1) {
                        if ((zoomIndex >= minZoomIndex) && (zoomIndex <= maxZoomIndex)) {
                            document.getElementById("zoomVal").value = (zoomIndex + parseFloat(0.1)) * parseFloat(100);
                            cy.zoom((zoomIndex + parseFloat(0.1)));
                        }
                    }

                    return false;
                });

                document.getElementById("zoomPlus").addEventListener("click", function(e) {
                    let zoomSliderVal = parseFloat(document.getElementById("zoomVal").value / 100);
                    let zoomIndex = zoomSliderVal;
                    document.getElementById("zoomVal").value = (zoomIndex + parseFloat(0.1)) * parseFloat(100);
                    cy.zoom((zoomIndex + parseFloat(0.1)));
                    console.log(document.getElementById("zoomVal").value);

                });
            

        } // cytoAry["nodes"] .length


       

    })
    // .done(function () { alert('Request done!'); })
    .fail(function (jqxhr,settings,ex) { 
        // alert('failed, '+ ex); 
    });

    
    
    

 
}); // on dom ready