const useState = React.useState;
const useEffect = React.useEffect;

function App() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const eventSource = new EventSource('http://localhost:31415/stocks');
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setTime(data.time);
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
                    <th>Price</th>
                </tr>
            </table>
        </div>
    );
}
ReactDOM.render(
    <App />,
    document.getElementById('app'));