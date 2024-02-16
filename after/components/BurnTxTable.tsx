interface BurnTxTableProps {
    data: any[];
    priceUSD: number | undefined;
}

// Fake filler code
const BurnTxTable: React.FC<BurnTxTableProps> = ({ data, priceUSD }) => {
    return (
        <table className="burn-tx-table">
            <thead>
            <tr>
                <th>Column 1</th>
                <th>Column 2</th>
            </tr>
            </thead>
            <tbody>
            {data.map((transaction, index) => (
                <tr key={index}>
                    <td>{transaction.field1}</td>
                    <td>{transaction.field2}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default BurnTxTable;
