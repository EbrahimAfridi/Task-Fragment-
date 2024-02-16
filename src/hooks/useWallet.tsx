export default function useWallet() {
    const walletAddress = 0,
        isWalletConnected = false,
        walletBalance = 0,
        isBalanceError = false,
        openChainModal = false,
        walletChain = false,
        chains = false,
        openConnectModal = false;

    return {
        walletAddress,
        isWalletConnected,
        walletBalance,
        isBalanceError,
        openChainModal,
        walletChain,
        chains,
        openConnectModal,
    };
}