import BurnTxTable from './BurnTxTable';

interface TransactionTableProps {
    burnTransactions: any[];
    coinData: any;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ burnTransactions, coinData }) => {
    return (
        <div className="TransactionTableStyled">
            <div className="header">
                <p className="header_label">Burn Transactions</p>
            </div>
            <BurnTxTable data={burnTransactions} priceUSD={coinData?.current_price?.usd} />
        </div>
    );
};

export default TransactionTable;
