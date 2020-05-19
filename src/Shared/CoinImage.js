import React from 'react';
import styled, { css } from 'styled-components';

export default function({ coin, spotlight }){

    const ImageStyled = styled.img`
        height: 50px;
        ${(props) => (props.spotlight && css`
                height: 200px;
                margin: auto;
                display: block;
            `)
        }
    `

    return <ImageStyled 
        spotlight={ spotlight }
        alt={ coin.CoinSymbol }
        src={ `http://cryptocompare.com/${ coin.ImageUrl }` }
    />;
}