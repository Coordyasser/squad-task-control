
// The original file already exists, but we need to add an export for ToastFunction
import { Toast, ToastActionElement, ToastProps } from '@/components/ui/toast';

type ToastFunction = (props: ToastProps) => void;

export type { ToastFunction };

export { useToast, toast } from "@/components/ui/use-toast";
