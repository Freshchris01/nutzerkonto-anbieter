# Nutzerkonto Anbieter

Dies ist ein [Tech4Germany](https://tech4germany.org)-Projekt.

Dieses Repository ist eine beispielhafte Implementierung für einen Nutzerkonto-Anbieter (Fachverfahren, Drittanbieter, etc.), um insbesondere die Modularität des Ansatzes auf Architekturebene zu veranschaulichen.

## Architektur

![Gesamtarchitektur](/docs/architecture_complete.png)

**Modularitat**

**Sicherheit**

## Requirements
- Node.js

## Setup

### Setup [Nutzerkonto Repository](https://github.com/tech4germany/nutzerkonto)
### Setup Nutzerkonto Anbieter (dieses Repository)
- `npm install`
- eine `.env` Datei im Root-Verzeichnis dieses Projektes mit den folgenden Attributen erstellen

|Attribute|Description  | Example|
|--|--|--|
| HOST_NUTZERKONTO | base url for Mehrwertdienste of the Nutzerkonto | http://localhost:3000 |
| HOST_NUTZERKONTO_SP | base url of the service provider | http://localhost:3001 |

### Setup Keycloak als IAM-Komponente
TODO
