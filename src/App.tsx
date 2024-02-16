import TransactionTable from "../components/TransactionTableStyled.tsx";
import ChainSelectorComponent from "../components/ChainSelector.tsx";
import AppToast from "../ui/AppToast.tsx";
import BurnStatsContainer from "../components/BurnStatsContainer.tsx";
import BurnButtonBar from "../components/BurnButtonBar.tsx";
import {useEffect, useState} from "react";
import useAppSupplies from "./hooks/useAppSupplies.tsx";
import useAppToast from "./hooks/useAppToast.tsx";
import useChainSelector from "./hooks/useChainSelector.tsx";
import useEthersSigner from "./hooks/useEthersSigner.tsx";
import useWallet from "./hooks/useWallet.tsx";

const BurnPageStyled = styled.div``;

enum BurnTxProgress {
    default = "Burn App Tokens",
    burning = "Burning...",
}

const App = () => {
    const {
        walletAddress,
        isWalletConnected,
        walletBalance,
        isBalanceError,
        openChainModal,
        walletChain,
        chains: receiveChains,
        openConnectModal,
    } = useWallet();

    const {
        openChainSelector,
        setOpenChainSelector,
        openChainSelectorModal
    } = useChainSelector();

    const {
        supplies,
        allSupplies,
        setSuppliesChain,
        suppliesChain,
        fetchSupplies,
    } = useAppSupplies(true);

    const [burnTransactions, setBurnTransactions] = useState<any[]>([]);
    const [isOldToken, setIsOldToken] = useState(false);
    const [burnAmount, setBurnAmount] = useState("");

    const {toastMsg, toastSev, showToast} = useAppToast();
    const ethersSigner = useEthersSigner({
        chainId: walletChain?.id ?? chainEnum.mainnet,
    });
    const [txButton, setTxButton] = useState<BurnTxProgress>(
        BurnTxProgress.default
    );
    const [txProgress, setTxProgress] = useState<boolean>(false);
    const [approveTxHash, setApproveTxHash] = useState<string | null>(null);
    const [burnTxHash, setBurnTxHash] = useState<string | null>(null);

    const statsSupplies = supplies;
    const tokenAddress = fetchAddressForChain(
        suppliesChain?.id,
        isOldToken ? "oldToken" : "newToken"
    );

    const [coinData, setCoinData] = useState<any>({});
    useEffect(() => {
        CoinGeckoApi.fetchCoinData()
            .then((data: any) => {
                //console.log("coin stats", data);
                setCoinData(data?.market_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const onChangeBurnAmount = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value == "") setBurnAmount("");
        if (isNaN(parseFloat(e.target.value))) return;
        setBurnAmount(e.target.value);
    };

    const refetchTransactions = () => {
        Promise.all(
            ChainScanner.fetchAllTxPromises(isChainTestnet(walletChain?.id))
        )
            .then((results: any) => {
                //console.log(res);
                let res = results.flat();
                res = ChainScanner.sortOnlyBurnTransactions(res);
                res = res.sort((a: any, b: any) => b.timeStamp - a.timeStamp);
                setBurnTransactions(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const executeBurn = async () => {
        if (!isWalletConnected) {
            openConnectModal();
        }
        if (burnAmount === "") {
            console.log("Enter amount to migrate");
            showToast("Enter amount to migrate", ToastSeverity.warning);
            return;
        }
        const newTokenAddress = fetchAddressForChain(walletChain?.id, "newToken");
        const oftTokenContract = new Contract(
            newTokenAddress,
            oftAbi,
            ethersSigner
        );
        let amount = parseEther(burnAmount);
        setTxButton(BurnTxProgress.burning);
        setTxProgress(true);
        try {
            const burnTx = await oftTokenContract.burn(
                //tokenAddress,
                amount
            );
            setBurnTxHash(burnTx.hash);
            console.log(burnTx, burnTx.hash);
            await burnTx.wait();
            setTxButton(BurnTxProgress.default);
            setTxProgress(false);
            refetchTransactions();
            fetchSupplies();
        } catch (err) {
            console.log(err);
            setTxButton(BurnTxProgress.default);
            setTxProgress(false);
            showToast("Burn Failed!", ToastSeverity.error);
            return;
        }
    };

    useEffect(() => {
        if (!walletChain) return;
        //console.log(suppliesChain);
        let isSubscribed = true;
        // const newTokenAddress = fetchAddressForChain(
        //   walletChain?.id,
        //   isOldToken ? "oldToken" : "newToken"
        // );
        if (isSubscribed) setBurnTransactions([]);
        const isTestnet = isChainTestnet(walletChain?.id);
        let _chainObjects: any[] = [mainnet, avalanche, fantom];
        if (isTestnet) _chainObjects = [sepolia, avalancheFuji, fantomTestnet];
        Promise.all(ChainScanner.fetchAllTxPromises(isTestnet))
            .then((results: any) => {
                //console.log(results, isTestnet);
                if (isSubscribed) {
                    let new_chain_results: any[] = [];
                    results.forEach((results_a: any[], index: number) => {
                        new_chain_results.push(
                            results_a.map((tx: any) => ({
                                ...tx,
                                chain: _chainObjects[index],
                            }))
                        );
                    });
                    let res = new_chain_results.flat();
                    console.log(res, isTestnet);
                    res = ChainScanner.sortOnlyBurnTransactions(res);
                    res = res.sort((a: any, b: any) => b.timeStamp - a.timeStamp);
                    setBurnTransactions(res);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        return () => {
            isSubscribed = false;
        };
    }, [walletChain, isOldToken]);

    return (
        <div>
            <DashboardLayoutStyled className="burnpage">
                <div
                    className="top_conatiner burnpage"
                    style={{alignItems: "flex-start"}}
                >
                    <div className="info_box filled">
                        <h1 className="title">App TOKEN BURN</h1>
                        <p className="description medium"></p>

                        <BurnButtonBar/>

                    </div>

                    <BurnStatsContainer
                        walletChain={walletChain}
                        suppliesChain={suppliesChain}
                        statsSupplies={statsSupplies}
                        allSupplies={allSupplies}
                        chainTokenSymbols={chainTokenSymbols}
                    />

                </div>
            </DashboardLayoutStyled>

            <TransactionTable burnTransactions={burnTransactions} coinData={coinData} />

            <ChainSelectorComponent
                title={"Switch Token Chain"}
                openChainSelector={openChainSelector}
                setOpenChainSelector={setOpenChainSelector}
                chains={receiveChains}
                selectedChain={suppliesChain}
                setSelectedChain={setSuppliesChain}
            />
            <AppToast
                position={{ vertical: 'bottom', horizontal: 'center' }}
                message={toastMsg}
                severity={toastSev}
            />
        </div>
    );
};

export default App;