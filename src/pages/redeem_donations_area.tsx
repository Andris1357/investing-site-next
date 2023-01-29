type RedeemDonationsAreaArgs = {
    available_donations: number,
}

export default function RedeemDonationsArea(args: RedeemDonationsAreaArgs): JSX.Element {
    return (
        <div>
            <div className="input-with-max">
                <label htmlFor="amount-to-redeem">Enter amount to redeem:</label>
                <input id="amount-to-redeem" type="text"></input>
                <button className="max-button">MAX</button>
                <div className="available-amount">
                    {`Available donations: ${args.available_donations}`}
                </div>
            </div>
            <button className="glowing-button">REDEEM</button>
        </div>
    )
}