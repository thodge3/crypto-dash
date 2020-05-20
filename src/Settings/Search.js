import React from 'react';
import styled from 'styled-components';
import { backgroundColor2, fontSize2 } from '../Shared/Styles';  
import { AppContext } from '../App/AppProvider';
import _ from 'lodash';
import fuzzy from 'fuzzy';

const SearchGrid = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
`

const SearchInput = styled.input`
    ${backgroundColor2}
    ${fontSize2}
    border: 1px solid;
    height: 25px;
    color: #1163C9;
    place-self: center left;
`

const handleFilter = _.debounce((inputValue, coinList, setFilteredCoins) => {
    // Get all coin symbols
    let coinSymbols = Object.keys(coinList);
    // Get all the coin names, map symbol to name
    let coinNames = coinSymbols.map((sym) => coinList[sym].CoinName);
    let allStringsToSearch = coinSymbols.concat(coinNames);
    let fuzzyResults = fuzzy
        .filter(inputValue, allStringsToSearch, {})
        .map((res) => res.string);
    
    let filteredCoins = _.pickBy(coinList, (res, symKey) => {
        let coinName = res.CoinName;
        return (_.includes(fuzzyResults, symKey) || _.includes(fuzzyResults, coinName))
    })

    // console.log(filteredCoins);
    setFilteredCoins(filteredCoins);
}, 500);

function filterCoins(e, setFilteredCoins, coinList){
    let inputValue = e.target.value;
    if(!inputValue){
        setFilteredCoins(null);
        return;
    }
    handleFilter(inputValue, coinList, setFilteredCoins);
}

export default function(){

    return (
        <AppContext.Consumer>
            {({ setFilteredCoins, coinList }) => 
                <SearchGrid> 
                    <h2>Search All Coins</h2>
                    <SearchInput onKeyUp={(e) => filterCoins(e, setFilteredCoins, coinList)}/>
                </SearchGrid>
            }
        </AppContext.Consumer>   
    )
}