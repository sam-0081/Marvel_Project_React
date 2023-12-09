import md5 from 'md5';

class MarvelService {

    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=f082f7c5ad1632759475034c6d389144';
    _baseOffset = 210;

    ts = new Date().getTime();
    privateKey = 'f0c4ece9e4cd950ae6ff5207e7a3c04d5a25ea33';
    publicKey = 'f082f7c5ad1632759475034c6d389144';
    hash = md5(this.ts + this.privateKey + this.publicKey);


    getResource = async (url) => {

        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&ts=${this.ts}&apikey=${this.publicKey}&hash=${this.hash}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        try {

            const res = await this.getResource(`${this._apiBase}characters/${id}?ts=${this.ts}&apikey=${this.publicKey}&hash=${this.hash}`);

            return this._transformCharacter(res.data.results[0]);
        } catch (e) {
            console.log('ошобка: ' + e)
        }
    }

    _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path.replace('http://', 'https://') + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService;