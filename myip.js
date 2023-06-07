class MyIpApiClient {
    constructor() {
        this._myIpApiEndPoint = 'https://api.ipify.org?format=json';
        this._ipGeolocationApiEndPoint = 'http://ip-api.com/json/';
        this._flagApiEndPoint = 'https://flagsapi.com/';

        this.flashMessagesContainer = document.querySelector('[data-flash-messages]');

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
            this.flashMessagesContainer.appendChild(this.buildMessage("danger", "ERROR", "Nepodařilo se připojit k serveru!"));
            return;
        }

        let ipData = await ipResponse.json();
        this.ip = ipData.ip;
        this.updatePanel();

        let geoInfoResponse = await fetch(this._ipGeolocationApiEndPoint + this.ip);
        if (!geoInfoResponse.ok) {
            this.flashMessagesContainer.appendChild(this.buildMessage("danger", "ERROR", "Nepodařilo se připojit k serveru!"));
            this.countryElement.style.display = "none";
            this.flagElement.style.display = "none";
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

    /**
     * Sestaví a navrátí element zprávy flash message.
     *
     * @param {string} messageType
     * @param {string} messageTitle
     * @param {string} messageText
     * @return HTMLDivElement
     */
    buildMessage(messageType, messageTitle, messageText = "") {
        let messageContainerElement = document.createElement('div');
        let messageTitleElement = document.createElement('h5');
        let messageTextElement = document.createElement('p');

        messageContainerElement.classList.add('alert');
        messageContainerElement.classList.add('alert-' + messageType);
        messageTitleElement.classList.add('m-0')
        messageTextElement.classList.add('m-0')

        messageContainerElement.setAttribute('role', 'alert');

        messageTitleElement.innerText = messageTitle;
        messageTextElement.innerText = messageText;

        messageContainerElement.appendChild(messageTitleElement);
        messageText && messageContainerElement.appendChild(messageTextElement);

        return messageContainerElement;
    }

}

window.myIp = new MyIpApiClient();
