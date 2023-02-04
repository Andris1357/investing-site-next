import React from "react";

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
            <button className="glowing-button" onClick={args.invokeButton}>
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
            <button className="glowing-button" onClick={args.invokeButton}>
                Redeem
            </button>
        </div>
    )
}