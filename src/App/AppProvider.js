import React from 'react';

const cc = require('cryptocompare');

export const AppContext = React.createContext();

const MAX_FAVORITES = 10;

export class AppProvider extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            page: 'Dashboard',
            favorites: ['BTC', 'ETH', 'XMR', 'DOGE'],
            ...this.savedSettings(),
            setPage: this.setPage,
            confirmFavorites: this.confirmFavorites,
            addCoin: this.addCoin,
            removeCoin: this.removeCoin,
            inFavorites: this.inFavorites,
            setFilteredCoins: this.setFilteredCoins
        }
    }

    addCoin = (key) =>{
        let favorites = [...this.state.favorites];
        if(favorites.length < MAX_FAVORITES){
            favorites.push(key);
            this.setState({ favorites })
        }
    }

    removeCoin = (key) =>{
        let favorites = [...this.state.favorites];
        favorites.splice(favorites.indexOf(key), 1);
        this.setState({ favorites })
    }

    componentDidMount = () => {
        this.fetchCoins();
        this.fetchPrices();
    }

    fetchCoins = async () => {
        let coinList = (await cc.coinList()).Data;
        this.setState({ coinList })
    }

    fetchPrices = async () => {
        if (this.state.firstVisit) return;
        let prices = await this.prices();
        this.setState({ prices });
    }

    prices = async () => {
        let returnData = [];
        for(let i=0; i < this.state.favorites.length; i++){
            try{
                let priceData = await cc.priceFull(this.state.favorites[i], 'USD');
                returnData.push(priceData)
            } catch (error){
                console.log(error);
            }
        }
        return returnData;
    }

    inFavorites = (key) => {
        return this.state.favorites.includes(key)
    }

    confirmFavorites = () => {
        this.setState({
            firstVisit: false,
            page: 'Dashboard'
        }, () => {
            this.fetchPrices();
        })
        localStorage.setItem('cryptoDash', JSON.stringify({
            favorites: this.state.favorites
        }))
    }

    savedSettings(){
        let cryptoDashData = JSON.parse(localStorage.getItem('cryptoDash'));
        if(!cryptoDashData){
            return {page: 'Settings', firstVisit: true}
        }
        let { favorites } = cryptoDashData;
        return { favorites };
    }

    setPage = (page) => {
        this.setState({ page })
    }

    setFilteredCoins = (filteredCoins) => {
        this.setState({filteredCoins})
    }

    render(){

        return (
            <AppContext.Provider value={ this.state }>
                { this.props.children }
            </AppContext.Provider>
        );
    }
}