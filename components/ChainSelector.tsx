interface ChainSelectorProps {
    title: string;
    openChainSelector: boolean;
    setOpenChainSelector: (open: boolean) => void;
    chains: any[];
    selectedChain: any;
    setSelectedChain: (chain: any) => void;
}

const ChainSelectorComponent: React.FC<ChainSelectorProps> = (
    {
        title,
        openChainSelector,
        setOpenChainSelector,
        chains,
        selectedChain,
        setSelectedChain,
    }) => {
    // Fake filler component
    return (
        <div>
            {/*fake p tags*/}
            <p>{title}</p>
            <p>{openChainSelector}</p>
            {/*<p>{setOpenChainSelector}</p>*/}
            <p>{chains}</p>
            <p>{selectedChain}</p>
            {/*<p>{setSelectedChain}</p>*/}
        </div>
    );
};

export default ChainSelectorComponent;
