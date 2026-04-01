import { useToastStore } from '../../store/toastStore';
import s from './Toast.module.scss';

export default function Toast() {
  const { message, visible } = useToastStore();
  return (
    <div className={`${s.toast} ${visible ? s.show : ''}`}>
      {message}
    </div>
  );
}
