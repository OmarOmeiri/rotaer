import SplitButtons from '../Buttons/SplitButtons';

const TickerSelectMenu = ({
  tickers,
  selected,
  onSelect,
}: {
  tickers?: string[]
  selected: string,
  onSelect: (key: string) => void
}) => () => {
  if (!tickers) {
    return null;
  }
  const items = tickers.map((t) => ({ id: t, name: t }));
  return (
    <div style={{ marginLeft: 'auto' }}>
      <SplitButtons
        items={items}
        selected={selected}
        onClick={onSelect}
      />
    </div>
  );
};

export default TickerSelectMenu;
