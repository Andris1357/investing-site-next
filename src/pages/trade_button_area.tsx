export class TradeAreaArgs {
    constructor (
        public button_id: string, 
        public button_text: string, 
        public info_text: string
    ) {}
}
// TD: wrap html output in <React.Fragment> to assign 'key' prop
export default function TradeArea(args: TradeAreaArgs): JSX.Element {
    return (
        <div>
            <div className="input-with-max">
                <label htmlFor="amount-input">Enter amount:</label>
                <input id="amount-input" type="text"></input>
                <button className="max-button">MAX</button>
                <div className="available-amount">{args.info_text}</div>
            </div>
            <button id={args.button_id} className="glowing-button">{args.button_text}</button>
        </div>
    )
}