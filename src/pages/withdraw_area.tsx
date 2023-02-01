type WithdrawAreaArgs = {
    available_tokens: number,
}

export default function WithdrawArea(args: WithdrawAreaArgs): JSX.Element {
    return (
        <div>
            <div className="input-with-max">
                <label htmlFor="amount-to-withdraw">Enter amount to withdraw:</label>
                <input id="amount-to-withdraw" type="text"></input>
                <button className="max-button">MAX</button>
                <div className="available-amount">
                    {`Available tokens: ${args.available_tokens}`}
                </div>
            </div>
            <button className="glowing-button">Withdraw to your wallet</button>
        </div>
    )
}