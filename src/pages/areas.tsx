import React, { useEffect } from "react";
import * as Data from "@/data";

interface MaxButton {
    maxOnClick: React.MouseEventHandler<HTMLElement>,
    input_ref: React.MutableRefObject<HTMLInputElement|null>,
    invokeButton: React.MouseEventHandler<HTMLElement>,
}

interface RedeemDonationsAreaArgs extends MaxButton {
    available_donations: number,
}

interface WithdrawAreaArgs extends MaxButton {
    available_tokens: number,
}

export class TradeAreaArgs implements MaxButton {
    constructor (
        public button_id: string, 
        public button_text: string, 
        public info_text: string,
        public max_id: string,
        public maxOnClick: React.MouseEventHandler<HTMLElement>,
        public input_ref: React.MutableRefObject<HTMLInputElement|null>,
        public invokeButton: React.MouseEventHandler<HTMLElement>,
    ) {}
}
// TD: wrap html output in <React.Fragment> to assign 'key' prop
export function TradeArea(args: TradeAreaArgs): JSX.Element {
    return (
        <div>
            <div className="input-with-max">
                <label htmlFor="amount-input">Enter amount:</label>
                <input id="amount-input" type="text" ref={args.input_ref} defaultValue={0}></input>
                <button id={args.max_id} className="max-button" onClick={args.maxOnClick}>
                    MAX
                </button>
                <div className="available-amount">{args.info_text}</div>
            </div>
            <button id={args.button_id} className="glowing-button" onClick={args.invokeButton}>
                {args.button_text}
            </button>
        </div>
    )
}

export function WithdrawArea(args: WithdrawAreaArgs): JSX.Element {
    return (
        <div>
            <div className="input-with-max">
                <label htmlFor="amount-to-withdraw">Enter amount to withdraw:</label>
                <input id="amount-to-withdraw" type="text" ref={args.input_ref} defaultValue={0}></input>
                <button className="max-button" onClick={args.maxOnClick}>MAX</button>
                <div className="available-amount">
                    {`Available tokens: ${args.available_tokens}`}
                </div>
            </div>
            <button id="withdraw-tokens" className="glowing-button" onClick={args.invokeButton}>
                Withdraw to your wallet
            </button>
        </div>
    )
}

export function RedeemDonationsArea(args: RedeemDonationsAreaArgs): JSX.Element {
    return (
        <div>
            <div className="input-with-max">
                <label htmlFor="amount-to-redeem">Enter amount to redeem:</label>
                <input 
                    id="amount-to-redeem" 
                    type="text" 
                    ref={args.input_ref}
                    defaultValue={0}
                ></input>
                <button className="max-button" onClick={args.maxOnClick}>MAX</button>
                <div className="available-amount">
                    {`Available donations: ${args.available_donations}`}
                </div>
            </div>
            <button id="redeem-donations" className="glowing-button" onClick={args.invokeButton}>
                Redeem
            </button>
        </div>
    )
}

export function MenuRibbon({}): JSX.Element {
    const [selected_menu_id, selectMenu] = React.useState<string>("trade-menu-icon"); // ??: integrate with Next

    const updateMenuIcons = React.useCallback((event_: Event | any): void => { // /\: rewrite value & color checks to hooks
        selectMenu(event_.target.id);
    }, []);

    useEffect(() => {
        for (let icon_ of [...document.getElementsByTagName("i")].filter(element_ => {
            return element_.id.includes("menu-icon")
        })) {
            console.log("looping through element")
            if (icon_.id != selected_menu_id) {
                icon_.style.color = "rgb(127, 255, 0)"; // change to default color (substitute w finally selected deft)
            } else {
                icon_.style.color = "rgb(255, 60, 0)";
            }
        }
    }, [selected_menu_id]);

    return (
        <>
            <div className="space"></div>
            <i 
                id="user-settings-menu-icon" 
                className="far fa-user" 
                style={Data.menu_icon_style} 
                onClick={updateMenuIcons}
            ></i>
            <i 
                id="investing-menu-icon" 
                className="fas fa-chart-line" 
                style={Data.menu_icon_style} 
                onClick={updateMenuIcons}
            ></i>
            <i 
                id="trade-menu-icon" 
                className="fas fa-coins" 
                style={Data.menu_icon_style} 
                onClick={updateMenuIcons}
            ></i>
        </>
    )
}