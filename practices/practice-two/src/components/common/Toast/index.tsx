import { FC, SVGProps } from "react";
import { ToastVariant, useToastStore } from "@/stores";
import {
	CheckCircleIcon,
	XCircleIcon,
	InformationCircleIcon,
	ExclamationTriangleIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";

interface VariantConfig {
	style: string;
	Icon: FC<SVGProps<SVGSVGElement>>;
}

const variantConfig: Record<ToastVariant, VariantConfig> = {
	success: {
		style: "bg-green-100 text-green-800",
		Icon: CheckCircleIcon,
	},
	error: {
		style: "bg-red-100 text-red-800",
		Icon: XCircleIcon,
	},
	info: {
		style: "bg-blue-100 text-blue-800",
		Icon: InformationCircleIcon,
	},
	warning: {
		style: "bg-yellow-100 text-yellow-800",
		Icon: ExclamationTriangleIcon,
	},
};

const Toast: FC = () => {
	const { toasts, removeToast } = useToastStore();

	return (
		<div className="fixed bottom-24 right-12 sm:right-24 z-50 space-y-2">
			{toasts.map(({ id, message, variant }) => {
				const { style, Icon } = variantConfig[variant];

				return (
					<div
						key={id}
						className={`flex items-center p-4 rounded-lg shadow-lg max-w-md animate-slide-in ${style}`}
					>
						<Icon className="w-6 h-6 mr-2" />
						<div className="flex-1">
							<p className="text-sm">{message}</p>
						</div>
						<button
							onClick={() => removeToast(id)}
							className="ml-4 text-current hover:text-opacity-80"
							aria-label="Close toast"
						>
							<XMarkIcon className="w-4 h-4" />
						</button>
					</div>
				);
			})}
		</div>
	);
};

export default Toast;
