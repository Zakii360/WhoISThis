/*
==========================================================
WhoISThis

dns.js v2

DNS Intelligence Engine

Uses DNS-over-HTTPS

Supports:
A
AAAA
MX
TXT
NS
CNAME
SOA

==========================================================
*/


window.WhoISThisDNS = {





resolver:
"https://cloudflare-dns.com/dns-query",







// ======================================================
// Query DNS
// ======================================================


async query(domain,type){



    try{


        const response =
        await fetch(

            `${this.resolver}?name=${encodeURIComponent(domain)}&type=${type}`,

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
            "DNS query error:",
            error
        );


        return [];


    }



},







// ======================================================
// Clean DNS values
// ======================================================


clean(records,type){



    return records.map(record=>{


        let value =
        record.data;



        // Remove quotes from TXT

        if(type==="TXT"){


            value =
            value
            .replaceAll(
                '"',
                ""
            );


        }



        return {


            name:
            record.name,


            type:
            type,


            value:value,


            ttl:
            record.TTL



        };


    });



},







// ======================================================
// MX Sorting
// ======================================================


cleanMX(records){



    return records

    .map(record=>{


        const parts =
        record.data.split(
            " "
        );



        return {


            priority:
            parts[0],


            server:
            parts[1]



        };


    })


    .sort(
        (a,b)=>
        a.priority-b.priority
    );



},







// ======================================================
// Full Domain Analysis
// ======================================================


async analyze(domain){



    const [

        A,

        AAAA,

        MX,

        TXT,

        NS,

        CNAME,

        SOA


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
        ),



        this.query(
            domain,
            "SOA"
        )



    ]);






    const result = {




        domain,



        records:{


            A:
            this.clean(
                A,
                "A"
            ),



            AAAA:
            this.clean(
                AAAA,
                "AAAA"
            ),



            MX:
            this.cleanMX(
                MX
            ),



            TXT:
            this.clean(
                TXT,
                "TXT"
            ),



            NS:
            this.clean(
                NS,
                "NS"
            ),



            CNAME:
            this.clean(
                CNAME,
                "CNAME"
            ),



            SOA:
            this.clean(
                SOA,
                "SOA"
            )


        },





        summary:{


            ipv4:
            A.length,


            ipv6:
            AAAA.length,


            mailServers:
            MX.length,


            txtRecords:
            TXT.length,


            nameservers:
            NS.length,


            aliases:
            CNAME.length



        }



    };






    return result;



}






};





console.log(

"%cWhoISThis DNS Engine v2 Loaded",

"color:#00d4ff;font-weight:bold;"

);
