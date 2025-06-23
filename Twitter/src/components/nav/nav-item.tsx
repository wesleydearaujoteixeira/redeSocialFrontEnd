"use client"

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    label: string;
    icon: IconDefinition;
    active?: boolean;
}
export const NavItem = ({ label, icon, active }: Props) => {

    return (
        <div className={`flex items-center gap-6 py-3 opacity-50 hover:opacity-100`}>
            <FontAwesomeIcon icon={icon} className="size-6" />
            <div className="text-lg"> {label} </div>
        </div>
    );
}