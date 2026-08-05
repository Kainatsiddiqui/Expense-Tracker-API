type ToastProps = {
message: string;
type?: "success" | "error";
};

function Toast({
message,
type = "success",
}: ToastProps) {
    const bgColor =
    type === "success"
    ? "bg-green-600"
    : "bg-red-600";

    return (
    <div
    className={`${bgColor} text-white px-4 py-3 rounded-xl shadow-lg min-w-[300px]`}
    >
    {message} </div>
    );
}

export default Toast;
