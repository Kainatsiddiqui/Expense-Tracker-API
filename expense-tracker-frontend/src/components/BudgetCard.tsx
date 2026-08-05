type BudgetCardProps = {
  monthly_budget: number;
  spent: number;
  remaining: number;
  percentage_used: number;
};

function BudgetCard({
  monthly_budget,
  spent,
  remaining,
  percentage_used
  }: BudgetCardProps) {
    const progress = Math.min(percentage_used, 100);

    let progressColor = 'bg-green-500';

    if (percentage_used >= 80) {
      progressColor = 'bg-yellow-500';
    }
    
    if (percentage_used >= 100) {
      progressColor = 'bg-red-500';
    }

  return (
    <div className="space-y-6">
      {/* Budget metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">
            Budget
          </p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            ₹{monthly_budget.toLocaleString("en-IN")}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Spent
          </p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            ₹{spent.toLocaleString("en-IN")}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Remaining
          </p>
          <p
            className={`text-lg font-semibold mt-1 ${
              remaining >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            ₹{remaining.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Progress section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Budget utilization
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>
            {percentage_used.toFixed(1)}% used
          </span>
          <span>
            {(100 - Math.min(percentage_used, 100)).toFixed(1)}% remaining
          </span>
        </div>
      </div>
    </div>
  );
}

export default BudgetCard;
