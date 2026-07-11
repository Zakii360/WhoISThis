/*
==========================================================
WhoISThis
IP Intelligence

script.js
==========================================================
*/


const input =
    document.getElementById("ipInput");


const button =
    document.getElementById("analyzeBtn");


const results =
    document.getElementById("results");




// ========================================================
// Helpers
// ========================================================


function set(id,value){

    const element =
        document.getElementById(id);


    if(element){

        element.textContent =
            value ?? "-";

    }

}




function yesNo(value){

    return value
        ? "✓ Yes"
        : "✕ No";

}




function listSummary(items){


    const list =
        document.getElementById(
            "summaryList"
        );


    if(!list)
        return;


    list.innerHTML="";


    items.forEach(item=>{


        const li =
            document.createElement(
                "li"
            );


        li.textContent =
            "• " + item;


        list.appendChild(li);


    });


}





// ========================================================
// IP Version Detection
// ========================================================


function getIPVersion(ip){


    if(ip.includes(":")){

        return "IPv6";

    }


    return "IPv4";

}







// ========================================================
// Main Analyzer
// ========================================================


async function analyze(){



    const ip =
        input.value.trim();



    if(!ip){

        alert(
            "Enter an IP address."
        );

        return;

    }





    results.classList.remove(
        "hidden"
    );



    set(
        "status",
        "Analyzing..."
    );



    try{



        const response =
            await fetch(
                `https://ipwho.is/${ip}`
            );



        const data =
            await response.json();





        if(!data.success){


            throw new Error(
                "Invalid IP"
            );


        }






        // ================================================
        // Overview
        // ================================================



        set(
            "ip",
            data.ip
        );


        set(
            "version",
            getIPVersion(data.ip)
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







        // ================================================
        // Network
        // ================================================



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








        // ================================================
        // Location
        // ================================================



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



        if(
            data.latitude &&
            data.longitude
        ){

            set(
                "map",
                `${data.latitude}, ${data.longitude}`
            );

        }









        // ================================================
        // Security
        // ================================================


        const security =
            data.security || {};



        set(
            "vpn",
            yesNo(
                security.vpn
            )
        );


        set(
            "proxy",
            yesNo(
                security.proxy
            )
        );


        set(
            "tor",
            yesNo(
                security.tor
            )
        );


        set(
            "hosting",
            yesNo(
                security.hosting
            )
        );









        // ================================================
        // Technical
        // ================================================



        set(
            "registry",
            data.connection?.org || "-"
        );


        set(
            "cidr",
            "-"
        );


        set(
            "raw",
            "Loaded"
        );








        // ================================================
        // Intelligence
        // ================================================



        set(
            "confidence",
            "🟢 Verified"
        );


        set(
            "status",
            "Complete"
        );




        let summary=[];



        summary.push(
            `IP belongs to ${data.country}.`
        );



        if(data.region){

            summary.push(
                `Located near ${data.city}, ${data.region}.`
            );

        }



        if(data.connection?.isp){

            summary.push(
                `Network provider: ${data.connection.isp}.`
            );

        }



        if(security.hosting){

            summary.push(
                "Detected as a hosting/provider network."
            );

        }



        if(security.vpn){

            summary.push(
                "VPN usage detected."
            );

        }




        listSummary(
            summary
        );






        console.log(
            "WhoISThis Data:",
            data
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


        alert(
            "Could not analyze this IP."
        );


    }



}






// ========================================================
// Events
// ========================================================


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
