export interface InputFieldIF {
    label_text: string,
    input_id: string,
    maxOnClick: React.MouseEventHandler<HTMLElement>,
    input_ref: React.MutableRefObject<HTMLInputElement|null>,
}

export function InputField(args: InputFieldIF): JSX.Element {
    return (
        <div className="input-field">
            <label htmlFor={args.input_id}>{args.label_text}</label>
            <input 
                id={args.input_id} 
                type="text" 
                ref={args.input_ref} 
                defaultValue={0}
            ></input>
            <button className="max-button" onClick={args.maxOnClick}>MAX</button>
        </div>
    )
}