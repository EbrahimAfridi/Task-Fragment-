const fetchSupplies = async () => {
    //function for fetching data
    console.log('fetchSupplies');
}

export default function useAppSupplies(val: boolean) {
    const supplies = "",
        allSupplies = [],
        setSuppliesChain = "",
        suppliesChain = "";

    if (val) fetchSupplies();

    return {
        fetchSupplies,
        supplies,
        allSupplies,
        setSuppliesChain,
        suppliesChain
    }
}