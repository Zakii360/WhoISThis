/*
==========================================================
WhoISThis

database.js

Local Intelligence Database

Contains:
- OUI vendors
- Network fingerprints
- Cloud providers
- Public DNS
- Security intelligence

==========================================================
*/


window.WhoISThisDB = {





version:
"2.0.0",



updated:
"2026-07-11",







// ======================================================
// Public DNS Intelligence
// ======================================================


publicDNS:{



"8.8.8.8":{


provider:
"Google Public DNS",


organization:
"Google LLC",


asn:
"AS15169",


category:
"Recursive DNS"

},




"8.8.4.4":{


provider:
"Google Public DNS",


organization:
"Google LLC",


asn:
"AS15169",


category:
"Recursive DNS"

},




"1.1.1.1":{


provider:
"Cloudflare DNS",


organization:
"Cloudflare Inc",


asn:
"AS13335",


category:
"Privacy DNS"

},




"1.0.0.1":{


provider:
"Cloudflare DNS",


organization:
"Cloudflare Inc",


asn:
"AS13335",


category:
"Privacy DNS"

},




"9.9.9.9":{


provider:
"Quad9",


organization:
"Quad9 Foundation",


asn:
"AS19281",


category:
"Security DNS"

},




"208.67.222.222":{


provider:
"OpenDNS",


organization:
"Cisco",


asn:
"AS36692",


category:
"Recursive DNS"

}


},







// ======================================================
// Cloud Provider Fingerprints
// ======================================================


cloudProviders:{



google:{


name:
"Google Cloud / Google LLC",


keywords:[

"Google",

"Google LLC",

"Google Cloud"

],


category:
"Cloud Provider"

},




amazon:{


name:
"Amazon AWS",


keywords:[

"Amazon",

"AWS",

"EC2"

],


category:
"Cloud Provider"

},




microsoft:{


name:
"Microsoft Azure",


keywords:[

"Microsoft",

"Azure"

],


category:
"Cloud Provider"

},




cloudflare:{


name:
"Cloudflare",


keywords:[

"Cloudflare",

"CF"

],


category:
"CDN / Security"

},




digitalocean:{


name:
"DigitalOcean",


keywords:[

"DigitalOcean"

],


category:
"Cloud VPS"

},




vultr:{


name:
"Vultr",


keywords:[

"Vultr",

"Choopa"

],


category:
"Cloud VPS"

}


},







// ======================================================
// Hosting Providers
// ======================================================


hostingProviders:{


keywords:[


"Hetzner",

"OVH",

"DigitalOcean",

"Amazon",

"Google",

"Microsoft",

"Vultr",

"Linode",

"Oracle",

"Alibaba"


],



classification:

"Datacenter / Hosting Network"



},







// ======================================================
// VPN / Proxy Indicators
// ======================================================


privacyNetworks:{


keywords:[


"NordVPN",

"ExpressVPN",

"ProtonVPN",

"Surfshark",

"Mullvad",

"Tor",

"Proxy"

],



risk:

"Anonymization Service"



},







// ======================================================
// Major ASN Intelligence
// ======================================================


asnDatabase:{



"AS15169":{


organization:
"Google LLC",


type:
"Cloud / Search / DNS"


},




"AS13335":{


organization:
"Cloudflare Inc",


type:
"CDN / Security"


},




"AS16509":{


organization:
"Amazon AWS",


type:
"Cloud Hosting"


},




"AS8075":{


organization:
"Microsoft Corporation",


type:
"Cloud / Enterprise"


},




"AS32934":{


organization:
"Meta Platforms",


type:
"Social Platform"


},




"AS54113":{


organization:
"Fastly",


type:
"CDN"

}



},







// ======================================================
// MAC Vendor Database
// ======================================================


macVendors:{



"001A2B":{


vendor:
"Cisco Systems",


device:
"Network Hardware"

},




"001B63":{


vendor:
"Apple Inc.",


device:
"Consumer Electronics"

},




"3C5AB4":{


vendor:
"Google LLC",


device:
"Smart Devices"

},




"F4F5D8":{


vendor:
"Google LLC",


device:
"Consumer Electronics"

},




"FCFBFB":{


vendor:
"Apple Inc.",


device:
"Mobile / Computer"

},




"DCFE07":{


vendor:
"Amazon Technologies",


device:
"IoT / Smart Home"

},




"005056":{


vendor:
"VMware",


device:
"Virtual Machine"

},




"525400":{


vendor:
"QEMU/KVM",


device:
"Virtual Network Interface"

}


},







// ======================================================
// Country Internet Metadata
// ======================================================


countries:{



US:{


name:
"United States",


continent:
"North America",


internet:
"ARIN"

},



GB:{


name:
"United Kingdom",


continent:
"Europe",


internet:
"RIPE"

},



DE:{


name:
"Germany",


continent:
"Europe",


internet:
"RIPE"

},



JP:{


name:
"Japan",


continent:
"Asia",


internet:
"APNIC"

},



AU:{


name:
"Australia",


continent:
"Oceania",


internet:
"APNIC"

}



},







// ======================================================
// Utility Functions
// ======================================================


findASN(asn){


return this.asnDatabase[asn]
||
null;


},




findMAC(oui){


return this.macVendors[oui]
||
null;


},




findDNS(ip){


return this.publicDNS[ip]
||
null;


}



};







console.log(

"%cWhoISThis Intelligence Database v2 Loaded",

"color:#00d4ff;font-weight:bold;"

);
