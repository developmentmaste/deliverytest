import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import s from './ProfilePage.module.scss';
const STORAGE_KEY = 'clover-profile';
export default function ProfilePage({ theme, toggleTheme }) {
    const { t, i18n } = useTranslation();
    const [profile, setProfile] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        }
        catch {
            return {};
        }
    });
    const [saved, setSaved] = useState(false);
    const update = (key, val) => setProfile((p) => ({ ...p, [key]: val }));
    const save = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };
    const changeLang = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('clover-lang', lng);
    };
    const displayName = profile.name || t('profile.guest');
    const displayEmail = profile.email || t('profile.noEmail');
    const avatarLetter = (profile.name || '?')[0].toUpperCase();
    return (_jsx("div", { className: s.page, children: _jsxs("div", { className: "section-wrap", children: [_jsx("div", { className: "section-title", children: t('profile.title') }), _jsxs("div", { className: s.layout, children: [_jsx("div", { children: _jsxs("div", { className: s.avatarCard, children: [_jsx("div", { className: s.avatar, children: avatarLetter }), _jsx("div", { className: s.displayName, children: displayName }), _jsx("div", { className: s.displayEmail, children: displayEmail })] }) }), _jsxs("div", { className: s.settings, children: [_jsxs("div", { className: s.settingsSection, children: [_jsx("div", { className: s.sectionTitle, children: t('profile.personal') }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t('profile.name') }), _jsx("input", { className: "form-input", type: "text", placeholder: t('profile.namePlaceholder'), value: profile.name || '', onChange: (e) => update('name', e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t('profile.email') }), _jsx("input", { className: "form-input", type: "email", placeholder: "you@example.com", value: profile.email || '', onChange: (e) => update('email', e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t('profile.phone') }), _jsx("input", { className: "form-input", type: "tel", placeholder: "+380 50 000 0000", value: profile.phone || '', onChange: (e) => update('phone', e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t('profile.address') }), _jsx("input", { className: "form-input", type: "text", placeholder: t('profile.addressPlaceholder'), value: profile.address || '', onChange: (e) => update('address', e.target.value) })] }), _jsx("button", { className: s.saveBtn, onClick: save, children: saved ? t('profile.saved') : t('profile.save') })] }), _jsxs("div", { className: s.settingsSection, children: [_jsx("div", { className: s.sectionTitle, children: t('profile.settings') }), _jsxs("div", { className: s.settingRow, children: [_jsxs("div", { children: [_jsx("div", { className: s.settingLabel, children: t('profile.darkTheme') }), _jsx("div", { className: s.settingDesc, children: t('profile.darkThemeDesc') })] }), _jsxs("label", { className: s.toggle, children: [_jsx("input", { type: "checkbox", checked: theme === 'dark', onChange: toggleTheme }), _jsx("span", { className: s.toggleSlider })] })] }), _jsxs("div", { className: s.settingRow, children: [_jsx("div", { children: _jsx("div", { className: s.settingLabel, children: t('lang.label') }) }), _jsxs("div", { className: s.langPicker, children: [_jsxs("button", { className: `${s.langBtn} ${i18n.language === 'uk' ? s.active : ''}`, onClick: () => changeLang('uk'), children: ["\uD83C\uDDFA\uD83C\uDDE6 ", t('lang.uk')] }), _jsxs("button", { className: `${s.langBtn} ${i18n.language === 'en' ? s.active : ''}`, onClick: () => changeLang('en'), children: ["\uD83C\uDDEC\uD83C\uDDE7 ", t('lang.en')] })] })] })] })] })] })] }) }));
}
