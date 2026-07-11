/*
==========================================================
WhoISThis

script.js

Main Dashboard Controller

Supports:
- IP
- Domain
- MAC

==========================================================
*/


const input =
document.getElementById("ipInput");


const button =
document.getElementById("analyzeBtn");


const results =
document.getElementById("results");






// ======================================================
// UI Helpers
// ======================================================


function set(id,value){


    const el =
    document.getElementById(id);


    if(el){

        el.textContent =
        value ?? "-";

    }


}





function addSummary(text){


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


    list.appendChild(
        item
    );


}





function clearUI(){


    document
    .querySelectorAll(
        "strong"
    )
    .forEach(el=>{


        if(
            el.id !== "status"
        ){

            el.textContent="-";

        }


    });



    const list =
    document.getElementById(
        "summaryList"
    );


    if(list)
        list.innerHTML="";


}









// ======================================================
// IP Intelligence
// ======================================================


async function analyzeIP(ip){



    const response =
    await fetch(
        `https://ipwho.is/${ip}`
    );


    const data =
    await response.json();



    if(!data.success)
        throw new Error(
            "IP lookup failed"
        );





    set(
        "ip",
        data.ip
    );


    set(
        "version",
        data.type
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
        `Located in ${data.city}, ${data.country}`
    );


    addSummary(
        `Network: ${data.connection?.isp}`
    );



    // WHOIS / RDAP

    const whois =
    await WhoISThisWHOIS.analyze(ip);



    if(whois.success){


        set(
            "whoisOrg",
            whois.organization
        );


        set(
            "created",
            whois.created
        );


        set(
            "updated",
            whois.updated
        );


        set(
            "expires",
            whois.expires
        );


    }



}









// ======================================================
// Domain Intelligence
// ======================================================


async function analyzeDomain(domain){



    set(
        "ip",
        domain
    );


    set(
        "version",
        "DOMAIN"
    );



    addSummary(
        `Website analysis: ${domain}`
    );






    const dns =
    await WhoISThisDNS.analyze(
        domain
    );




    set(
        "aRecords",
        dns.records.A
        .map(
            x=>x.value
        )
        .join(", ")
    );



    set(
        "aaaaRecords",
        dns.records.AAAA
        .map(
            x=>x.value
        )
        .join(", ")
    );



    set(
        "mxRecords",
        dns.records.MX
        .map(
            x=>x.value
        )
        .join(", ")
    );



    set(
        "nameservers",
        dns.records.NS
        .map(
            x=>x.value
        )
        .join(", ")
    );



    addSummary(
        `${dns.summary.ipv4} IPv4 DNS records found`
    );





    const whois =
    await WhoISThisWHOIS.analyze(
        domain
    );



    if(whois.success){


        set(
            "whoisOrg",
            whois.organization
        );


        set(
            "created",
            whois.created
        );


        set(
            "updated",
            whois.updated
        );


        set(
            "expires",
            whois.expires
        );


        addSummary(
            `Owner: ${whois.organization}`
        );


    }




    set(
        "confidence",
        "🟢 DNS Verified"
    );



}









// ======================================================
// MAC Intelligence
// ======================================================


async function analyzeMAC(mac){



    set(
        "ip",
        mac
    );


    set(
        "version",
        "MAC"
    );




    const data =
    await WhoISThisMAC.analyze(
        mac
    );



    if(!data.success)
        throw new Error(
            data.error
        );




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



    addSummary(
        `Manufacturer: ${data.vendor}`
    );


    addSummary(
        `Hardware class: ${data.type}`
    );



    set(
        "confidence",
        "🟡 OUI Match"
    );


}









// ======================================================
// Main Analyze
// ======================================================


async function analyze(){



    const value =
    input.value.trim();



    if(!value)
        return;




    clearUI();



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



        addSummary(
            `Detected type: ${type}`
        );





        if(
            type==="IPv4" ||
            type==="IPv6"
        ){


            await analyzeIP(
                clean
            );


        }


        else if(
            type==="DOMAIN"
        ){


            await analyzeDomain(
                clean
            );


        }


        else if(
            type==="MAC"
        ){


            await analyzeMAC(
                clean
            );


        }


        else{


            throw new Error(
                "Unsupported input"
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


button.onclick =
analyze;




input.onkeydown =
(e)=>{


    if(
        e.key==="Enter"
    ){

        analyze();

    }


};





document
.querySelectorAll(
    ".example"
)
.forEach(btn=>{


    btn.onclick =
    ()=>{


        input.value =
        btn.textContent.trim();


        analyze();


    };


});





console.log(
"%cWhoISThis Ready",
"color:#00d4ff;font-size:18px;font-weight:bold;"
);
