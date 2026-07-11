/*
==========================================================
WhoISThis
database.js

Local intelligence databases

Contains public classification metadata.
==========================================================
*/


window.WhoISThisDB = {



version:"1.0.0",



updated:"2026-07-11",





// ======================================================
// Country Intelligence
// ======================================================


countries:{


"US":{

name:"United States",

continent:"North America",

currency:"USD",

languages:[
"English"
],

internetTLD:".us",

emergency:"911"

},



"GB":{

name:"United Kingdom",

continent:"Europe",

currency:"GBP",

languages:[
"English"
],

internetTLD:".uk",

emergency:"999 / 112"

},



"CA":{

name:"Canada",

continent:"North America",

currency:"CAD",

languages:[
"English",
"French"
],

internetTLD:".ca",

emergency:"911"

},



"DE":{

name:"Germany",

continent:"Europe",

currency:"EUR",

languages:[
"German"
],

internetTLD:".de",

emergency:"112"

},



"FR":{

name:"France",

continent:"Europe",

currency:"EUR",

languages:[
"French"
],

internetTLD:".fr",

emergency:"112"

},



"JP":{

name:"Japan",

continent:"Asia",

currency:"JPY",

languages:[
"Japanese"
],

internetTLD:".jp",

emergency:"110 / 119"

},



"AU":{

name:"Australia",

continent:"Oceania",

currency:"AUD",

languages:[
"English"
],

internetTLD:".au",

emergency:"000"

}



},







// ======================================================
// Cloud Provider Fingerprints
// ======================================================


cloudProviders:{



"Google":{

domains:[
"googleusercontent.com",
"google.com"
],

keywords:[
"Google",
"Google LLC"
]

},



"Cloudflare":{

domains:[
"cloudflare.com"
],

keywords:[
"Cloudflare",
"CF"
]

},



"Amazon AWS":{

domains:[

"amazonaws.com"

],

keywords:[

"Amazon",
"AWS"

]

},



"Microsoft Azure":{

domains:[

"azure.com"

],

keywords:[

"Microsoft",
"Azure"

]

},



"DigitalOcean":{

domains:[

"digitalocean.com"

],

keywords:[

"DigitalOcean"

]

}



},







// ======================================================
// Known Public DNS
// ======================================================


publicDNS:{


"8.8.8.8":{

provider:"Google Public DNS",

organization:"Google LLC",

asn:"AS15169"

},



"8.8.4.4":{

provider:"Google Public DNS",

organization:"Google LLC",

asn:"AS15169"

},



"1.1.1.1":{

provider:"Cloudflare DNS",

organization:"Cloudflare Inc",

asn:"AS13335"

},



"1.0.0.1":{

provider:"Cloudflare DNS",

organization:"Cloudflare Inc",

asn:"AS13335"

},



"208.67.222.222":{

provider:"OpenDNS",

organization:"Cisco",

asn:"AS36692"

}



},







// ======================================================
// Internet Registries
// ======================================================


registries:{



ARIN:{

region:"North America",

website:"https://arin.net"

},



RIPE:{

region:"Europe",

website:"https://ripe.net"

},



APNIC:{

region:"Asia Pacific",

website:"https://apnic.net"

},



LACNIC:{

region:"Latin America",

website:"https://lacnic.net"

},



AFRINIC:{

region:"Africa",

website:"https://afrinic.net"

}



},







// ======================================================
// Security Labels
// ======================================================


securityLabels:{



vpn:"Possible VPN or anonymizer",

proxy:"Proxy service detected",

tor:"Tor exit node",

hosting:"Datacenter or cloud hosting"



}





};




console.log(

"%cWhoISThis Database Loaded",

"color:#00d4ff;font-weight:bold;"

);
