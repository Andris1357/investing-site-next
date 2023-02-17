import { SetStateAction } from "react";

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

export function shiftedRandom(
    range_: number, 
    offset_: number, 
    digits_: number
): number {
    return Number((Math.random() * range_ + offset_).toFixed(digits_))
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