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
Set Default Document of Application to index.html</br>
In Fiddler under AutoResponder add new Rule:</br>
</br>
regex:.*go\.henkaku\.xyz/x\?(.*)</br>
http://&lt;ipaddressofhost&gt;/henkaku/api/$1</br>
</br>
Replace &lt;ipaddressofhost&gt; with ip address of machine hosting webserver</br>
Enable options "Enable Rule" and "Unmatched requests passthrough" </br>
</br>
Setup your vita to use the proxy created by fiddler (port 8888 by default)</br>
On the target Vita browse to http://&lt;ipaddressofhost&gt;/henkaku</br>

See Usage.odt for detailed instructions
