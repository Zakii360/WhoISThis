/*
==========================================================
WhoISThis
whois.js

WHOIS / RDAP Intelligence Engine

Browser-compatible WHOIS replacement
==========================================================
*/


window.WhoISThisWHOIS = {



// ======================================================
// RDAP Servers
// ======================================================


servers:{


    arin:
    "https://rdap.arin.net/registry",


    ripe:
    "https://rdap.db.ripe.net",


    apnic:
    "https://rdap.apnic.net",


    lacnic:
    "https://rdap.lacnic.net/rdap",


    afrinic:
    "https://rdap.afrinic.net/rdap"


},





// ======================================================
// Detect IP
// ======================================================


isIP(value){


    return (

        /^(\d{1,3}\.){3}\d{1,3}$/
        .test(value)

        ||

        value.includes(":")

    );


},







// ======================================================
// IP Lookup
// ======================================================


async ipLookup(ip){



    const endpoints = [


        `${this.servers.arin}/ip/${ip}`,

        `${this.servers.ripe}/ip/${ip}`,

        `${this.servers.apnic}/ip/${ip}`,

        `${this.servers.lacnic}/ip/${ip}`


    ];




    for(
        const url of endpoints
    ){


        try{


            const response =
            await fetch(url);



            if(
                response.ok
            ){


                return await response.json();


            }


        }

        catch{

            continue;

        }


    }




    return null;


},







// ======================================================
// Domain Lookup
// ======================================================


async domainLookup(domain){



    try{


        const response =
        await fetch(

            `https://rdap.org/domain/${domain}`

        );



        if(
            response.ok
        ){

            return await response.json();

        }



    }

    catch(error){


        console.error(
            "RDAP Error:",
            error
        );


    }



    return null;


},







// ======================================================
// Extract Events
// ======================================================


getEvent(data,type){


    if(
        !data?.events
    )
        return "-";



    const event =
    data.events.find(
        e =>
        e.eventAction === type
    );



    return event
        ? event.eventDate
        : "-";


},







// ======================================================
// Extract Entities
// ======================================================


getOrganization(data){


    if(
        !data?.entities
    )
        return "-";



    for(
        const entity of data.entities
    ){


        if(
            entity.vcardArray
        ){


            const name =
            entity.vcardArray[1]
            .find(
                x =>
                x[0] === "fn"
            );



            if(name){

                return name[3];

            }


        }


    }



    return "-";


},







// ======================================================
// Nameservers
// ======================================================


getNameservers(data){



    if(
        !data?.nameservers
    )
        return [];



    return data.nameservers.map(
        ns =>
        ns.ldhName
    );


},







// ======================================================
// Analyze
// ======================================================


async analyze(value){



    let data;



    if(
        this.isIP(value)
    ){


        data =
        await this.ipLookup(
            value
        );


    }

    else{


        data =
        await this.domainLookup(
            value
        );


    }





    if(!data){


        return {

            success:false,

            message:
            "No RDAP information found."

        };


    }






    return {


        success:true,


        handle:

        data.handle || "-",


        name:

        data.name || "-",



        organization:

        this.getOrganization(
            data
        ),



        created:

        this.getEvent(
            data,
            "registration"
        ),



        updated:

        this.getEvent(
            data,
            "last changed"
        ),



        expires:

        this.getEvent(
            data,
            "expiration"
        ),



        nameservers:

        this.getNameservers(
            data
        ),



        raw:data



    };





}





};





console.log(

"%cWhoISThis WHOIS Engine Loaded",

"color:#00d4ff;font-weight:bold;"

);
