import { ReactNode } from "react";
import * as Data from "../data";
import { channels } from "@/typed_data";

type CellContent = JSX.Element | ReactNode;

export interface InputFieldIF {
    label_text: string,
    input_id: string,
    maxOnClick: React.MouseEventHandler<HTMLElement>,
    input_ref: React.MutableRefObject<HTMLInputElement|null>,
}

interface ChannelHeaderArgs {
    channel_index_: number,
}

interface DisabledTextboxArgs {
    element_id_: string, 
    value_: number | string, 
}

interface InfoHoverIconArgs {
    info_id_: number, 
    info_text_: string,
}

interface CategoryWithInfoArgs {
    label_text_: string, 
    info_id_: number, 
    info_text_: string,
}

interface TableRowArgs {
    cells_content: CellContent[],
}

interface TableArgs {
    rows_content: CellContent[][],
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
            <img src={channels[args.channel_index_].image_source} className="channel-img" />
            <span className="channel-name">    {channels[args.channel_index_].name}    </span>
            <a href={channels[args.channel_index_].link}>
                <i className="fas fa-external-link-alt"></i>
            </a>
        </div>
    )
}

export const DisabledTextbox = (args: DisabledTextboxArgs): JSX.Element => {
    return (
        <input id={args.element_id_} type="text" disabled value={args.value_}></input>
    )
}

export const InfoHoverIcon = (args: InfoHoverIconArgs): JSX.Element => {
    return (
        <span className="info-hover-anchor" id={`info-hover-anchor-${args.info_id_}`}>
            <i className="fas fa-info-circle"></i>
            <div className="info-hover" id={`info-hover-${args.info_id_}`}>{args.info_text_}</div>
        </span>
    )
}

export const CategoryWithInfo = (args: CategoryWithInfoArgs) => {
    return (
        <span>
            <span style={Data.metric_category_style}>{args.label_text_}</span>
            <span style={Data.space_style}></span>
            <InfoHoverIcon info_id_={args.info_id_} info_text_={args.info_text_}/>
        </span>
    )
}

export const Table = (args: TableArgs) => {
    if (!Array.isArray(args.rows_content)) {
        return (
            <table><tbody>
                <tr><TableRow cells_content={args.rows_content}></TableRow></tr>
            </tbody></table>
        )
    }
    return (
        <table style={{minHeight: "30px"}}><tbody>
            {args.rows_content.map(row_ => (
                <tr><TableRow cells_content={row_}></TableRow></tr>
            ))}
        </tbody></table>
    )
}

export const TableRow = (args: TableRowArgs): JSX.Element => {
    if (!Array.isArray(args.cells_content)) {
        return (
            <td>{args.cells_content}</td>
        )
    }
    if (args.cells_content.slice(1,).every(cell_content_ => cell_content_ === "")) {
        return (
            <td colSpan={4} style={Data.metric_category_style}>
                {args.cells_content[0]}
            </td>
        )
    }
    return (
        <>
            {args.cells_content.map(content_ => (
                <td><span>{content_}</span></td>
            ))}
        </>
    )
}