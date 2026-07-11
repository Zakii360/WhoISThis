/*
==========================================================
WhoISThis

Multi Intelligence Controller

Supports:
- IP
- Domain
- MAC

==========================================================
*/


const input =
document.getElementById(
    "ipInput"
);


const button =
document.getElementById(
    "analyzeBtn"
);


const results =
document.getElementById(
    "results"
);





// ======================================================
// Helpers
// ======================================================


function set(id,value){


    const el =
    document.getElementById(id);


    if(el){

        el.textContent =
        value ?? "-";

    }


}



function clearSummary(){


    const list =
    document.getElementById(
        "summaryList"
    );


    if(list){

        list.innerHTML="";

    }


}



function addSummary(text){


    const list =
    document.getElementById(
        "summaryList"
    );


    if(!list)
        return;


    const li =
    document.createElement(
        "li"
    );


    li.textContent =
    "• " + text;


    list.appendChild(
        li
    );


}







// ======================================================
// IP Analyzer
// ======================================================


async function analyzeIP(ip){



    const response =
    await fetch(
        `https://ipwho.is/${ip}`
    );


    const data =
    await response.json();



    if(!data.success){

        throw new Error(
            "IP lookup failed"
        );

    }





    set(
        "ip",
        data.ip
    );


    set(
        "version",
        data.type || "IP"
    );


    set(
        "country",
        data.country
    );


    set(
        "region",
        data.region
    );


    set(
        "city",
        data.city
    );



    set(
        "isp",
        data.connection?.isp
    );


    set(
        "org",
        data.connection?.org
    );


    set(
        "asn",
        data.connection?.asn
    );


    set(
        "domain",
        data.connection?.domain
    );



    set(
        "lat",
        data.latitude
    );


    set(
        "lon",
        data.longitude
    );


    set(
        "timezone",
        data.timezone?.id
    );



    const security =
    data.security || {};



    set(
        "vpn",
        security.vpn ? "Yes":"No"
    );


    set(
        "proxy",
        security.proxy ? "Yes":"No"
    );


    set(
        "tor",
        security.tor ? "Yes":"No"
    );


    set(
        "hosting",
        security.hosting ? "Yes":"No"
    );




    set(
        "confidence",
        "🟢 Verified"
    );



    addSummary(
        `IP located in ${data.country}`
    );


    if(data.connection?.isp){

        addSummary(
            `Network provider: ${data.connection.isp}`
        );

    }


    if(security.hosting){

        addSummary(
            "This appears to be a hosting/datacenter network."
        );

    }


}









// ======================================================
// Domain Analyzer
// ======================================================


async function analyzeDomain(domain){



    set(
        "ip",
        domain
    );


    set(
        "version",
        "Domain"
    );



    addSummary(
        `Analyzing website ${domain}`
    );





    const dns =
    await WhoISThisDNS.analyze(
        domain
    );



    set(
        "domain",
        domain
    );


    set(
        "aRecords",
        dns.records.A
        .map(x=>x.value)
        .join(", ")
        ||
        "-"
    );


    set(
        "aaaaRecords",
        dns.records.AAAA
        .map(x=>x.value)
        .join(", ")
        ||
        "-"
    );




    set(
        "reverseDNS",
        "-"
    );



    addSummary(
        `${dns.summary.ipv4} IPv4 records found.`
    );


    addSummary(
        `${dns.summary.nameservers} nameservers found.`
    );






    const whois =
    await WhoISThisWHOIS.analyze(
        domain
    );



    if(whois.success){


        set(
            "org",
            whois.organization
        );


        addSummary(
            `Organization: ${whois.organization}`
        );


    }




    set(
        "confidence",
        "🟢 Verified DNS"
    );



}









// ======================================================
// MAC Analyzer
// ======================================================


async function analyzeMAC(mac){



    set(
        "ip",
        mac
    );


    set(
        "version",
        "MAC Address"
    );



    const data =
    await WhoISThisMAC.analyze(
        mac
    );



    if(!data.success){

        throw new Error(
            data.error
        );

    }





    set(
        "org",
        data.vendor
    );


    set(
        "domain",
        data.oui
    );



    addSummary(
        `Manufacturer: ${data.vendor}`
    );


    addSummary(
        `Device category: ${data.type}`
    );



    addSummary(
        `Assignment: ${data.assignment}`
    );



    set(
        "confidence",
        "🟡 OUI Database"
    );



}









// ======================================================
// Main Router
// ======================================================


async function analyze(){



    const value =
    input.value.trim();



    if(!value)
        return;



    results.classList.remove(
        "hidden"
    );



    clearSummary();



    set(
        "status",
        "Analyzing..."
    );



    try{



        const type =
        WhoISThisIntel.detect(
            value
        );



        const normalized =
        WhoISThisIntel.normalize(
            value,
            type
        );



        addSummary(
            `Detected: ${type}`
        );





        if(type==="IPv4" || type==="IPv6"){


            await analyzeIP(
                normalized
            );


        }


        else if(type==="DOMAIN"){


            await analyzeDomain(
                normalized
            );


        }


        else if(type==="MAC"){


            await analyzeMAC(
                normalized
            );


        }


        else{


            throw new Error(
                "Unknown input type"
            );


        }




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


        addSummary(
            error.message
        );


    }



}








// ======================================================
// Events
// ======================================================


button.addEventListener(
    "click",
    analyze
);



input.addEventListener(
    "keydown",
    e=>{


        if(e.key==="Enter"){

            analyze();

        }


    }
);





document
.querySelectorAll(".example")
.forEach(btn=>{


    btn.addEventListener(
        "click",
        ()=>{


            input.value =
            btn.textContent.trim();


            analyze();


        }
    );


});





window.addEventListener(
    "load",
    ()=>{


        input.focus();


        console.log(
            "%cWhoISThis Online",
            "color:#00d4ff;font-size:20px;font-weight:bold;"
        );


    }
);
