import React, { useState } from 'react';
import { X, Ruler, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');

  if (!isSizeGuideOpen) return null;

  const measurementsCM = [
    { size: 'XS', chest: '110', length: '71', shoulder: '53', sleeve: '23' },
    { size: 'S', chest: '116', length: '73', shoulder: '55', sleeve: '24' },
    { size: 'M', chest: '122', length: '75', shoulder: '57', sleeve: '25' },
    { size: 'L', chest: '128', length: '77', shoulder: '59', sleeve: '26' },
    { size: 'XL', chest: '134', length: '79', shoulder: '61', sleeve: '27' },
    { size: 'XXL', chest: '140', length: '81', shoulder: '63', sleeve: '28' },
  ];

  const measurementsInches = [
    { size: 'XS', chest: '43.3', length: '28.0', shoulder: '20.9', sleeve: '9.1' },
    { size: 'S', chest: '45.7', length: '28.7', shoulder: '21.7', sleeve: '9.4' },
    { size: 'M', chest: '48.0', length: '29.5', shoulder: '22.4', sleeve: '9.8' },
    { size: 'L', chest: '50.4', length: '30.3', shoulder: '23.2', sleeve: '10.2' },
    { size: 'XL', chest: '52.8', length: '31.1', shoulder: '24.0', sleeve: '10.6' },
    { size: 'XXL', chest: '55.1', length: '31.9', shoulder: '24.8', sleeve: '11.0' },
  ];

  const measurements = unit === 'cm' ? measurementsCM : measurementsInches;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        onClick={() => setIsSizeGuideOpen(false)}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white border border-neutral-300 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
          
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                Architectural Fit Matrix
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 font-display">
                Oversized Silhouette Guide
              </h2>
            </div>

            {/* Unit Toggle */}
            <div className="flex items-center border border-neutral-300 p-0.5 bg-neutral-100 self-start sm:self-auto font-mono text-xs">
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 transition-colors ${
                  unit === 'cm' ? 'bg-black text-white font-bold' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Centimeters (CM)
              </button>
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 transition-colors ${
                  unit === 'inches' ? 'bg-black text-white font-bold' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Inches (IN)
              </button>
            </div>
          </div>

          {/* Model references */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-neutral-50 p-4 border border-neutral-200">
            <div>
              <span className="font-bold text-neutral-900">Male Model Reference:</span>
              <p className="text-neutral-600 text-[11px] pt-0.5">
                Height 6'1" (185 cm) · 172 lbs (78 kg) wears <strong>Size L</strong> for dramatic dropped drape.
              </p>
            </div>
            <div>
              <span className="font-bold text-neutral-900">Female Model Reference:</span>
              <p className="text-neutral-600 text-[11px] pt-0.5">
                Height 5'9" (175 cm) · 128 lbs (58 kg) wears <strong>Size S</strong> for relaxed boxy drape.
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-neutral-900 uppercase">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest Width</th>
                  <th className="py-2.5 px-3">Back Length</th>
                  <th className="py-2.5 px-3">Shoulder Drop</th>
                  <th className="py-2.5 px-3">Sleeve Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {measurements.map((row) => (
                  <tr key={row.size} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-neutral-900">{row.size}</td>
                    <td className="py-2.5 px-3 text-neutral-700">{row.chest} {unit}</td>
                    <td className="py-2.5 px-3 text-neutral-700">{row.length} {unit}</td>
                    <td className="py-2.5 px-3 text-neutral-700">{row.shoulder} {unit}</td>
                    <td className="py-2.5 px-3 text-neutral-700">{row.sleeve} {unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to measure */}
          <div className="p-4 bg-white border border-neutral-200 space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider font-mono text-neutral-900 text-[11px]">
              How to Measure For Our Heavyweight Tees
            </h4>
            <ul className="space-y-1 text-neutral-600 list-disc list-inside font-light">
              <li><strong>Chest:</strong> Measure across the fullest part of your chest, keeping tape horizontal.</li>
              <li><strong>Length:</strong> Measure from high point shoulder straight down to hemline.</li>
              <li><strong>Note:</strong> All our tees are pre-shrunk. They will not shrink after home washing.</li>
            </ul>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
            >
              Got It · Close Guide
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
