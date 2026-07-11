/*
==========================================================
WhoISThis

ssl.js

SSL / TLS Intelligence Engine

Uses Certificate Transparency data
==========================================================
*/


window.WhoISThisSSL = {




// ======================================================
// Certificate Transparency API
// ======================================================


endpoint:
"https://crt.sh/?output=json&identity=",







// ======================================================
// Domain Cleanup
// ======================================================


normalize(domain){


    return domain

        .replace(
            /^https?:\/\//,
            ""
        )

        .replace(
            /\/.*$/,
            ""
        )

        .toLowerCase();



},







// ======================================================
// Certificate Lookup
// ======================================================


async lookup(domain){


    try{


        const clean =
        this.normalize(domain);



        const response =
        await fetch(

            this.endpoint +
            encodeURIComponent(clean)

        );



        const data =
        await response.json();



        return data || [];



    }


    catch(error){


        console.error(
            "SSL lookup failed:",
            error
        );


        return [];


    }


},







// ======================================================
// Analyze Certificates
// ======================================================


async analyze(domain){



    const certificates =
    await this.lookup(
        domain
    );



    if(
        certificates.length === 0
    ){


        return {


            success:false,


            message:
            "No certificates found"



        };


    }






    const latest =
    certificates[
        certificates.length - 1
    ];






    let names =
    new Set();



    certificates.forEach(cert=>{


        if(
            cert.name_value
        ){


            cert.name_value
            .split("\n")
            .forEach(name=>{


                names.add(
                    name
                );


            });


        }


    });







    return {



        success:true,



        domain,



        certificates:

        certificates.length,



        issuer:

        latest.issuer_name
        ||
        "Unknown",




        firstSeen:

        certificates[0]
        .entry_timestamp
        ||
        "-",




        latestSeen:

        latest.entry_timestamp
        ||
        "-",




        domains:

        Array.from(
            names
        ),



        raw:

        certificates



    };





}







};





console.log(

"%cWhoISThis SSL Engine Loaded",

"color:#00d4ff;font-weight:bold;"

);
