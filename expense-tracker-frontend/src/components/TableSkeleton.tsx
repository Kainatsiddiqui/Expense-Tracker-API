function TableSkeleton() {
return ( <div className="w-full bg-white rounded-xl shadow"> <div className="overflow-x-auto"> <table className="w-full min-w-[900px]"> <thead className="bg-gray-50 border-b"> <tr> <th className="text-left px-6 py-4">
Date </th> <th className="text-left px-6 py-4">
Title </th> <th className="text-left px-6 py-4">
Category </th> <th className="text-right px-6 py-4">
Amount </th> <th className="text-center px-6 py-4">
Actions </th> </tr> </thead>

      <tbody>
        {Array.from({ length: 6 }).map((_, index) => (
          <tr
            key={index}
            className="border-b"
          >
            <td className="px-6 py-4">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </td>

            <td className="px-6 py-4">
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            </td>

            <td className="px-6 py-4">
              <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
            </td>

            <td className="px-6 py-4 text-right">
              <div className="h-4 w-20 bg-gray-200 rounded ml-auto animate-pulse" />
            </td>

            <td className="px-6 py-4">
              <div className="flex justify-center gap-3">
                <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

);
}

export default TableSkeleton;
