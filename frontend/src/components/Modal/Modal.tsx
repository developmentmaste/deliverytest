import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import s from './Modal.module.scss';

interface Props {
  orderId: string;
  onClose: () => void;
}

export default function Modal({ orderId, onClose }: Props) {
  const { t }   = useTranslation();
  const navigate = useNavigate();

  const handleTrack = () => {
    onClose();
    navigate('/history');
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.icon}>🎉</div>
        <h2 className={s.title}>{t('modal.title')}</h2>
        <p className={s.text}>{t('modal.text')}</p>
        <div className={s.orderId}>{orderId}</div>
        <button className={s.btn} onClick={handleTrack}>
          {t('modal.track')}
        </button>
      </div>
    </div>
  );
}
