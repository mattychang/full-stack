// Matthew Chang
// CSDS 221: hangman game design and functions

// imports
import { menWordsList, womenWordsList, WordHint } from './List';

import React, { useState, useEffect } from 'react';
import './style.css';
import '@fortawesome/fontawesome-free/css/all.css';


// rock climbing emojis to symbolize the number of lives before fail
const totalHearts = 5;
const heartIcon = "🧗";


const Hangman: React.FC = () => {
    // state variables
    const [currentWord, setCurrentWord] = useState<string>('');                                 // the current word that is to be guessed
    const [currentHint, setCurrentHint] = useState<string>('');                                 // the hint / prompt that is given to guess the word
    const [displayedWord, setDisplayedWord] = useState<string[]>([]);                           // the word of interest
    const [usedLetters, setUsedLetters] = useState<string[]>([]);                               // the letters that have been guessed
    const [wrongGuesses, setWrongGuesses] = useState<number>(0);                                // the wrong guess (includes letters and words)
    const [inputValue, setInputValue] = useState<string>('');                                   // the input (letters and words)
    const [wordGuess, setWordGuess] = useState<string>('');                                     // state of word guess
    const [inputError, setInputError] = useState<boolean>(false);                               // entry good or bad
    const [currentWordList, setCurrentWordList] = useState<WordHint[]>(menWordsList);           // the word list 9men or women), default to menWordsList

    // effect to pick new random word when the word list changes
    useEffect(() => {
        getRandomWord();
    }, [currentWordList]);




    // functions
    // a function that gets a random word (and hint by association) from the chosen word list
    const getRandomWord = (): void => {
        const randomIndex = Math.floor(Math.random() * currentWordList.length);                 // choose random
        const selectedWord = currentWordList[randomIndex];                                      // gets word associated with random, and hence the hint
        // reset
        setCurrentWord(selectedWord.word);
        setCurrentHint(selectedWord.hint);
        setDisplayedWord(Array(selectedWord.word.length).fill('_'));
        setUsedLetters([]);
        setWrongGuesses(0);
        setInputValue('');
        setWordGuess('');
    };

    // a function that handles changes in the letter input field
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value.toUpperCase());                                            // uppercase only for simplicity
        setInputError(false);
    };

    // a function that handles changes in the word input field
    const handleWordGuessChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setWordGuess(e.target.value.toUpperCase());
        setInputError(false);
    };

    // a function that handles the letter guess submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        // orevents the default form submission behavior
        e.preventDefault();

        // checks if the input is a single letter and only a single letter, has not been used yet before, and is a valid letter (not number, other character)
        if (inputValue.length === 1 && !usedLetters.includes(inputValue) && /^[A-Z]$/i.test(inputValue)) {

            const newUsedLetters = [...usedLetters, inputValue];                                // adds the guessed letter to the used letters array
            setUsedLetters(newUsedLetters);

            // cehcks if guessed letter is in the current word
            if (currentWord.toUpperCase().includes(inputValue)) {
                // update display
                const newDisplayedWord = displayedWord.map((char, index) =>                     // update display
                    currentWord.toUpperCase()[index] === inputValue ? inputValue : char
                );
                setDisplayedWord(newDisplayedWord);
            } 
            else {
                setWrongGuesses(wrongGuesses + 1);                                              // increment wrong counter
            }
        } 
        else {
            setInputError(true);
        }
        setInputValue('');                                                                      // clears input field
    };


    // a function that handles the word guess submission
    // similar in idea to the letter guess submission but with fewer restraints
    const handleWordGuessSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        // checks if the word guess is non-empty and matches the current word
        if (wordGuess.length > 0 && wordGuess.toUpperCase() === currentWord.toUpperCase()) {
            setDisplayedWord(currentWord.split(''));
        } 
        else {
            setWrongGuesses(wrongGuesses + 1);
        }
        setWordGuess('');
    };

    // a function that handles updating the word list when men/women button is clicked
    const handleWordListChange = (wordList: WordHint[]) => {
        setCurrentWordList(wordList);
    };






    // a function that handles the help button
    // the help button reveals a correct letter in the word, but removes a life
    const handleHelp = () => {

        // safety check: if the number of wrong guesses is less than the number of lives (i.e., cannot use the help ubtton if you r dead)
        if (wrongGuesses < totalHearts) {

            // create array of letters that are not yet revealed in the displayed word
            const remainingLetters = currentWord.split('').filter((char, index) => displayedWord[index] === '_');
    
            // checks if there are any remaining letters to reveal
            // choose a random letter to reveal and add it to the used letters. increments wrong counter
            if (remainingLetters.length > 0) {
                const randomIndex = Math.floor(Math.random() * remainingLetters.length);
                const letterToReveal = remainingLetters[randomIndex].toUpperCase();
                
                const newDisplayedWord = displayedWord.map((char, index) =>
                    currentWord.toUpperCase()[index] === letterToReveal ? letterToReveal : char
                );
                setDisplayedWord(newDisplayedWord);
                setUsedLetters([...usedLetters, letterToReveal]);
                setWrongGuesses(wrongGuesses + 1);
            }
        }
    };





    
    // determines which letters are incorrect
    const incorrectLetters = usedLetters.filter(letter => !currentWord.toUpperCase().includes(letter));
    // checks if the word is guessed correctly
    const isWordComplete = !displayedWord.includes('_');

    // structure of website
    return (
        <div className = "container">

            <div className = "title">
                hangman: guess the rock climber's name
            </div>
            <div>
                enter your guess of the rock climber's name, or by letter, to win
            </div>
            <div>
                stay safe though brah, you only have five tries before you don't send
            </div>



            {/* men/women/help button */}
            <div className = "button-group">
                <button onClick={() => handleWordListChange(menWordsList)}>
                    men
                </button>
                <button onClick={() => handleWordListChange(womenWordsList)}>
                    women
                </button>
                <button onClick={handleHelp}>
                    help
                </button>
            </div>


            {/* where the "lives" are dispalyed */}
            <div className = "hangman-box">
                <div className = "hearts">
                    {[...Array(totalHearts - wrongGuesses)].map((_, index) => (
                        <span key={index} className = "heart">{heartIcon}</span>
                    ))}
                </div>
                <div className = "hint">
                    <span className = "hint-text"> {currentHint}</span>
                </div>
            </div>


            {/* displays the hint to the word, the letter placeholders, the number of incorrect guess, and the incorrect guesses
                prebuilt in that you cannot repeat letters that have already been stated (will not deduct lives from) */}
            <div className = "game-box">
                <ul className = "word-display">
                    {displayedWord.map((char, index) => (
                        <li key = {index} className = "letter">{char}</li>
                    ))}
                </ul>
                <h4>
                    incorrect guesses: 
                    <b>{wrongGuesses}</b>
                </h4>
                {incorrectLetters.length > 0 && (
                    <div className = "incorrect-letters">
                        incorrect letters: 
                        {incorrectLetters.map((letter, index) => (
                            <span key = {index} className = "incorrect-letter">{letter}</span>
                        ))}
                    </div>
                )}
                {!isWordComplete && wrongGuesses < totalHearts ? (
                    <div className = "guess-inputs">
                        <form className = "guess-input" onSubmit = {handleSubmit}>
                            <input
                                type = "text"
                                id = "letter-input"
                                value = {inputValue}
                                onChange = {handleInputChange}
                                className = {`form-control ${inputError ? 'is-invalid' : ''}`}
                                maxLength = {1}
                                autoFocus
                                placeholder = "Guess a letter"
                            />
                        </form>
                        <form className = "word-guess-input" onSubmit = {handleWordGuessSubmit}>
                            <input
                                type = "text"
                                id = "word-input"
                                value = {wordGuess}
                                onChange = {handleWordGuessChange}
                                className = {`form-control ${inputError ? 'is-invalid' : ''}`}
                                placeholder = "Guess the word"
                            />
                        </form>
                    </div>
                ) : isWordComplete ? (                                                              
                    <div className = "win-message">
                        <p>nice job, you sent! reload to play again</p>
                    </div>
                ) : (
                    <div className = "lose-message">
                        <p>you fell, you suck! reload to play again</p>
                    </div>
                )}  
            </div>
        </div>
    );
};

export default Hangman;
