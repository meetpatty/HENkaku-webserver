# HENkaku-webserver

Prereqs:</br>
</br>
Windows</br>
IIS + asp.net 4.0</br>
Fiddler 4</br>
</br>
Add a new IIS Application Alias: HENkaku, Application Pool: ASP.NET v4.0</br>
Copy contents of HENkaku-webserver into Application Physical directory</br>
Give user "IIS AppPool\ASP.NET v4.0" full permissions to application directory</br>
Copy index.html and payload.js from go.henkaku.xyz to application directory</br>
Set Default Document of Application to index.html</br>
Generate base_payload.bin and offsets.txt using https://github.com/meetpatty/HENkaku-payload-generator</br>
</br>
In Fiddler under AutoResponder add new Rule:</br>
</br>
regex:.*go\.henkaku\.xyz/x\?(.*)</br>
http://<ipaddressofhost>/henkaku/api/$1</br>
</br>
Replace <ipaddressofhost> with ip address of machine hosting webserver</br>
Enable options "Enable Rule" and "Unmatched requests passthrough" </br>
</br>
On the target Vita browse to http://&lt;ipaddressofhost&gt;/henkaku</br>

See Usage.odt for detailed instructions
