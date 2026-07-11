/*
==========================================================
WhoISThis

intelligence.js v2

Input Intelligence Router

Detects:
- IPv4
- IPv6
- Domains
- URLs
- MAC Addresses

==========================================================
*/


window.WhoISThisIntel = {





// ======================================================
// IPv4 Detection
// ======================================================


isIPv4(value){



    const parts =
    value.split(".");


    if(parts.length !== 4)
        return false;



    return parts.every(part=>{


        const num =
        Number(part);



        return (

            !isNaN(num)

            &&

            num >= 0

            &&

            num <=255

        );


    });


},







// ======================================================
// IPv6 Detection
// ======================================================


isIPv6(value){


    return (

        value.includes(":")
        &&

        /^[0-9a-fA-F:]+$/

        .test(value)

    );


},







// ======================================================
// MAC Detection
// ======================================================


isMAC(value){



    const clean =
    value.replace(
        /[^a-fA-F0-9]/g,
        ""
    );



    return (

        clean.length===12

        &&

        /^[0-9a-fA-F]+$/

        .test(clean)

    );



},







// ======================================================
// Domain Detection
// ======================================================


isDomain(value){



    return /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/

    .test(value);



},







// ======================================================
// URL Cleanup
// ======================================================


removeProtocol(value){


    return value

    .replace(
        /^https?:\/\//i,
        ""
    )

    .replace(
        /^www\./i,
        ""
    )

    .split("/")[0]

    .split("?")[0]

    .trim();



},







// ======================================================
// Detect Input
// ======================================================


detect(input){



    const value =
    this.removeProtocol(
        input.trim()
    );




    if(
        this.isMAC(
            value
        )
    ){


        return "MAC";


    }






    if(
        this.isIPv4(
            value
        )
    ){


        return "IPv4";


    }






    if(
        this.isIPv6(
            value
        )
    ){


        return "IPv6";


    }






    if(
        this.isDomain(
            value
        )
    ){


        return "DOMAIN";


    }





    return "UNKNOWN";



},







// ======================================================
// Normalize
// ======================================================


normalize(input,type){



    let value =
    input.trim();




    if(
        type==="DOMAIN"
    ){


        value =
        this.removeProtocol(
            value
        )

        .toLowerCase();


    }





    if(
        type==="MAC"
    ){


        value =
        value

        .replace(
            /[^a-fA-F0-9]/g,
            ""
        )

        .toUpperCase();



    }






    if(
        type==="IPv4"
        ||
        type==="IPv6"
    ){


        value =
        value.trim();



    }




    return value;



},







// ======================================================
// Intelligence Summary
// ======================================================


analyze(input){



    const type =
    this.detect(
        input
    );



    return {


        input,


        type,


        normalized:

        this.normalize(
            input,
            type
        ),



        supported:

        type !== "UNKNOWN"



    };



}







};





console.log(

"%cWhoISThis Intelligence Router v2 Loaded",

"color:#00d4ff;font-weight:bold;"

);
