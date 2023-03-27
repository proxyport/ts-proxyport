# Proxy Port SDK
`@proxyport/proxyport` Node.js package provides interfaces to the <a href="https://proxy-port.com/en/scraping-proxy" target="_blank">Proxy Port</a> API.
## Prerequisites
To use this package you will need a free API key. Get your AIP key <a href="https://account.proxy-port.com/scraping" target="_blank">here</a>.
Detailed instructions <a href="https://proxy-port.com/en/scraping-proxy/getting-started" target="_blank">here</a>.
## Installation
Install via <a href="https://www.npmjs.com" target="_blank">npm</a>:
```shell
$ npm i @proxyport/proxyport
```
## Getting Started
Before you get your first proxy, you need to assign an <a href="https://account.proxy-port.com/scraping" target="_blank">API key</a>.
```typescript
import { ProxyPort } from '@proxyport/proxyport';

let proxyPort = new ProxyPort(<API_KEY>);

(async () => {
    let proxy = await proxyPort.getProxy();
    console.log(proxy);
})();

```
