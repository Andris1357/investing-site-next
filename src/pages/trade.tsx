import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TradeAreaArgs, TradeArea, RedeemDonationsArea, WithdrawArea, MenuRibbon } from './areas';
import { 
    setColorEventListener, 
    SetColorEventListenerArgs, 
    shiftedRandom, 
    changeAmountCallback,
} from "@/pages/utility";
import * as Data from "@/data";
import { GlobalState, GlobalSetAction } from '@/store';
import { Dispatch } from 'react';

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
        public redux_set_action?: string | null,
    ) {}
}

const TOKEN_ETH_CONVERSION_RATE: number = 10000; // LT: will come from DB
const random_token_amount: number = shiftedRandom(60000, 30000, 5);
const random_donations_amount: number = shiftedRandom(70000, 50000, 5);
const random_eth_amount: number = shiftedRandom(5, 0.5, 9);

const set_color_event_listener_args: SetColorEventListenerArgs[] = [
    new SetColorEventListenerArgs("", Data.yellow_borders, "yellow", "mousedown"),
    new SetColorEventListenerArgs("", Data.red_borders, "red", "mouseup"),
    new SetColorEventListenerArgs("", Data.green_borders, "chartreuse", "mouseleave"),
    new SetColorEventListenerArgs("", Data.red_borders, "red", "mouseenter"),
]

export default function TradingPage(): JSX.Element { // TD: include an area where they can load native tokens into their account, maybe in the same as the withdraw tokens
    const dispatchGlobalState: Dispatch<GlobalSetAction> = useDispatch();
    const token_amount_selector: number = useSelector((state: GlobalState): number => state.current_token_amount);
    
    const [available_tokens, setTokens] = useState<number>(random_token_amount);
    const [available_donations, setDonations] = useState<number>(random_donations_amount);
    const [available_eth, setEth] = useState<number>(random_eth_amount);
    
    const redeem_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);
    const withdraw_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);
    const buy_tokens_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);
    const buy_eth_input_ref: React.MutableRefObject<HTMLInputElement|null> = useRef(null);

    function setAmountUseCallback(args: SetAmountArgs): React.MouseEventHandler<HTMLElement> {
        return useCallback((): void => {
            let input: HTMLInputElement | any = args.ref.current;
            
            if (Number(input.value) < 0) {
                input.value = "0";
            } else if (Number(input.value) > args.reference_state) {
                input.value = String(args.reference_state);
            } else {

                for (let index_ = 0; index_ < args.setStates.length; index_++) {
                    let setStateAction: (value: React.SetStateAction<number>) => void = args.setStates[index_];
                    setStateAction(changeAmountCallback(
                        input, 
                        args.callback_args[index_].multiplier_, 
                        args.callback_args[index_].digits_
                    ));
                } // input.value = "0"; // !: if this is in, only every second deduction is actually triggered
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
        token_amount_selector,
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
        token_amount_selector,
        [setTokens, setEth],
        [
            new ChangeAmountCallBackArgs(-1, 5),
            new ChangeAmountCallBackArgs(1 / TOKEN_ETH_CONVERSION_RATE, 9)
        ],
        buy_eth_input_ref
    ));
    
    const setInputValueToMax = useCallback(
        function (
            max_value_: number, 
            ref_: React.MutableRefObject<HTMLInputElement|null>
        ): void {
            let input_element: HTMLInputElement | any = ref_.current;
            input_element.value = String(max_value_);
        }, 
        [token_amount_selector, available_donations, available_eth]
    );

    useEffect(() => {
        let buttons: Array<Element | any> = [...document.getElementsByClassName("glowing-button")];
        for (let element_ of buttons) {
            for (let arguments_ of set_color_event_listener_args) {
                setColorEventListener({...arguments_, button_id_: element_.id})
            }
        }
    }, []);
    
    useEffect(() => {
        dispatchGlobalState({ // TD: figure out its type and pass it as arg ??ea state
            type: "SET_TOKENS", 
            payload: available_tokens
        })
    }, [available_tokens]);
    
    return (
        <div className="absolute-parent">
            <div><MenuRibbon current_menu_id_="trade-menu-icon"/></div>
            <div id="interact-areas"  className="main-area">
                <div id="trade-area">
                    {[
                        new TradeAreaArgs(
                            "buy-tokens",
                            "Buy tokens for ETH",
                            `Available ETH: ${available_eth}`,
                            "max-buy-with-eth",
                            "Enter amount:",
                            "buy-tokens-input",
                            setInputValueToMax.bind(null, available_eth, buy_tokens_input_ref),
                            buy_tokens_input_ref,
                            buyTokens,
                        ),
                        new TradeAreaArgs(
                            "buy-eth",
                            "Buy ETH for tokens",
                            `Available tokens: ${token_amount_selector}`,
                            "max-buy-with-tokens",
                            "Enter amount:",
                            "buy-eth-input",
                            setInputValueToMax.bind(null, token_amount_selector, buy_eth_input_ref),
                            buy_eth_input_ref,
                            buyEth,
                        )
                    ].map(object_ => { // REPLACE WITH GENERATED OBJ <= ??USESTATE
                        return <TradeArea 
                            button_id={object_.button_id}
                            button_text={object_.button_text}
                            info_text={object_.info_text}
                            max_id={object_.max_id}
                            label_text={object_.label_text}
                            input_id={object_.input_id}
                            maxOnClick={object_.maxOnClick}
                            input_ref={object_.input_ref}
                            invokeButton={object_.invokeButton}
                        />
                    })}
                </div>
                <RedeemDonationsArea // TD: max btn & label are not responsive when squeezing horizontally
                    available_donations={available_donations}
                    label_text="Enter amount to redeem:"
                    input_id="amount-to-redeem" 
                    input_ref={redeem_input_ref}
                    maxOnClick={setInputValueToMax.bind(null, available_donations, redeem_input_ref)}
                    invokeButton={redeemTokens}
                />
                <WithdrawArea 
                    available_tokens={token_amount_selector} 
                    label_text="Enter amount to withdraw:"
                    input_id="amount-to-withdraw"
                    maxOnClick={setInputValueToMax.bind(null, token_amount_selector, withdraw_input_ref)}
                    input_ref={withdraw_input_ref}
                    invokeButton={withdrawTokens}
                />
            </div>
        </div>
    )
}
// TD: buy & sell buttons && withdraw tokens && redeem channel donations -> flexbox vertical 3
// MT: user sh have ETH & token balance that change upon trading (& investing when I implement the second page)