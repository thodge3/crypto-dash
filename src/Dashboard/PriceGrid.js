import React from 'react';
import styled from 'styled-components';
import { AppContext } from '../App/AppProvider';
import PriceTile from './PriceTile';


const PriceGrid = styled.div`
    display: grid;
`

export default function(){

    return (
        <AppContext.Consumer>
            {({ prices }) => (
                <PriceGrid>
                    { prices.map((price) => 
                        <div>{ Object.keys(price)[0] }</div>
                        ) 
                    }
                </PriceGrid>
            )}
        </AppContext.Consumer>
    )
}