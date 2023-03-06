import { SetStateAction } from "react";
import { Defaults } from "@/interfaces";

export class SetColorEventListenerArgs {
    constructor (
        public button_id_: string, 
        public edges_: string, 
        public font_: string, 
        public event_: string
    ) {}
}

export function $(id_: string): HTMLElement | any {
    return document.getElementById(id_);
}

export function sum(array_: number[]): number {
    return array_.reduce((
        accumulator_: number, 
        current_: number
    ): number => accumulator_ + current_)
}

export function mean(array_: number[]): number {
    return sum(array_) / array_.length
}

export function shiftedRandom(
    range_: number, 
    offset_: number, 
    digits_: number
): number {
    return Number((Math.random() * range_ + offset_).toFixed(digits_))
}

export function generateRandomTimeseries(
    length_: number, 
    initial_value_: number, 
    mean_: number,
    deviation_: number,
    only_int_increments_: boolean = false,
): number[] {
    let timeseries: number[] = [initial_value_]; // LT: only load deft timeseries, make req to db if user wants to view longer timefr
    for (let i = 1; i < length_; i++) {
        let value: number = timeseries[i - 1] + (
            only_int_increments_ === true
            ? Math.floor(Math.random() * deviation_ - deviation_ / 2 + mean_)
            : Math.random() * deviation_ - deviation_ / 2 + mean_
        );
        timeseries.push(value < 0 ? 0 : value);
    }
    return timeseries;
}

export function randomArray(
    range_: number, 
    offset_: number, 
    digits_: number,
): number[] {
    return Array.from(
        {length: Defaults.number_of_channels},
        (): number => shiftedRandom(range_, offset_, digits_)
    );
}

export function changeAmountCallback(
    reference_element_: HTMLInputElement | any,
    multiplier_: number, 
    digits_: number,
): SetStateAction<number> {
    return amount_ => Number(
        (amount_ + Number(reference_element_.value) * multiplier_).toFixed(digits_)
    )
}

export function setColorEventListener(args: SetColorEventListenerArgs): void {
    let element: HTMLElement | any = $(args.button_id_);
    let callable = (): void => {
        element.style.borderColor = args.edges_;
        element.style.color = args.font_;
    }
    element.addEventListener(args.event_, callable);
}

export function attachHoverMessageEventListeners(message_class_name_: string): void {
    let hover_anchors: Element[] = [
        ...document.getElementsByClassName(`${message_class_name_}-anchor`)
    ];

    for (let anchor_i_: number = 1; anchor_i_ <= hover_anchors.length; anchor_i_++) {
        $(`${message_class_name_}-anchor-${anchor_i_}`).addEventListener(
            "mouseenter", 
            (): void => {
                let message_element: HTMLElement | null = $(`${message_class_name_}-${anchor_i_}`);
                if (message_element !== null) {
                    (message_element as HTMLElement).style.visibility = "visible";
                }
            }
        );
        $(`${message_class_name_}-anchor-${anchor_i_}`).addEventListener(
            "mouseleave", 
            (): void => {
                let message_element: HTMLElement | null = $(`${message_class_name_}-${anchor_i_}`);
                if (message_element !== null) {
                    (message_element as HTMLElement).style.visibility = "hidden";
                }
            }
        );
    }
}

export function positionHoverMessages(message_class_name_: string): void {
    const hover_message_timeseries: Array<HTMLElement|Element> = [
        ...document.getElementsByClassName(message_class_name_)
    ];

    for (let element_ of hover_message_timeseries) {
        let message_width: number = element_.getBoundingClientRect()["width"];
        let icon_width: number = $(
            `${message_class_name_}-anchor-${element_.id.substring(element_.id.lastIndexOf('-') + 1)}`
        ).getBoundingClientRect()["width"];
        (element_ as HTMLElement).style.left = `${-1 * (message_width / 2 - icon_width / 2)}px`;
    }
}

export function getMenuIcons(): HTMLElement[] {
    return [...document.getElementsByTagName("i")].filter(
        (element_: HTMLElement): boolean => {
            return element_.id.includes("menu-icon")
        }
    )
}

export function formatPercentageValue(base_: number): string {
    return `${base_ > 0 ? "+" : ""}${(base_ * 100).toFixed(2)}%`
}