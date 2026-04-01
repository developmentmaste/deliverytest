import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import s from './Modal.module.scss';
export default function Modal({ orderId, onClose }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleTrack = () => {
        onClose();
        navigate('/history');
    };
    return (_jsx("div", { className: s.overlay, onClick: onClose, children: _jsxs("div", { className: s.modal, onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: s.icon, children: "\uD83C\uDF89" }), _jsx("h2", { className: s.title, children: t('modal.title') }), _jsx("p", { className: s.text, children: t('modal.text') }), _jsx("div", { className: s.orderId, children: orderId }), _jsx("button", { className: s.btn, onClick: handleTrack, children: t('modal.track') })] }) }));
}
