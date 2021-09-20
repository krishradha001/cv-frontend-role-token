$(function(){ // on dom ready

    var elemsNodes = {};
    var softwareviewData = [];
    // var softwareviewData;

    var url_string = window.location.href;
    // var url_string = 'http://localhost:4200/assets/cytoscape/apsIndex.html?selectedType=app_in_device/grafana_server&deviceName=24&appsUrl=http://localhost:5000';
    // var url_string = 'http://localhost:4200/assets/cytoscape/apsIndex.html?selectedType=app_in_device/CMDB&selectedAp=null&appsUrl=http://localhost:5000';
    // var url_string = 'http://localhost:4200/assets/cytoscape/apsIndex.html?selectedType=all_applications&selectedAp=5&appsUrl=http://localhost:5000';
    var url = new URL(url_string);
    var selectedType = url.searchParams.get("selectedType");
    var selectedApCount = url.searchParams.get("selectedAp");
    var appsUrl = url.searchParams.get("appsUrl");
    var deviceId = +url.searchParams.get("deviceName");
    var devicesDetails = '';

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

    $.getJSON('http://localhost:5000/devdetails', {}, function(data, textStatus, jqXHR){
        devicesDetails = data;

        $.getJSON('http://localhost:5000/serverview', {}, function(data, textStatus, jqXHR){
                
            var elems = {};
            var edgeData = [];
            var dataNodes = [];
                    
            softwareviewData = data 
            // JSON.parse(xhr.responseText);
            if (softwareviewData.length > 0) {
                softwareviewData.forEach((deviceItem, index) => {                                
                    var subNodeData = {};
                    if (deviceItem.name) {
                        devicesDetails.forEach(element => {
                            if(element.name == deviceItem.name){ 
                                subNodeData["data"] = {
                                    id: deviceItem.name,
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
                            
                            devicesDetails.forEach(element => {
                                if(element.name == devices.name){ 
                                    //  return element;
                                    subNodeData["data"] = {
                                        id: devices.name,
                                        popup: getHtmlFrmtDetails(element),
                                    }
                                    dataNodes.push(subNodeData);
                                    // console.log(element);
                                    }
                            });

                            // subNodeData["data"] = {
                            //     id: devices.name,
                            //     popup: devices.name
                            // }       
                            // console.log(devices);                     
                            custEdgeNodesIp["data"] = {                                
                                id: devices+dependent_devices.name,
                                source: devices,
                                target: dependent_devices.name,
                                class: 'test'
                            }                            
                                // dataNodes.push(subNodeData);
                                edgeData.push(custEdgeNodesIp);                            
                        });
                    }                  
                });
                        elemsNodes["nodes"] = dataNodes;
                        elemsNodes["edges"] = edgeData;
                        elems = elemsNodes;
                        var nodes = elems.nodes;
            } else {
                elemsNodes["nodes"] = '';
                elemsNodes["edges"] = '';
                elems = '';
                var nodes = '';
            }
            
            console.log(elems);
            
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
                    "border-color": "#000",
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
                    "line-color": "#3c3d3d",
                    "width": "1px",
                    'line-style': 'solid',
                    'target-arrow-color': '#3c3d3d',
                    'target-arrow-shape': 'triangle'                    
                }
            },{
                "selector": ".test",
                "style": {
                    'curve-style': 'bezier',
                    "opacity": "1",
                    "line-color": "#3c3d3d",
                    "width": "1px",
                    'line-style': 'solid',
                    'target-arrow-color': '#3c3d3d',
                    'target-arrow-shape': 'triangle',
                    'source-arrow-shape': 'triangle-backcurve',
                    'target-arrow-shape': 'triangle-backcurve'
                }
            }, {
                selector: '.subnet',
                style: {
                    'border-color': '#7a7480',
                    "line-color": "#7a7480",
                    'color': '#000'
                }
            }, {
                selector: '.subnet:selected',
                style: {
                    'border-color': '#7a7480',
                    "line-color": "#7a7480",
                    'background-color': '#7a7480',
                    'color': '#fff'
                }
            }, {
                selector: '.deviceName',
                style: {
                    'border-color': '#0097ac',
                    "line-color": "#0097ac",
                    'color': '#000'
                }
            }, {
                selector: '.deviceName:selected',
                style: {
                    'border-color': '#0097ac',
                    "line-color": "#0097ac",
                    'background-color': '#0097ac',
                    'color': '#fff'
                }
            }, {
                selector: '.software',
                style: {
                    'border-color': '#c2bcbe',
                    "line-color": "#c2bcbe",
                    'color': '#000'
                }
            }, {
                selector: '.test',
                style: {
                    'border-color': '#c2bcbe',
                    "line-color": "#c2bcbe",
                    'background-color': '#0097ac',
                    'color': '#000'
                }
            }, {
                selector: '.software:selected',
                style: {
                    'border-color': '#c2bcbe',
                    "line-color": "#c2bcbe",
                    'background-color': '#c2bcbe',
                    'color': '#fff'
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

            

            if (nodes && nodes.length > 0) {
                nodes.forEach((item, index) => {

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
                            // console.log(item);
                            // cy.animate({
                            //     zoom: 1.5
                            // }, {
                            //     duration: 1000
                            // });

                            // setTimeout(function() {
                            //     cy.animate({
                            //         center: true,
                            //         zoom: 1.5
                            //     }, {
                            //         duration: 1000
                            //     });
                            // }, 2000);
                            document.querySelector("#cy div").style.height = "100vh";
                        }, 4000);
                    }
                    /* if node ends here */

                });
            }/* if node length exists ends here */

            // cy.getElementById('linux-bastion-hostwebserver-qa').style({'source-arrow-shape': 'triangle-backcurve', 'target-arrow-shape': 'triangle-backcurve'});
            
            
        })
        // .done(function () { alert('Request done!'); })
        .fail(function (jqxhr,settings,ex) { 
                // alert('failed, '+ ex); 
        });

    })
    // .done(function () { alert('Request done!'); })
    .fail(function (jqxhr,settings,ex) { 
        // alert('failed, '+ ex); 
    });

    
    
    

 
}); // on dom ready