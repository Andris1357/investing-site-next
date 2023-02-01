import TradeArea from "@/pages/trade_button_area";
import RedeemDonationsArea from "./redeem_donations_area";
import WithdrawArea from "./withdraw_area";
import {TradeAreaArgs} from "@/pages/trade_button_area";

import React, { useState, useRef, useCallback } from 'react';

export default function TradingPage(): JSX.Element {
    const [available_tokens, setTokens] = useState<number>(43729);
    const [available_donations, setDonations] = useState<number>(73921);
    const [available_eth, setEth] = useState<number>(1.485204);

    const redeem_input_ref = useRef(0);

    const redeemTokens = useCallback((redeem_input_: HTMLInputElement | any) => {
        setTokens(tokens_ => tokens_ + Number(redeem_input_.value));
        console.log(`increased token amount by ${redeem_input_.value}, new value of token amount is ${available_tokens}`)
    }, [])

    return (
        <div id="absolute-parent">
            <div id="trade-area">
                {[
                    new TradeAreaArgs(
                        "buy-tokens",
                        "Buy tokens for ETH",
                        `Available ETH: ${available_eth}`
                    ),
                    new TradeAreaArgs(
                        "buy-eth",
                        "Buy ETH for tokens",
                        `Available tokens: ${available_tokens}`
                    )
                ].map(object_ => { // REPLACE WITH GENERATED OBJ <= ßUSESTATE
                    return <TradeArea 
                        button_id={object_.button_id}
                        button_text={object_.button_text}
                        info_text={object_.info_text}
                    />
                })}
            </div>
            <RedeemDonationsArea 
                available_donations={available_donations}
                redeemOnClick={redeemTokens.bind(
                    null, 
                    redeem_input_ref.current
                )}
                input_ref={redeem_input_ref}
            />
            <WithdrawArea available_tokens={available_tokens}/>
        </div>
    )
}

// TD: buy & sell buttons && withdraw tokens && redeem channel donations -> flexbox vertical 3
// TD: user sh have ETH & token balance that change upon trading (& investing when I implement the second page)