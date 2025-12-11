const useState = React.useState;
const useEffect = React.useEffect;
const useRef = React.useRef;

// Sparkline component: generated using claude (very slight modifications made) https://claude.ai/share/dbd06b93-4347-4e73-a89c-34d98657e9cd
const Sparkline = ({ data }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');

        if (chartRef.current) {
            // Update existing chart instead of destroying/recreating
            chartRef.current.data.datasets[0].data = data;
            chartRef.current.update();
        } else {
            // Create new chart on first render
            chartRef.current = new Chart.Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map((_, i) => i),
                    datasets: [{
                        data: data,
                        fill: true,
                        borderColor: 'steelblue',
                        backgroundColor: 'steelblue',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 3,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: true }
                    },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    }
                }
            });
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data]);

    return (
        <div style={{ width: '150px', height: '40px' }}>
            <canvas ref={canvasRef} />
        </div>
    );
};

function App() {
    const [AMZN, setAMZN] = useState('');
    const [IBM, setIBM] = useState('');
    const [DOW, setDOW] = useState('');
    const [NASDAQ, setNASDAQ] = useState('');
    const [priceHistory, setPriceHistory] = useState({AMZN: [], IBM: [], DOW: [], NASDAQ: [],});
    useEffect(() => {
        const eventSource = new EventSource('http://localhost:31415/stocks');
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const ticker = data.ticker;

            switch (ticker) {
                case 'AMZN':
                    setAMZN(data);
                    priceHistory.AMZN.push(data.price);
                    break;
                case 'IBM':
                    setIBM(data);
                    priceHistory.IBM.push(data.price);
                    break;
                case 'DOW':
                    setDOW(data);
                    priceHistory.DOW.push(data.price);
                    break;
                case 'NASDAQ':
                    setNASDAQ(data);
                    priceHistory.NASDAQ.push(data.price);
                    break;
            }
            console.log(priceHistory);
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
                    <th>Trend</th>
                </tr>
                <tr>
                    <td>{AMZN.ticker}</td>
                    <td>{AMZN.name}</td>
                    <td>{AMZN.price}</td>
                    <td>{AMZN.volume}</td>
                    <td className="graph">
                        <Sparkline key={JSON.stringify(priceHistory.AMZN)} data={priceHistory.AMZN}></Sparkline>
                    </td>
                </tr>
                <tr>
                    <td>{IBM.ticker}</td>
                    <td>{IBM.name}</td>
                    <td>{IBM.price}</td>
                    <td>{IBM.volume}</td>
                    <td className="graph">
                        <Sparkline key={JSON.stringify(priceHistory.IBM)} data={priceHistory.IBM}></Sparkline>
                    </td>
                </tr>
                <tr>
                    <td>{DOW.ticker}</td>
                    <td>{DOW.name}</td>
                    <td>{DOW.price}</td>
                    <td>{DOW.volume}</td>
                    <td className="graph">
                        <Sparkline key={JSON.stringify(priceHistory.DOW)} data={priceHistory.DOW}></Sparkline>
                    </td>
                </tr>
                <tr>
                    <td>{NASDAQ.ticker}</td>
                    <td>{NASDAQ.name}</td>
                    <td>{NASDAQ.price}</td>
                    <td>{NASDAQ.volume}</td>
                    <td className="graph">
                        <Sparkline key={JSON.stringify(priceHistory.NASDAQ)} data={priceHistory.NASDAQ}></Sparkline>
                    </td>
                </tr>
            </table>
        </div>
    );
}
ReactDOM.render(
    <App />,
    document.getElementById('app'));