import { Range } from 'react-range';

interface Props {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (v: number) => void;
  setMaxPrice: (v: number) => void;
}

const PriceRangeSelector = ({minPrice, maxPrice, setMinPrice, setMaxPrice}: Props) => {
  const step = 1000;
  const min = 0;
  const max = 1000000;

  const handleSliderChange = (values: number[]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = Number(e.target.value);
    if (type === 'min') {
      setMinPrice(value > maxPrice ? maxPrice : value);
    } else {
      setMaxPrice(value < minPrice ? minPrice : value);
    }
  };

  return (
    <div className="w-full my-4">
      <div className="flex gap-4 items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs">₩</span>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={minPrice}
            onChange={(e) => handleInputChange(e, 'min')}
            className="w-24 px-2 py-1 border border-main-4 rounded"
          />
        </div>

        <span>~</span>

        <div className="flex items-center gap-2">
          <span className="text-xs">₩</span>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={maxPrice}
            onChange={(e) => handleInputChange(e, 'max')}
            className="w-24 px-2 py-1 border border-main-4 rounded"
          />
        </div>
      </div>

      <Range
        step={step}
        min={min}
        max={max}
        values={[minPrice, maxPrice]}
        onChange={handleSliderChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '6px',
              background: '#ddd',
              borderRadius: '3px'
            }}
            className="relative w-full bg-gray-300 rounded"
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="w-4 h-4 bg-blue-500 rounded-full shadow"
          />
        )}
      />
    </div>
  )

}

export default PriceRangeSelector
