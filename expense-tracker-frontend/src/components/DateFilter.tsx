import type { FilterOption } from '../types/dashboard';

type DateFilterProps = {
selected: FilterOption;
startDate: string;
endDate: string;
onPeriodChange: (value: FilterOption) => void;
onStartDateChange: (value: string) => void;
onEndDateChange: (value: string) => void;
onApply: () => void;
};

function DateFilter({
selected,
startDate,
endDate,
onPeriodChange,
onStartDateChange,
onEndDateChange,
onApply,
}: DateFilterProps) {
    const options: FilterOption[] = [
    '2025',
    '2026',
    'custom',
    ];

    return ( 
        <div className="bg-white rounded-xl shadow p-5 mb-6"> <div className="flex items-center justify-between mb-4"> <h3 className="font-semibold text-lg">
        Time Period </h3>

            <span className="text-sm text-gray-500">
            Dashboard filter
            </span>
        </div>

        <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-4">
            {options.map((option) => (
            <button
                key={option}
                onClick={() => onPeriodChange(option)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selected === option
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                {option === 'custom'
                ? 'Custom'
                : option}
            </button>
            ))}
        </div>

        {selected === 'custom' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2 text-left">
                                Start date
                            </p>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                onStartDateChange(
                                    e.target.value
                                )
                                }
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2 text-left">
                                End date
                            </p>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                onEndDateChange(
                                    e.target.value
                                )
                                }
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                        <button
                            onClick={onApply}
                            className="w-full lg:w-auto bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                        Apply filter
                        </button>
                </div>
            </div>
            )}
        </div>

    );
    }

export default DateFilter;
