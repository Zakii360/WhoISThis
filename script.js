/*
==========================================================
WhoISThis

script.js v3

Universal Intelligence Renderer

==========================================================
*/


const input =
document.getElementById("ipInput");


const button =
document.getElementById("analyzeBtn");


const results =
document.getElementById("results");





// ======================================================
// UI Functions
// ======================================================


function set(id,value){

    const el =
    document.getElementById(id);


    if(el){

        el.textContent =
        value || "-";

    }

}





function summary(text){

    const list =
    document.getElementById(
        "summaryList"
    );


    if(!list)
        return;



    const item =
    document.createElement(
        "li"
    );


    item.textContent =
    "• " + text;


    list.appendChild(item);

}





function clear(){

    document
    .querySelectorAll(
        "strong"
    )
    .forEach(el=>{

        el.textContent="-";

    });



    document
    .getElementById(
        "summaryList"
    )
    .innerHTML="";

}







// ======================================================
// IP Engine
// ======================================================


async function getIPData(ip){



    const response =
    await fetch(
        `https://ipwho.is/${ip}`
    );



    const data =
    await response.json();



    if(!data.success)
        throw new Error(
            "Invalid IP"
        );



    return {


        type:"IP",


        target:data.ip,


        location:data,


        network:data.connection,


        security:data.security || {}



    };

}





// ======================================================
// Domain Engine
// ======================================================


async function getDomainData(domain){



    summary(
        "Resolving domain intelligence..."
    );



    const dns =
    await WhoISThisDNS.analyze(
        domain
    );



    const ips =
    dns.records.A
    .map(
        x=>x.value
    );




    let ipData=null;



    if(ips.length){


        try{


            ipData =
            await getIPData(
                ips[0]
            );


        }

        catch{}

    }






    const whois =
    await WhoISThisWHOIS.analyze(
        domain
    );




    const ssl =
    await WhoISThisSSL.analyze(
        domain
    );






    return {


        type:"DOMAIN",


        target:domain,


        dns,


        whois,


        ssl,


        ipData



    };

}







// ======================================================
// MAC Engine
// ======================================================


async function getMACData(mac){


    const data =
    await WhoISThisMAC.analyze(
        mac
    );


    if(!data.success)
        throw new Error(
            "Invalid MAC"
        );



    return {


        type:"MAC",


        mac:data


    };


}








// ======================================================
// Render Common Data
// ======================================================


function renderIP(data){



    const ip =
    data.location;



    set(
        "ip",
        ip.ip
    );


    set(
        "version",
        ip.type
    );


    set(
        "country",
        ip.country
    );


    set(
        "region",
        ip.region
    );


    set(
        "city",
        ip.city
    );



    set(
        "isp",
        data.network?.isp
    );


    set(
        "org",
        data.network?.org
    );


    set(
        "asn",
        data.network?.asn
    );


    set(
        "domain",
        data.network?.domain
    );



    set(
        "lat",
        ip.latitude
    );


    set(
        "lon",
        ip.longitude
    );


    set(
        "timezone",
        ip.timezone?.id
    );



    set(
        "vpn",
        data.security.vpn
        ? "Yes"
        : "No"
    );


    set(
        "proxy",
        data.security.proxy
        ? "Yes"
        : "No"
    );


    set(
        "tor",
        data.security.tor
        ? "Yes"
        : "No"
    );


    set(
        "hosting",
        data.security.hosting
        ? "Yes"
        : "No"
    );



    summary(
        `ISP: ${data.network?.isp}`
    );


    summary(
        `ASN: ${data.network?.asn}`
    );



}









function renderDNS(dns){


    set(
        "aRecords",
        dns.records.A
        .map(x=>x.value)
        .join(", ")
    );


    set(
        "aaaaRecords",
        dns.records.AAAA
        .map(x=>x.value)
        .join(", ")
    );


    set(
        "mxRecords",
        dns.records.MX
        .map(x=>x.value)
        .join(", ")
    );


    set(
        "txtRecords",
        dns.records.TXT
        .map(x=>x.value)
        .join(", ")
    );


    set(
        "nameservers",
        dns.records.NS
        .map(x=>x.value)
        .join(", ")
    );


}








function renderWHOIS(data){


    if(!data?.success)
        return;



    set(
        "whoisOrg",
        data.organization
    );


    set(
        "created",
        data.created
    );


    set(
        "updated",
        data.updated
    );


    set(
        "expires",
        data.expires
    );


    set(
        "whoisNS",
        data.nameservers
        ?.join(", ")
    );


}








function renderSSL(data){


    if(!data?.success)
        return;



    set(
        "sslIssuer",
        data.issuer
    );


    set(
        "sslCount",
        data.certificates
    );


    set(
        "sslFirst",
        data.firstSeen
    );


    set(
        "sslLatest",
        data.latestSeen
    );



}








function renderMAC(data){



    set(
        "macVendor",
        data.vendor
    );


    set(
        "macOui",
        data.oui
    );


    set(
        "macType",
        data.type
    );


    set(
        "macAssignment",
        data.assignment
    );



}









// ======================================================
// Main Analyzer
// ======================================================


async function analyze(){



    const value =
    input.value.trim();



    if(!value)
        return;



    clear();



    results.classList.remove(
        "hidden"
    );



    set(
        "status",
        "Analyzing..."
    );



    try{


        const type =
        WhoISThisIntel.detect(
            value
        );



        const clean =
        WhoISThisIntel.normalize(
            value,
            type
        );



        summary(
            `Detected ${type}`
        );






        if(
            type==="IPv4" ||
            type==="IPv6"
        ){


            const data =
            await getIPData(
                clean
            );


            renderIP(data);


        }







        else if(
            type==="DOMAIN"
        ){


            const data =
            await getDomainData(
                clean
            );



            if(data.ipData){

                renderIP(
                    data.ipData
                );

            }


            renderDNS(
                data.dns
            );


            renderWHOIS(
                data.whois
            );


            renderSSL(
                data.ssl
            );


        }








        else if(
            type==="MAC"
        ){


            const data =
            await getMACData(
                clean
            );


            renderMAC(
                data.mac
            );


        }



        else{


            throw new Error(
                "Unknown input"
            );


        }





        set(
            "confidence",
            "🟢 Public Data Verified"
        );


        set(
            "status",
            "Complete"
        );


    }



    catch(error){



        console.error(
            error
        );


        set(
            "status",
            "Failed"
        );


        summary(
            error.message
        );



    }



}









// ======================================================
// Events
// ======================================================


button.onclick =
analyze;



input.onkeydown =
e=>{


    if(e.key==="Enter")
        analyze();


};



document
.querySelectorAll(".example")
.forEach(btn=>{


    btn.onclick =
    ()=>{


        input.value =
        btn.textContent;


        analyze();


    };


});





console.log(
"%cWhoISThis v3 Online",
"color:#00d4ff;font-size:18px;font-weight:bold;"
);
