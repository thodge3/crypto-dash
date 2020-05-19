import React from 'react';
import styled from 'styled-components';

export default function({ coin, style }){

    const ImageStyled = styled.img`
        display: grid;
        justify-content: right;
    `

    return <ImageStyled 
        alt={ coin.CoinSymbol }
        style={ style || {height: '50px'} }
        src={ `http://cryptocompare.com/${ coin.ImageUrl }` }
    />;
}