import React, { useState, useRef, useCallback } from 'react';
import { TradeAreaArgs, TradeArea, RedeemDonationsArea, WithdrawArea, MenuRibbon } from './areas';

class ChangeAmountCallBackArgs {
    constructor (
        public multiplier_: number, 
        public digits_: number,
    ) {}
}

class SetAmountArgs {
    constructor (
        public reference_state: number,
        public setStates: Array<(value: React.SetStateAction<number>) => void>,
        public callback_args: ChangeAmountCallBackArgs[],
        public ref: React.MutableRefObject<HTMLInputElement|null>,
    ) {}
}

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
// NOW: add menu ribbon & new link to inv pg
const TOKEN_ETH_CONVERSION_RATE: number = 10000; // LT: will come from DB

export default function TradingPage(): JSX.Element {
    const [available_tokens, setTokens] = useState<number>(shiftedRandom(60000, 30000, 5));
    const [available_donations, setDonations] = useState<number>(shiftedRandom(70000, 50000, 5));
    const [available_eth, setEth] = useState<number>(shiftedRandom(5, 0.5, 9));
    
    const redeem_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);
    const withdraw_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);
    const buy_tokens_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);
    const buy_eth_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);

    function setAmountUseCallback(args: SetAmountArgs): React.MouseEventHandler<HTMLElement> {
        return useCallback((): void => {
            let input: HTMLInputElement | any = args.ref.current;
            
            if (Number(input.value) < 0) {
                input.value = "0";
            } 
            else if (Number(input.value) > args.reference_state) {
                input.value = String(args.reference_state);
            } 
            else {
                for (let index_ = 0; index_ < args.setStates.length; index_++) {
                    let setStateAction: (value: React.SetStateAction<number>) => void = args.setStates[index_];
                    setStateAction(changeAmountCallback(
                        input, 
                        args.callback_args[index_].multiplier_, 
                        args.callback_args[index_].digits_
                    ));
                }
                // input.value = "0"; // !: if this is in, only every second deduction is actually triggered
            }
        }, [args.reference_state, args.ref.current])
    }

    const redeemTokens: React.MouseEventHandler<HTMLElement> = setAmountUseCallback(new SetAmountArgs(
        available_donations,
        [setTokens, setDonations],
        [new ChangeAmountCallBackArgs(1, 5), new ChangeAmountCallBackArgs(-1, 5)],
        redeem_input_ref
    ));

    const withdrawTokens: React.MouseEventHandler<HTMLElement> = setAmountUseCallback(new SetAmountArgs(
        available_tokens,
        [setTokens],
        [new ChangeAmountCallBackArgs(-1, 5)],
        withdraw_input_ref
    ));
    
    const buyTokens: React.MouseEventHandler<HTMLElement> = setAmountUseCallback(new SetAmountArgs(
        available_eth,
        [setTokens, setEth],
        [
            new ChangeAmountCallBackArgs(TOKEN_ETH_CONVERSION_RATE, 5), 
            new ChangeAmountCallBackArgs(-1, 9)
        ],
        buy_tokens_input_ref
    ));

    const buyEth: React.MouseEventHandler<HTMLElement> = setAmountUseCallback(new SetAmountArgs(
        available_tokens,
        [setTokens, setEth],
        [
            new ChangeAmountCallBackArgs(-1, 5),
            new ChangeAmountCallBackArgs(1 / TOKEN_ETH_CONVERSION_RATE, 9)
        ],
        buy_eth_input_ref
    ));
    
    const setInputValueToMax = useCallback(
        (max_value_: number, ref_: React.MutableRefObject<HTMLInputElement|null>): void => {
            let input_element: HTMLInputElement | any = ref_.current;
            input_element.value = String(max_value_);
        }, 
        [available_tokens, available_donations, available_eth]
    );
    
    return (
        <div>
            <div><MenuRibbon/></div>
            <div id="interact-areas">
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
                <RedeemDonationsArea // TD: max btn & label are not responsive when squeezing horizontally
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
        </div>
    )
}
// TD: buy & sell buttons && withdraw tokens && redeem channel donations -> flexbox vertical 3
// MT: user sh have ETH & token balance that change upon trading (& investing when I implement the second page)