/*
==========================================================
WhoISThis
intelligence.js

Main intelligence router

Detects:
- IP addresses
- Domains
- MAC addresses

Routes analysis
==========================================================
*/


window.WhoISThisIntel = {





// ======================================================
// Detect Input Type
// ======================================================


detect(input){


    const value =
        input.trim();



    // MAC Address

    const macRegex =
    /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;



    if(
        macRegex.test(value)
    ){

        return "MAC";

    }




    // IPv4

    const ipv4Regex =
    /^(\d{1,3}\.){3}\d{1,3}$/;



    if(
        ipv4Regex.test(value)
    ){

        return "IPv4";

    }





    // IPv6

    if(
        value.includes(":")
    ){

        return "IPv6";

    }





    // Domain

    const domainRegex =
    /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;



    if(
        domainRegex.test(value.replace(
            /^https?:\/\//,
            ""
        ))
    ){

        return "DOMAIN";

    }




    return "UNKNOWN";



},







// ======================================================
// Normalize Input
// ======================================================


normalize(input,type){


    let value =
        input.trim();




    if(type==="DOMAIN"){


        value =
        value
        .replace(
            /^https?:\/\//,
            ""
        )
        .replace(
            /\/.*$/,
            ""
        )
        .toLowerCase();


    }





    if(type==="MAC"){


        value =
        value
        .replaceAll(
            "-",
            ":"
        )
        .toUpperCase();


    }



    return value;


},







// ======================================================
// Confidence
// ======================================================


confidence(level){



    const data={


        high:{

            icon:"🟢",

            label:"Verified"

        },


        medium:{


            icon:"🟡",

            label:"Public Metadata"


        },


        low:{


            icon:"⚪",

            label:"Limited Data"


        }


    };



    return (
        data[level]
        ||
        data.low
    );


},







// ======================================================
// Summary Generator
// ======================================================


summary(data){



    let result=[];



    if(data.type){


        result.push(
            `Detected input type: ${data.type}.`
        );


    }





    if(data.location){


        result.push(
            `Location: ${data.location}.`
        );


    }





    if(data.organization){


        result.push(
            `Organization: ${data.organization}.`
        );


    }





    if(data.network){


        result.push(
            `Network: ${data.network}.`
        );


    }





    if(data.security){


        result.push(
            `Security status: ${data.security}.`
        );


    }




    return result;



},







// ======================================================
// Main Router
// ======================================================


async analyze(input){



    const type =
        this.detect(input);



    const normalized =
        this.normalize(
            input,
            type
        );



    console.log(
        "WhoISThis detected:",
        type,
        normalized
    );





    switch(type){



        case "IPv4":

        case "IPv6":


            if(
                window.analyzeIP
            ){

                return await analyzeIP(
                    normalized
                );

            }


            break;







        case "DOMAIN":



            if(
                window.analyzeDomain
            ){

                return await analyzeDomain(
                    normalized
                );

            }


            break;







        case "MAC":



            if(
                window.analyzeMAC
            ){

                return await analyzeMAC(
                    normalized
                );

            }


            break;



    }





    return {

        type,

        value:normalized,

        error:
        "No analyzer available"


    };





}





};





console.log(

"%cWhoISThis Intelligence Engine Loaded",

"color:#00d4ff;font-weight:bold;"

);
