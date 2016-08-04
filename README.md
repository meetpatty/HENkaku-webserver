# HENkaku-webserver

## Prereqs

- Windows
- IIS + asp.net 4.0
- Fiddler 4

## Webservice install

1. Add a new IIS Application Alias: **HENkaku**, Application Pool: **ASP.NET v4.0**
2. Copy contents of `HENkaku-webserver` into Application Physical directory
3. Give user `IIS AppPool\ASP.NET v4.0` full permissions to application directory
4. Set Default Document of Application to `index.html`
5. In Fiddler under `AutoResponder` add new Rule:
  ```
  regex:.*go\.henkaku\.xyz/x\?(.*)
  http://<ipaddressofhost>/henkaku/api/$1
  ```
6. Replace `<ipaddressofhost>` with ip address of machine hosting webserver
7. Enable options **Enable Rule** and **Unmatched requests passthrough**
8. Setup your vita to use the proxy created by fiddler (port `8888` by default)
9. On the target Vita browse to `http://<ipaddressofhost>/henkaku`

------------------------------------------------------------------------------------

_See **Usage.odt** for detailed instructions_
