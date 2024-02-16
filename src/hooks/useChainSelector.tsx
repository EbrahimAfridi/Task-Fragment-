import { useState } from "react";
export default function useChainSelector() {
    const [openChainSelector, setOpenChainSelector] = useState(false);
    const openChainSelectorModal = true;

    return { openChainSelector, setOpenChainSelector, openChainSelectorModal }
}