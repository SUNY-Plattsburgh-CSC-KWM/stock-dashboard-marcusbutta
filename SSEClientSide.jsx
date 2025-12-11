const useState = React.useState;
const useEffect = React.useEffect;

function App() {
    const [AMZN, setAMZN] = useState('');
    const [IBM, setIBM] = useState('');
    const [DOW, setDOW] = useState('');
    const [NASDAQ, setNASDAQ] = useState('');
    useEffect(() => {
        const eventSource = new EventSource('http://localhost:31415/stocks');
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const ticker = data.ticker;

            switch (ticker) {
                case 'AMZN':
                    setAMZN(data);
                    break;
                case 'IBM':
                    setIBM(data);
                    break;
                case 'DOW':
                    setDOW(data);
                    break;
                case 'NASDAQ':
                    setNASDAQ(data);
                    break;
            }
        };
        return () => eventSource.close();
    }, []);
    return (
        <div>
            <h1>Stocks:</h1>
            <table>
                <tr>
                    <th>Ticker</th>
                    <th>Name</th>
                    <th>Last Trade Price</th>
                    <th>Last Trade Volume</th>
                </tr>
                <tr>
                    <td>{AMZN.ticker}</td>
                    <td>{AMZN.name}</td>
                    <td>{AMZN.price}</td>
                    <td>{AMZN.volume}</td>
                </tr>
                <tr>
                    <td>{IBM.ticker}</td>
                    <td>{IBM.name}</td>
                    <td>{IBM.price}</td>
                    <td>{IBM.volume}</td>
                </tr>
                <tr>
                    <td>{DOW.ticker}</td>
                    <td>{DOW.name}</td>
                    <td>{DOW.price}</td>
                    <td>{DOW.volume}</td>
                </tr>
                <tr>
                    <td>{NASDAQ.ticker}</td>
                    <td>{NASDAQ.name}</td>
                    <td>{NASDAQ.price}</td>
                    <td>{NASDAQ.volume}</td>
                </tr>
            </table>
        </div>
    );
}
ReactDOM.render(
    <App />,
    document.getElementById('app'));