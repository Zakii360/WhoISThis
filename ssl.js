/*
==========================================================
WhoISThis

ssl.js v2

SSL / TLS Intelligence Engine

Uses Certificate Transparency logs

==========================================================
*/


window.WhoISThisSSL = {





endpoint:
"https://crt.sh/?output=json&identity=",







// ======================================================
// Clean Domain
// ======================================================


normalize(domain){


    return domain

    .replace(
        /^https?:\/\//,
        ""
    )

    .split("/")[0]

    .trim()

    .toLowerCase();


},







// ======================================================
// Fetch Certificates
// ======================================================


async fetchCertificates(domain){



    try{


        const response =
        await fetch(

            this.endpoint +
            encodeURIComponent(
                domain
            )

        );



        if(
            !response.ok
        )
            return [];



        return await response.json();



    }

    catch(error){


        console.error(
            "Certificate lookup failed",
            error
        );


        return [];

    }


},







// ======================================================
// Extract Domains
// ======================================================


extractDomains(certificates){



    let domains =
    new Set();



    certificates.forEach(cert=>{


        if(
            cert.name_value
        ){


            cert.name_value

            .split("\n")

            .forEach(name=>{


                domains.add(
                    name.trim()
                );


            });


        }


    });



    return [
        ...domains
    ];



},







// ======================================================
// Wildcard Detection
// ======================================================


hasWildcard(domains){



    return domains.some(
        domain =>
        domain.startsWith(
            "*."
        )
    );



},







// ======================================================
// Analyze
// ======================================================


async analyze(domain){



    const clean =
    this.normalize(
        domain
    );



    const certificates =
    await this.fetchCertificates(
        clean
    );




    if(
        certificates.length===0
    ){


        return {


            success:false,


            message:
            "No certificates found"



        };


    }







    const first =
    certificates[0];



    const latest =
    certificates[
        certificates.length-1
    ];





    const domains =
    this.extractDomains(
        certificates
    );






    return {



        success:true,



        domain:clean,



        certificates:

        certificates.length,



        issuer:

        latest.issuer_name
        ||
        "Unknown",



        firstSeen:

        first.entry_timestamp
        ||
        "-",



        latestSeen:

        latest.entry_timestamp
        ||
        "-",



        wildcard:

        this.hasWildcard(
            domains
        )
        ?
        "Yes"
        :
        "No",



        domains,



        primaryDomains:

        domains.slice(
            0,
            10
        ),



        raw:

        certificates



    };





}






};





console.log(

"%cWhoISThis SSL Engine v2 Loaded",

"color:#00d4ff;font-weight:bold;"

);
