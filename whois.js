/*
==========================================================
WhoISThis

whois.js v2

WHOIS / RDAP Intelligence Engine

Supports:
- Domains
- IPv4
- IPv6

==========================================================
*/


window.WhoISThisWHOIS = {





// ======================================================
// RDAP Endpoints
// ======================================================


servers:[

"https://rdap.org",

"https://rdap.arin.net/registry",

"https://rdap.db.ripe.net",

"https://rdap.apnic.net",

"https://rdap.lacnic.net/rdap",

"https://rdap.afrinic.net/rdap"

],







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
// Fetch RDAP
// ======================================================


async fetchRDAP(url){


    try{


        const response =
        await fetch(url);



        if(
            response.ok
        ){


            return await response.json();


        }


    }

    catch(error){


        console.warn(
            "RDAP failed:",
            url
        );


    }


    return null;


},







// ======================================================
// Domain Lookup
// ======================================================


async domainLookup(domain){


    return await this.fetchRDAP(

        `https://rdap.org/domain/${domain}`

    );


},







// ======================================================
// IP Lookup
// ======================================================


async ipLookup(ip){



    const urls=[


        `https://rdap.arin.net/registry/ip/${ip}`,

        `https://rdap.db.ripe.net/ip/${ip}`,

        `https://rdap.apnic.net/ip/${ip}`,

        `https://rdap.lacnic.net/rdap/ip/${ip}`


    ];




    for(
        const url of urls
    ){


        const data =
        await this.fetchRDAP(
            url
        );



        if(data)
            return data;


    }




    return null;


},







// ======================================================
// Events
// ======================================================


event(data,type){


    if(
        !data?.events
    )
        return "-";



    const found =
    data.events.find(
        e =>
        e.eventAction
        ?.toLowerCase()
        .includes(
            type
        )
    );



    return found
    ?
    found.eventDate
    :
    "-";



},







// ======================================================
// Organization
// ======================================================


organization(data){



    if(
        !data.entities
    )
        return "-";




    for(
        const entity of data.entities
    ){


        const vcard =
        entity.vcardArray;



        if(
            vcard
        ){


            const name =
            vcard[1]
            .find(
                x=>
                x[0]==="fn"
            );



            if(name)
                return name[3];


        }



    }




    return "-";


},







// ======================================================
// Contact Extraction
// ======================================================


contacts(data){



    let emails=[];



    if(
        !data.entities
    )
        return [];




    data.entities.forEach(entity=>{


        if(
            entity.vcardArray
        ){


            entity.vcardArray[1]
            .forEach(item=>{


                if(
                    item[0]==="email"
                ){


                    emails.push(
                        item[3]
                    );


                }


            });


        }


    });




    return [

        ...new Set(emails)

    ];



},







// ======================================================
// Nameservers
// ======================================================


nameservers(data){



    if(
        !data.nameservers
    )
        return [];



    return data.nameservers.map(
        ns=>
        ns.ldhName
    );



},







// ======================================================
// Analyze
// ======================================================


async analyze(target){



    let data;



    if(
        this.isIP(target)
    ){


        data =
        await this.ipLookup(
            target
        );


    }

    else{


        data =
        await this.domainLookup(
            target
        );


    }






    if(!data){


        return {


            success:false,


            message:
            "No RDAP information found"



        };


    }






    return {



        success:true,



        target,



        handle:
        data.handle || "-",



        name:
        data.name || "-",



        organization:
        this.organization(
            data
        ),



        registry:
        data.port43
        ||
        data.rdapConformance
        ?.join(", ")
        ||
        "-",



        cidr:
        data.cidr0_cidrs
        ?
        JSON.stringify(
            data.cidr0_cidrs
        )
        :
        "-",



        country:
        data.country
        ||
        "-",



        created:
        this.event(
            data,
            "registration"
        ),



        updated:
        this.event(
            data,
            "changed"
        ),



        expires:
        this.event(
            data,
            "expiration"
        ),



        nameservers:
        this.nameservers(
            data
        ),



        abuse:
        this.contacts(
            data
        ),



        raw:
        data



    };





}





};





console.log(

"%cWhoISThis WHOIS Engine v2 Loaded",

"color:#00d4ff;font-weight:bold;"

);
