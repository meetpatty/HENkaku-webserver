# HENkaku-webserver

## Prereqs for Nodejs webservice

- Nodejs (Tested with v4.4.7 LTS)
- Request and Express (install using npm)

## Running Nodejs webservice

1. Edit HENkaku-webservice.js. Change line 10 to `var localUrl = "http://<ipaddressofhost>/henkaku.bin";` replace `<ipaddressofhost>` with host IP.
2. Run the following command from the command line/terminal `node HENkaku-webservice.js`
3. On the target Vita browse to `http://<ipaddressofhost>`

## Limitations

1. Currently does not handle requests for molecule package contents which go to henkaku.xyz, so not an offline solution when running henkaku on your vita for the first time.

## Acknowledgements

Team Molecule - For making this possible.

------------------------------------------------------------------------------------
