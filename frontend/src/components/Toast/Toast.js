import { jsx as _jsx } from "react/jsx-runtime";
import { useToastStore } from '../../store/toastStore';
import s from './Toast.module.scss';
export default function Toast() {
    const { message, visible } = useToastStore();
    return (_jsx("div", { className: `${s.toast} ${visible ? s.show : ''}`, children: message }));
}
