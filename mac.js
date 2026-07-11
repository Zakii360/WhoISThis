/*
==========================================================
WhoISThis

mac.js v2

MAC Address Intelligence Engine

Uses WhoISThisDB.macVendors

==========================================================
*/


window.WhoISThisMAC = {





// ======================================================
// Normalize MAC
// ======================================================


normalize(mac){


    return mac

    .replace(
        /[^a-fA-F0-9]/g,
        ""
    )

    .toUpperCase();

},







// ======================================================
// Validate MAC
// ======================================================


isValid(mac){



    return (

        /^[0-9A-F]{12}$/

        .test(mac)

    );


},







// ======================================================
// Get OUI
// ======================================================


getOUI(mac){


    return mac.substring(
        0,
        6
    );


},







// ======================================================
// MAC Address Properties
// ======================================================


properties(mac){



    const firstByte =
    parseInt(
        mac.substring(
            0,
            2
        ),
        16
    );



    return {



        multicast:

        Boolean(
            firstByte & 1
        ),



        locallyAdministered:

        Boolean(
            firstByte & 2
        ),



        type:

        (
            firstByte & 2
        )

        ?

        "Locally Administered"

        :

        "Universal"



    };



},







// ======================================================
// Format MAC
// ======================================================


format(mac){


    return mac.match(
        /.{2}/g
    )
    .join(":");


},







// ======================================================
// Analyze
// ======================================================


async analyze(input){



    const mac =
    this.normalize(
        input
    );



    if(
        !this.isValid(
            mac
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
        mac
    );






    let vendor =
    null;



    if(
        window.WhoISThisDB
    ){


        vendor =
        WhoISThisDB.findMAC(
            oui
        );


    }







    const props =
    this.properties(
        mac
    );








    return {



        success:true,



        mac:
        this.format(
            mac
        ),



        oui,



        vendor:

        vendor?.vendor
        ||
        "Unknown",



        type:

        vendor?.device
        ||
        "Unknown",



        assignment:

        props.type,



        multicast:

        props.multicast
        ?
        "Yes"
        :
        "No",



        locallyAdministered:

        props.locallyAdministered
        ?
        "Yes"
        :
        "No",



        confidence:

        vendor
        ?
        "IEEE OUI Match"
        :
        "Unknown Vendor"



    };





}






};





console.log(

"%cWhoISThis MAC Engine v2 Loaded",

"color:#00d4ff;font-weight:bold;"

);
