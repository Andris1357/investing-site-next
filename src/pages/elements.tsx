import * as Data from "../data";

export interface InputFieldIF {
    label_text: string,
    input_id: string,
    maxOnClick: React.MouseEventHandler<HTMLElement>,
    input_ref: React.MutableRefObject<HTMLInputElement|null>,
}

interface ChannelHeaderArgs {
    channel_index_: number
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

export function ChannelHeader(args: ChannelHeaderArgs): JSX.Element { // /\: make img corners slightly opaque to fade into backgr
    return (
        <div className="channel-header">
            <img src={Data.channels[args.channel_index_].image_source} className="channel-img" />
            <span className="channel-name">    {Data.channels[args.channel_index_].name}    </span>
            <a href={Data.channels[args.channel_index_].link}><i className="fas fa-external-link-alt"></i></a>
        </div>
    )
}