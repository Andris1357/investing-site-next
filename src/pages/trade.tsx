import React, { useState, useRef, useCallback, MouseEventHandler } from 'react';
import { TradeAreaArgs, TradeArea, RedeemDonationsArea, WithdrawArea } from './areas';
// import TradeArea from "@/pages/trade_button_area";
// import RedeemDonationsArea from "./redeem_donations_area";
// import WithdrawArea from "./withdraw_area";
// import {TradeAreaArgs} from "@/pages/trade_button_area";

export default function TradingPage(): JSX.Element {
    const [available_tokens, setTokens] = useState<number>(43729);
    const [available_donations, setDonations] = useState<number>(73921);
    const [available_eth, setEth] = useState<number>(1.485204);
    // NOW: randomize default amounts
    const redeem_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);

    const redeemTokens = useCallback((): void => {
        let redeem_input: HTMLInputElement | any = redeem_input_ref.current;
        setTokens(amount_ => Number((amount_ + Number(redeem_input.value)).toFixed(5)));
        setDonations(amount_ => Number((amount_ - Number(redeem_input.value)).toFixed(5)));
    }, []);
    // TD: I need 4 inputRefs & 4 onClicks in total
    const setInputValueToMax = useCallback((max_value_: number): void => {
        let input_element: HTMLInputElement | any = redeem_input_ref.current;
        input_element.value = String(max_value_);
    }, [available_tokens, available_donations, available_eth]); // NOW: set ID for max-btn elements
    // NOW: maybe this only works w useEff | useRef << max_btn
    return (
        <div id="absolute-parent">
            <div id="trade-area">
                {[
                    new TradeAreaArgs(
                        "buy-tokens",
                        "Buy tokens for ETH",
                        `Available ETH: ${available_eth}`,
                        "max-buy-with-eth",
                        setInputValueToMax.bind(null, available_eth),

                    ),
                    new TradeAreaArgs(
                        "buy-eth",
                        "Buy ETH for tokens",
                        `Available tokens: ${available_tokens}`,
                        "max-buy-with-tokens",
                        setInputValueToMax.bind(null, available_tokens),
                    )
                ].map(object_ => { // REPLACE WITH GENERATED OBJ <= ßUSESTATE
                    return <TradeArea 
                        button_id={object_.button_id}
                        button_text={object_.button_text}
                        info_text={object_.info_text}
                        max_id={object_.max_id}
                        maxOnClick={object_.maxOnClick}
                    />
                })}
            </div>
            <RedeemDonationsArea 
                available_donations={available_donations}
                redeemOnClick={redeemTokens}
                input_ref={redeem_input_ref}
                maxOnClick={setInputValueToMax.bind(null, available_donations)}
            />
            <WithdrawArea 
                available_tokens={available_tokens} 
                maxOnClick={setInputValueToMax.bind(null, available_tokens)}
            />
        </div>
    )
}

// TD: buy & sell buttons && withdraw tokens && redeem channel donations -> flexbox vertical 3
// TD: user sh have ETH & token balance that change upon trading (& investing when I implement the second page)