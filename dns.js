/*
==========================================================
WhoISThis
dns.js

Public DNS Intelligence Engine

Uses DNS over HTTPS
==========================================================
*/


window.WhoISThisDNS = {





resolver:
"https://cloudflare-dns.com/dns-query",







// ======================================================
// DNS Query
// ======================================================


async query(domain,type){



    try{


        const response =
        await fetch(

            `${this.resolver}?name=${domain}&type=${type}`,

            {

                headers:{

                    "Accept":
                    "application/dns-json"

                }

            }

        );



        const data =
        await response.json();



        return data.Answer || [];



    }

    catch(error){


        console.error(
            "DNS Error:",
            error
        );


        return [];

    }



},







// ======================================================
// Format Results
// ======================================================


format(records){



    return records.map(
        record=>({

            name:
            record.name,

            type:
            record.type,

            value:
            record.data


        })

    );

},







// ======================================================
// Full DNS Analysis
// ======================================================


async analyze(domain){



    const [

        a,

        aaaa,

        mx,

        txt,

        ns,

        cname

    ] = await Promise.all([


        this.query(
            domain,
            "A"
        ),


        this.query(
            domain,
            "AAAA"
        ),


        this.query(
            domain,
            "MX"
        ),


        this.query(
            domain,
            "TXT"
        ),


        this.query(
            domain,
            "NS"
        ),


        this.query(
            domain,
            "CNAME"
        )



    ]);






    return {



        domain,



        records:{



            A:
            this.format(a),



            AAAA:
            this.format(aaaa),



            MX:
            this.format(mx),



            TXT:
            this.format(txt),



            NS:
            this.format(ns),



            CNAME:
            this.format(cname)



        },



        summary:{


            ipv4:
            a.length,


            ipv6:
            aaaa.length,


            mailServers:
            mx.length,


            nameservers:
            ns.length


        }





    };





}






};





console.log(

"%cWhoISThis DNS Engine Loaded",

"color:#00d4ff;font-weight:bold;"

);
