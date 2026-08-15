import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { brands, allColors, allSizes } from '../data/products'

export function FiltersPage() {
  const { gender, subcategory } = useParams()
  const navigate = useNavigate()
  const [priceRange, setPriceRange] = useState(150)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val])
  }

  const apply = () => {
    navigate(`/catalog/${gender}/${subcategory ?? 'New'}`)
  }

  return (
    <div className="pb-24 min-h-screen bg-white">
      <PageHeader title="Filters" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Price */}
        <section>
          <h3 className="text-sm font-bold uppercase mb-4">Price range</h3>
          <input
            type="range"
            min={0}
            max={300}
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted mt-2">
            <span>$0</span>
            <span className="font-semibold text-[#222]">${priceRange}</span>
            <span>$300+</span>
          </div>
        </section>

        {/* Colors */}
        <section>
          <h3 className="text-sm font-bold uppercase mb-4">Color</h3>
          <div className="flex flex-wrap gap-3">
            {allColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => toggle(selectedColors, color, setSelectedColors)}
                className={`w-10 h-10 rounded-full border-2 transition-transform ${
                  selectedColors.includes(color)
                    ? 'border-primary scale-110'
                    : 'border-border'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        </section>

        {/* Sizes */}
        <section>
          <h3 className="text-sm font-bold uppercase mb-4">Size</h3>
          <div className="flex flex-wrap gap-2">
            {allSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggle(selectedSizes, size, setSelectedSizes)}
                className={`min-w-[48px] h-10 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  selectedSizes.includes(size)
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        {/* Brands */}
        <section>
          <h3 className="text-sm font-bold uppercase mb-4">Brand</h3>
          <div className="space-y-3">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggle(selectedBrands, brand, setSelectedBrands)}
                  className="w-5 h-5 accent-primary rounded"
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4">
        <div className="max-w-lg mx-auto">
          <Button fullWidth size="lg" onClick={apply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
