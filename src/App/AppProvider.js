import React from 'react';
import moment from 'moment';

const cc = require('cryptocompare');
cc.setApiKey('bc0c1de12513fb9fe0216d14467b0da6244ba16528a5c328f7b07d7b5931db7e');

export const AppContext = React.createContext();

const MAX_FAVORITES = 10;
const TIME_UNITS = 10;

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
            setCurrentFavorite: this.setCurrentFavorite,
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
        this.fetchHistorical();
    }

    fetchCoins = async () => {
        let coinList = (await cc.coinList()).Data;
        this.setState({ coinList })
    }

    fetchPrices = async () => {
        if (this.state.firstVisit) return;
        let prices = await this.prices();
        prices = prices.filter((price) => Object.keys(price).length)
        this.setState({ prices });
    }

    fetchHistorical = async () => {
        if(this.state.firstVisit) return;
        let results = await this.historical();
        let historical = [{
            name: this.state.currentFavorite,
            data: results.map((ticker, index) =>[
                moment().subtract({months: TIME_UNITS - index}).valueOf(),
                ticker.USD
            ])
        }]
        this.setState({historical});
        // console.log('results', results);
    }

    historical = () => {
        let promises = [];
        for(let units = TIME_UNITS; units > 0; units--){
            promises.push(
                cc.priceHistorical(
                    this.state.currentFavorite,
                    ['USD'],
                    moment()
                        .subtract({months: units})
                        .toDate()
                )
            )
        }
        return Promise.all(promises);
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
        let currentFavorite = this.state.favorites[0];
        this.setState({
            firstVisit: false,
            page: 'Dashboard',
            currentFavorite: currentFavorite,
            prices: null,
            historical: null
        }, () => {
            this.fetchPrices();
            this.fetchHistorical();
        })
        localStorage.setItem('cryptoDash', JSON.stringify({
            favorites: this.state.favorites,
            currentFavorite,
        }))
    }

    setCurrentFavorite = (sym) => {
        this.setState({
            currentFavorite: sym,
            historical: null
        }, this.fetchHistorical);
        localStorage.setItem('cryptoDash', JSON.stringify({
            ...JSON.parse(localStorage.getItem('cryptoDash')),
            currentFavorite: sym
        }))
    }

    savedSettings(){
        let cryptoDashData = JSON.parse(localStorage.getItem('cryptoDash'));
        if(!cryptoDashData){
            return {page: 'Settings', firstVisit: true}
        }
        let { favorites, currentFavorite } = cryptoDashData;
        return { favorites, currentFavorite };
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