/*
==========================================================
WhoISThis
mac.js

MAC Address Intelligence Engine

Uses IEEE OUI style manufacturer mapping.
==========================================================
*/


window.WhoISThisMAC = {





// ======================================================
// Local OUI Database
// Expand with IEEE OUI exports
// ======================================================


vendors:{



"001A2B":{

vendor:"Cisco Systems",

type:"Network Equipment",

assignment:"MA-L"

},



"001B63":{

vendor:"Apple Inc.",

type:"Consumer Electronics",

assignment:"MA-L"

},



"3C5AB4":{

vendor:"Google LLC",

type:"Smart Devices / Networking",

assignment:"MA-L"

},



"F4F5D8":{

vendor:"Google LLC",

type:"Consumer Electronics",

assignment:"MA-L"

},



"FCFBFB":{

vendor:"Apple Inc.",

type:"Consumer Electronics",

assignment:"MA-L"

},



"DCFE07":{

vendor:"Amazon Technologies",

type:"IoT / Smart Home",

assignment:"MA-L"

},



"001C42":{

vendor:"Parallels",

type:"Virtual Machine",

assignment:"MA-L"

},



"005056":{

vendor:"VMware",

type:"Virtualization",

assignment:"MA-L"

},



"525400":{

vendor:"QEMU",

type:"Virtual Machine",

assignment:"Private / Virtual"

},



"00155D":{

vendor:"Microsoft",

type:"Virtualization / Networking",

assignment:"MA-L"

}



},







// ======================================================
// Validate MAC
// ======================================================


isValid(mac){



    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/

    .test(mac);



},







// ======================================================
// Normalize
// ======================================================


normalize(mac){


    return mac

    .replaceAll(
        "-",
        ":"
    )

    .toUpperCase();



},







// ======================================================
// Extract OUI
// ======================================================


getOUI(mac){


    return mac

    .replaceAll(
        ":",
        ""
    )

    .substring(
        0,
        6
    );


},







// ======================================================
// Analyze MAC
// ======================================================


async analyze(mac){



    const normalized =
        this.normalize(
            mac
        );




    if(
        !this.isValid(
            normalized
        )
    ){


        return {


            success:false,


            error:
            "Invalid MAC address"


        };


    }





    const oui =
        this.getOUI(
            normalized
        );




    const vendor =
        this.vendors[oui];






    return {



        success:true,


        mac:normalized,



        oui,



        vendor:

        vendor?.vendor
        ||
        "Unknown",



        type:

        vendor?.type
        ||
        "Unknown",



        assignment:

        vendor?.assignment
        ||
        "Unknown",



        confidence:

        vendor

        ? "Verified OUI Match"

        : "No Local Match"



    };





}





};





console.log(

"%cWhoISThis MAC Engine Loaded",

"color:#00d4ff;font-weight:bold;"

);
