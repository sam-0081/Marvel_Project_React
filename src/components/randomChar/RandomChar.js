import {useState, useEffect} from 'react';
import useMarvelService from '../../services/MarvelService';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import Spinner from "../spinner/Spiner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const RandomChar = () => {

    const [char, setChar] = useState(null);


    const {loading, error, clearError, getCharacter} = useMarvelService();


    useEffect(() => {
        updateChar()
        const timerId = setInterval(updateChar, 60000);

        return () => {
            clearInterval(timerId)
        }
    }, [])

    const onCharLoaded = (char) => {
        setChar(char)
    }


    const updateChar = () => {
        clearError()
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id)
            .then(onCharLoaded)
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({char}) => {
    // if (!char) {
    //     return null; // или вернуть некоторое заполнительное содержимое
    // }
    const {name, description, thumbnail, homepage, wiki} = char;

    const clazz = thumbnail.includes('image_not_available') ? 'randomchar__img randomchar__img__notavailable' : 'randomchar__img';
    const characterDescription = description ? (description.length > 200 ? description.slice(0, 200) + '...' : description) : 'There is no description for this character';
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className={clazz}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {characterDescription}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}
export default RandomChar;