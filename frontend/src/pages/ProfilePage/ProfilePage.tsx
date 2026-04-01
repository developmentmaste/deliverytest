import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Theme } from '../../App';
import s from './ProfilePage.module.scss';

interface ProfileData {
  name: string;
  email: string;
  address: string;
  phone: string;
}

const STORAGE_KEY = 'clover-profile';

interface Props { theme: Theme; toggleTheme: () => void; }

export default function ProfilePage({ theme, toggleTheme }: Props) {
  const { t, i18n } = useTranslation();

  const [profile, setProfile] = useState<ProfileData>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  });
  const [saved, setSaved] = useState(false);

  const update = (key: keyof ProfileData, val: string) =>
    setProfile((p) => ({ ...p, [key]: val }));

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('clover-lang', lng);
  };

  const displayName  = profile.name  || t('profile.guest');
  const displayEmail = profile.email || t('profile.noEmail');
  const avatarLetter = (profile.name || '?')[0].toUpperCase();

  return (
    <div className={s.page}>
      <div className="section-wrap">
        <div className="section-title">{t('profile.title')}</div>

        <div className={s.layout}>
          {/* Avatar card */}
          <div>
            <div className={s.avatarCard}>
              <div className={s.avatar}>{avatarLetter}</div>
              <div className={s.displayName}>{displayName}</div>
              <div className={s.displayEmail}>{displayEmail}</div>
            </div>
          </div>

          {/* Settings */}
          <div className={s.settings}>
            {/* Personal data */}
            <div className={s.settingsSection}>
              <div className={s.sectionTitle}>{t('profile.personal')}</div>

              <div className="form-group">
                <label className="form-label">{t('profile.name')}</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder={t('profile.namePlaceholder')}
                  value={profile.name || ''}
                  onChange={(e) => update('name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('profile.email')}</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={profile.email || ''}
                  onChange={(e) => update('email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('profile.phone')}</label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="+380 50 000 0000"
                  value={profile.phone || ''}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('profile.address')}</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder={t('profile.addressPlaceholder')}
                  value={profile.address || ''}
                  onChange={(e) => update('address', e.target.value)}
                />
              </div>

              <button className={s.saveBtn} onClick={save}>
                {saved ? t('profile.saved') : t('profile.save')}
              </button>
            </div>

            {/* App settings */}
            <div className={s.settingsSection}>
              <div className={s.sectionTitle}>{t('profile.settings')}</div>

              {/* Dark theme */}
              <div className={s.settingRow}>
                <div>
                  <div className={s.settingLabel}>{t('profile.darkTheme')}</div>
                  <div className={s.settingDesc}>{t('profile.darkThemeDesc')}</div>
                </div>
                <label className={s.toggle}>
                  <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                  <span className={s.toggleSlider} />
                </label>
              </div>

              {/* Language */}
              <div className={s.settingRow}>
                <div>
                  <div className={s.settingLabel}>{t('lang.label')}</div>
                </div>
                <div className={s.langPicker}>
                  <button
                    className={`${s.langBtn} ${i18n.language === 'uk' ? s.active : ''}`}
                    onClick={() => changeLang('uk')}
                  >
                    🇺🇦 {t('lang.uk')}
                  </button>
                  <button
                    className={`${s.langBtn} ${i18n.language === 'en' ? s.active : ''}`}
                    onClick={() => changeLang('en')}
                  >
                    🇬🇧 {t('lang.en')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
