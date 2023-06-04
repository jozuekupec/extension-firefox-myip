class MyIpApiClient {
    constructor() {
        this._myIpApiEndPoint = 'https://api.ipify.org?format=json';
        this._ipGeolocationApiEndPoint = 'http://ip-api.com/json/';
        this._flagApiEndPoint = 'https://flagsapi.com/';

        this.ipElement = document.querySelector('[data-ip]');
        this.countryElement = document.querySelector('[data-country]');
        this.flagElement = document.querySelector('[data-flag]');
        this.ispElement = document.querySelector('[data-isp]');

        this.ip = '';
        this.country = '';
        this.countryCode = '';
        this.isp = '';

        this.reload();
    }

    async reload() {
        let ipResponse = await fetch(this._myIpApiEndPoint);
        if (!ipResponse.ok) {
            alert("Nepodařilo se připojit k serveru!");
            return;
        }

        let ipData = await ipResponse.json();
        this.ip = ipData.ip;

        let geoInfoResponse = await fetch(this._ipGeolocationApiEndPoint + this.ip);
        if (!geoInfoResponse.ok) {
            alert("Nepodařilo se připojit k serveru!");
            return;
        }

        let geoData = await geoInfoResponse.json();
        this.country = geoData.country;
        this.countryCode = geoData.countryCode;
        this.isp = geoData.isp;

        this.updatePanel();
    }

    /**
     * Aktualizuje zobrazovaný panel rozšíření.
     */
    updatePanel() {
        this.ipElement.innerText = this.ip;
        this.countryElement.innerText = this.country;
        this.flagElement.src = this.getFlagImageSource(this.countryCode);
        this.ispElement.innerText = this.isp;
    }

    /**
     * <p>Navrací url adresu obrázku vlajky.</p>
     * <p><em>Obrázek může být buď typu <code>flat</code> nebo <code>shiny</code>.</em></p>
     *
     * @param {string} cc 2 písmenný kód země dle ISO 3166-1 alpha-2.
     * @returns {string}
     */
    getFlagImageSource(cc) {
        return this._flagApiEndPoint + cc + '/flat/64.png'
    }

}

window.myIp = new MyIpApiClient();
