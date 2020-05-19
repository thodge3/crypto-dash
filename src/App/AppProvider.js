import React from 'react';

export const AppContext = React.createContext();

export class AppProvider extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            page: 'Dashboard',
            ...this.savedSettings(),
            setPage: this.setPage,
            confirmFavorites: this.confirmFavorites
        }
    }

    confirmFavorites = () => {
        this.setState({
            firstVisit: false,
            page: 'Dashboard'
        })
        localStorage.setItem('cryptoDash', JSON.stringify({
            test: 'hello'
        }))
    }

    savedSettings(){
        let cryptoDashData = JSON.parse(localStorage.getItem('cryptoDash'));
        if(!cryptoDashData){
            return {page: 'Settings', firstVisit: true}
        }
        return {};
    }

    setPage = page => this.setState({ page })

    render(){

        return (
            <AppContext.Provider value={ this.state }>
                { this.props.children }
            </AppContext.Provider>
        );
    }
}