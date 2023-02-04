import React, { useState, useRef, useCallback, MouseEventHandler } from 'react';
import { TradeAreaArgs, TradeArea, RedeemDonationsArea, WithdrawArea } from './areas';

const TOKEN_ETH_CONVERSION_RATE: number = 10000; // LT: will come from DB

function shiftedRandom(range_: number, offset_: number, digits_: number): number {
    return Number((Math.random() * range_ + offset_).toFixed(digits_))
}

function changeAmountCallback(
    reference_element_: HTMLInputElement | any,
    multiplier_: number, 
    digits_: number
): (amount_: number) => number {
    return amount_ => Number(
        (amount_ + Number(reference_element_.value) * multiplier_).toFixed(digits_)
    )
}

export default function TradingPage(): JSX.Element {
    const [available_tokens, setTokens] = useState<number>(shiftedRandom(60000, 30000, 5));
    const [available_donations, setDonations] = useState<number>(shiftedRandom(70000, 50000, 5));
    const [available_eth, setEth] = useState<number>(shiftedRandom(5, 0.5, 9));
    // NOW: randomize default amounts
    const redeem_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);
    const withdraw_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);
    const buy_tokens_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);
    const buy_eth_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);

    const redeemTokens = useCallback((): void => {
        let redeem_input: HTMLInputElement | any = redeem_input_ref.current;
        setTokens(amount_ => Number((amount_ + Number(redeem_input.value)).toFixed(5)));
        setDonations(amount_ => Number((amount_ - Number(redeem_input.value)).toFixed(5)));
    }, []);

    const withdrawTokens = useCallback((): void => {
        let withdraw_input: HTMLInputElement | any = withdraw_input_ref.current;
        setTokens(amount_ => Number((amount_ - Number(withdraw_input.value)).toFixed(5)));
    }, []);
    
    const buyTokens = useCallback((): void => { // /\: refactor these to accepts args as functions
        let redeem_input: HTMLInputElement | any = buy_tokens_input_ref.current;
        setTokens(amount_ => Number(
            (amount_ + Number(redeem_input.value) * TOKEN_ETH_CONVERSION_RATE).toFixed(5)
        ));
        setEth(amount_ => Number((amount_ - Number(redeem_input.value)).toFixed(9)));
    }, []);

    const buyEth = useCallback((): void => { // /\: refactor these to accepts args as functions
        let redeem_input: HTMLInputElement | any = buy_tokens_input_ref.current;
        setTokens(amount_ => Number((amount_ - Number(redeem_input.value)).toFixed(5)));
        setEth(amount_ => Number(
            (amount_ + Number(redeem_input.value) / TOKEN_ETH_CONVERSION_RATE).toFixed(9)
        ));
    }, []);
    // NOW: amount::useRef.value sh never go below 0
    const setInputValueToMax = useCallback((
        max_value_: number, 
        ref_: React.MutableRefObject<HTMLInputElement|null>
    ): void => {
        let input_element: HTMLInputElement | any = ref_.current;
        input_element.value = String(max_value_);
    }, [available_tokens, available_donations, available_eth]); // NOW: set ID for max-btn elements
    
    return (
        <div id="absolute-parent">
            <div id="trade-area">
                {[
                    new TradeAreaArgs(
                        "buy-tokens",
                        "Buy tokens for ETH",
                        `Available ETH: ${available_eth}`,
                        "max-buy-with-eth",
                        setInputValueToMax.bind(null, available_eth, buy_tokens_input_ref),
                        buy_tokens_input_ref,
                        buyTokens,

                    ),
                    new TradeAreaArgs(
                        "buy-eth",
                        "Buy ETH for tokens",
                        `Available tokens: ${available_tokens}`,
                        "max-buy-with-tokens",
                        setInputValueToMax.bind(null, available_tokens, buy_eth_input_ref),
                        buy_eth_input_ref,
                        buyEth,
                    )
                ].map(object_ => { // REPLACE WITH GENERATED OBJ <= ßUSESTATE
                    return <TradeArea 
                        button_id={object_.button_id}
                        button_text={object_.button_text}
                        info_text={object_.info_text}
                        max_id={object_.max_id}
                        maxOnClick={object_.maxOnClick}
                        input_ref={object_.input_ref}
                        invokeButton={object_.invokeButton}
                    />
                })}
            </div>
            <RedeemDonationsArea 
                available_donations={available_donations}
                input_ref={redeem_input_ref}
                maxOnClick={setInputValueToMax.bind(null, available_donations, redeem_input_ref)}
                invokeButton={redeemTokens}
            />
            <WithdrawArea 
                available_tokens={available_tokens} 
                maxOnClick={setInputValueToMax.bind(null, available_tokens, withdraw_input_ref)}
                input_ref={withdraw_input_ref}
                invokeButton={withdrawTokens}
            />
        </div>
    )
}

// TD: buy & sell buttons && withdraw tokens && redeem channel donations -> flexbox vertical 3
// TD: user sh have ETH & token balance that change upon trading (& investing when I implement the second page)