# schneidernet-tools

![example workflow](https://github.com/gipde/schneidernet-tools/actions/workflows/publish.yaml/badge.svg)

several tools

## TODO

- Colored Log
- Tests
- LINT
- Badges

## DONE

# Erfahrungen

- UMD Module werden unter einen namen exportiert, unter dem Sie dann verwendet werden können.
- https://technicallyrural.ca/2017/09/02/how-to-run-typescript-in-the-browser/

## Tooling

- VSCode: Es hilft manchmal den Typescript server oder den ESLint Server neu zu starten
- Linking von node Modulen

## Babel

    - konvertiert aktuellen ESNext Code in ältere ES Versionen
    - kann direkt TS kompilieren
    - es gibt viele Polyfills für ES Features
    - kann minifyen
    - kann nicht bundlen

## Rollup

    - ist ein Bundler
    - es gibt ein Polyfill für node.js api (proces, ...)
    - kann minify (aktuell am besten mit terser)
    - kann direkt ts kompilieren

## Modul Ohne Bundler

    - es reicht vermutlich einfach den Typescript Compiler Output zu adressieren
    - so wie es MUI macht
        - commonjs (es ist allerdings nicht klar für was das gebraucht wird)
            kein Bundler im Einsatz
            komplette Strukutr ohne Bundler unter node/
            package.json/main zeigt auf node/index.js (commonJs)
        - esm
            package.json.module verweisst auf esm struktur
            pckage.json.main verweisst auf commonjs

    - Peer Dependencies
        - hat

## Todo

    - Hauptseite für NPM Package (https://www.npmjs.com/package/@schneidernet/tools)

## Sonarqube

    # Server
    docker run --platform linux/x86_64 -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest

    # Scanner
    docker run --platform linux/x86_64 --rm -ti sonarsource/sonar-scanner-cli
    docker run \
    --rm \
    -e SONAR_HOST_URL="http://localhost:9000" \
    -e SONAR_LOGIN="myAuthenticationToken" \
    -v "${YOUR_REPO}:/usr/src" \
    sonarsource/sonar-scanner-cli
