import { get as httpGet } from 'https';

export class ProxyPort {
    private newProxies: Array<string> = [];
    private knownProxies: Map<string, Boolean> = new Map();
    private lastApiCall: Date | null = null;

    private options = {
        host: 'api.proxy-port.com',
        path: '/scraping-proxy',
        headers: {
            'X-API-KEY': ''
        },
    };

    constructor(apiKey: string) {
        this.options.headers = {"X-API-KEY": apiKey};
    }

    public async getProxy(): Promise<string> {
        let proxy = this.newProxies.pop();
        if (!proxy) {
            await this.fetchProxies();
            proxy = this.newProxies.pop();
        }
        if (!proxy) {
            let knownList = Array.from(this.knownProxies.keys());
            proxy = knownList[Math.floor(Math.random() * knownList.length)];
        } else {
            this.knownProxies.set(proxy, true);
        }
        return proxy || "";
    }

    private async fetchProxies() {
        let now = new Date();
        if (this.lastApiCall && (Number(now) - Number(this.lastApiCall) < 30000)) return;
        try {
            let body = await this.fetch();
            JSON.parse(body).data.forEach((proxy: string) => {
                if (!this.knownProxies.get(proxy)) {
                    this.newProxies.push(proxy);
                    this.knownProxies.set(proxy, true);
                }
            });
        } catch (e) {
            console.log('Error on JSON.parse(this.fetch())', e);
        }
        this.lastApiCall = now;
    }

    private async fetch(): Promise<string> {
        return new Promise((resolve, reject) => {
            const request = httpGet(this.options, (res: any) => {
                if (res.statusCode < 200 || res.statusCode > 299) {
                    return reject(new Error(`HTTP status code ${res.statusCode}`))
                }

                const body: Array<any> = []
                res.on('data', (chunk: any) => body.push(chunk))
                res.on('end', () => {
                    const resString = Buffer.concat(body).toString()
                    resolve(resString)
                })
            })

            request.on('error', (err) => {
                reject(err)
            })
            request.on('timeout', () => {
                request.destroy()
                reject(new Error('timed out'))
            })
        })
    }
}
