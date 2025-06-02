import * as React from "react";
import { renderToString } from 'react-dom/server';
import Graphemer from 'graphemer';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const splitter = new Graphemer();
const emojiPattern = /[\p{Emoji}\b]+/u;
const allowedKeys = ['ArrowLeft', 'ArrowUp', 
                     'ArrowDown', 'ArrowRight',
                     'Backspace', 'Delete'];

export default function Home() {
  const [inputEmoji, setInputEmoji] = React.useState('');
  const [showPicker, setShowPicker] = React.useState(false);
  const emojiButton = React.useRef(null);
  
  const checkCharacter = (event) => {
    
    if (allowedKeys.includes(event.key) ||
        emojiPattern.test(event.key)) {
      return;
    }
    
    event.preventDefault();
  }
  
  const addEmoji = (data) => {
    setInputEmoji(inputEmoji + data.native);
  }
  
  const emojiChange = (event) => {
    setInputEmoji(event.target.value);
  }
  
  const copyShareText = (event) => {
    console.log(renderToString(shareText()));
    window.navigator.clipboard.writeText(shareText());
  }
  
  const sortedEmoji = (unsortedEmoji) => {
    return splitter.splitGraphemes(unsortedEmoji).sort()
  }
  
  const shareText = () => {
    return `${inputEmoji} becomes ${sortedEmoji(inputEmoji).join('')} when you sort them! Sort your own at ${window.location.href}`;  
  }
  
  const shareTextHtml = () => {
    return (<p>
      {inputEmoji} becomes {sortedEmoji(inputEmoji)} when you sort them!<br/>
      Sort your own at <a href="{window.location.href}">{window.location.host}</a>
    </p>);
  }
  
  const clickedOutsidePicker = (event) => {
    if (showPicker && event.target != emojiButton.current) {
      setShowPicker(false);
    }
  }

  return (
    <>
      <h1>Emoji Sorter</h1>
      <div id="unsorted">
        <div id="emoji-input">
          <input type="text" placeholder="Insert emoji" value={inputEmoji} onChange={emojiChange} onKeyDown={checkCharacter}/>
          <button ref={emojiButton} id="emoji-picker" onClick={() => setShowPicker(!showPicker)}>😀</button>
          <button id="clear" onClick={() => setInputEmoji('')}>🗑️</button>
        </div>
        { showPicker && <Picker data={data} onEmojiSelect={addEmoji} onClickOutside={clickedOutsidePicker} /> }
      </div>
      <div id="sorted">
        
        { splitter.countGraphemes(inputEmoji) > 1 ?
        <>
          <h2>Sorts to:</h2>
          <p id="sorted-emoji">{sortedEmoji(inputEmoji)}</p>
        </> : 
        <p className="info">
          Input 2 or more emoji to sort them!
        </p>
        }
      </div>
      {splitter.countGraphemes(inputEmoji) > 1 && 
        <>
          <div id="share-section">
            <div id="share-text">
              {shareTextHtml()}
            </div>
            <button id="share-action" onClick={copyShareText}>📋 Copy to clipboard</button>
          </div>
          
        </>
      }
    </>
  );
}
