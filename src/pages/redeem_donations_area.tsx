import React, {useRef} from "react";

type RedeemDonationsAreaArgs = {
    available_donations: number,
    redeemOnClick: () => void,
    input_ref: HTMLInputElement | any // React.MutableRefObject<number>
}

export default function RedeemDonationsArea(args: RedeemDonationsAreaArgs): JSX.Element {
    return (
        <div>
            <div className="input-with-max">
                <label htmlFor="amount-to-redeem">Enter amount to redeem:</label>
                <input 
                    id="amount-to-redeem" 
                    type="text" 
                    defaultValue={0}
                    ref={args.input_ref}
                ></input>
                <button className="max-button">MAX</button>
                <div className="available-amount">
                    {`Available donations: ${args.available_donations}`}
                </div>
            </div>
            <button className="glowing-button" onClick={args.redeemOnClick}>
                Redeem
            </button>
        </div>
    )
}