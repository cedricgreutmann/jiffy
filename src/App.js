import React, { Component } from 'react';
import loader from './images/loader.svg';
import Gif from './Gif';
import clearButton from './images/close-icon.svg';

const randomChoice = arr => 
{
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({clearSearch, hasResults}) =>
(
  <div className='header grid'>
    {hasResults ? 
    <button onClick={clearSearch}>
      <img src={clearButton} />
    </button> : <h1 className='title'> Jiffy</h1>}
  </div>
)

const UserHint = ({loading, hintText}) => 
(
  <div className='user-hint'>
    {loading ? <img className='block mx-auto' src={loader}/> : hintText}
  </div>
)


class App extends Component {

  constructor(props)
  {
    super(props)
    this.state = 
    {
      loading: false,
      searchTerm: '',
      hintText: 'Hit Enter to search',
      gifs: []
    }
  }

  // we want a function that searchs giphy api using fetch and put the search
  // term into the query URL then we can do something with the results
  searchGiphy = async searchTerm => 
  {
    this.setState({
      loading: true
    });
    try
    {
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=DN9THb6MNrL3Cq0TIGk94ODRCg9rNF9T&q=${searchTerm}&limit=25&offset=0&rating=G&lang=en`
      );

      const {data} = await response.json();

      if (!data.length) {
        throw `Nothing found for ${searchTerm}`
      }


      const gif = data[0]

      const randomGif = randomChoice(data);


      this.setState((prevState, props) => ({
        ...prevState,
        //here we use the spread to take the previous gifs to spread out then add new random gif to the end
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }));
    
    }
    //if it fails we catch it here
    catch (error)
    {
      this.setState((prevState, props) => ({
        hintText: error,
        loading: false
      }));
      console.log(error);

    }
  };


  
  handleChange = event => 
  {
    const {value} = event.target;
    this.setState((prevState, props) => ({
      ...prevState, searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));

  };

  handleKeyPress = event => 
  {
    const {value} = event.target

    if (value.length > 2 && event.key === 'Enter')
    {
      //here we call our searchGiphy function using the search term
      this.searchGiphy(value);
    }
  };
  
  //reset state by clearing everything and making it default again

  clearSearch = () =>
  {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));

    this.textInput.focus();
  };


  render() {
    const { searchTerm, gifs } = this.state;
    const hasResults = gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />


        <div className='search grid'>
        
          {this.state.gifs.map(gif => (
            <Gif {...gif}/>
          ))}
          
          <input className='input grid-item' 
          placeholder='type something' 
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          value={searchTerm}
          ref={input => {
            this.textInput = input;
          }}
          />
        </div>
        <UserHint {...this.state}/>
      </div>
    );
  }
}

export default App;
