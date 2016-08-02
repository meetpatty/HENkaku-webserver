# HENkaku-webserver

Prereqs:

Windows
IIS + asp.net 4.0
Fiddler 4

Add a new IIS Application Alias: HENkaku, Application Pool: ASP.NET v4.0
Copy contents of HENkaku-webserver into Application Physical directory
Give user "IIS AppPool\ASP.NET v4.0" full permissions to application directory
Copy index.html and payload.js from go.henkaku.xyz to application directory
Set Default Document of Application to index.html
Generate base_payload.bin and offsets.txt using https://github.com/meetpatty/HENkaku-payload-generator

In Fiddler under AutoResponder add new Rule:

regex:.*go\.henkaku\.xyz/x\?(.*)
http://<ipaddressofhost>/henkaku/api/$1

Replace <ipaddressofhost> with ip address of machine hosting webserver
Enable options "Enable Rule" and "Unmatched requests passthrough" 

On the target Vita browse to http://<ipaddressofhost>/henkaku
