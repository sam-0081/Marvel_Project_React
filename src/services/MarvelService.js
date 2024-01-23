import md5 from 'md5';
import {useHttp} from "../hooks/http.hook";

const useMarvelService =()=>{

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=f082f7c5ad1632759475034c6d389144';
    const _baseOffset = 210;

    const ts = new Date().getTime();
    const privateKey = 'f0c4ece9e4cd950ae6ff5207e7a3c04d5a25ea33';
    const publicKey = 'f082f7c5ad1632759475034c6d389144';
    const hash = md5(ts + privateKey + publicKey);

    const {loading,request,error, clearError}=useHttp();

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        try {

            const res = await request(`${_apiBase}characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`);

            return _transformCharacter(res.data.results[0]);
        } catch (e) {
            console.log('ошибка: ' + e)
        }
    }

    const _transformCharacter = (char) => {
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

    const getAllComics = async (offset = 210) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description,
            thumbnail: comics.thumbnail.path.replace('http://', 'https://') + '.' + comics.thumbnail.extension,
            price: comics.prices[0].price,
            pageCount: comics.pageCount,
            language: comics.textObjects.language,
            text: comics.textObjects.text
        }
    }



    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic}
}

export default useMarvelService;